// server.js
// Servidor Node.js + Express para el Catálogo Grayer.
//
// CÓMO FUNCIONA:
// 1. Al iniciar (y cada vez que se llama a /api/products) escanea la carpeta
//    img/ en disco con fs.readdirSync.
// 2. Cruza cada archivo de imagen encontrado con el catálogo "conocido"
//    definido en data/catalog.js (por nombre de archivo).
// 3. Si una imagen existe en disco pero NO está en el catálogo conocido,
//    se genera automáticamente una ficha de producto de relleno (rotando
//    línea/colores/tallas/precio), para que SIEMPRE se muestren todas las
//    fotos que coloques en img/, aunque no les hayas puesto datos.
// 4. Expone /api/products con el JSON final ya armado, listo para que el
//    frontend (public/index.html) lo consuma y renderice el catálogo.
//
// CÓMO USAR:
//   1) npm install
//   2) Copia tus fotos reales dentro de la carpeta img/ (img001.jpg, img002.jpg...)
//   3) npm start
//   4) Abre http://localhost:3000

const express = require("express");
const fs = require("fs");
const path = require("path");
const { sections: knownSections, LINES } = require("./data/catalog");

const app = express();
const PORT = process.env.PORT || 3000;

const IMG_DIR = path.join(__dirname, "img");
const VALID_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

// Asegura que la carpeta img/ exista para que no truene en una instalación nueva.
if (!fs.existsSync(IMG_DIR)) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  console.log(`📁 Carpeta img/ creada en ${IMG_DIR}. Coloca ahí tus fotos.`);
}

// ─── Pools usados para generar fichas de relleno cuando una imagen no tiene
//     metadata en data/catalog.js ───────────────────────────────────────────
const LINE_KEYS = Object.keys(LINES);
const COLOR_POOL = [
  "Negro · Blanco", "Negro · Camel", "Negro · Nude", "Beige · Negro",
  "Vino · Blanco", "Miel · Negro", "Plomo · Blanco", "Arena · Nude", "Café · Blanco",
];
const SIZE_POOL = ["34-40", "35-40", "34-41", "35-41"];
const PRICE_POOL = [24.99, 27.50, 32.99, 34.99, 37.50, 39.99];

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function listImageFiles() {
  return fs
    .readdirSync(IMG_DIR)
    .filter((f) => VALID_EXT.has(path.extname(f).toLowerCase()))
    .sort(naturalSort);
}

// Construye el catálogo final cruzando archivos reales en disco con los
// datos conocidos. Devuelve { sections, totalImages, knownCount, autoCount }
function buildCatalog() {
  const filesOnDisk = listImageFiles();
  const filesSet = new Set(filesOnDisk);

  // Mapa imagen -> producto conocido (aplanando data/catalog.js)
  const knownByImg = new Map();
  knownSections.forEach((sec) => {
    sec.products.forEach((p) => {
      knownByImg.set(p.img, { ...p, sectionTitle: sec.title, sectionTag: sec.tag });
    });
  });

  // 1. Secciones conocidas: solo incluir productos cuya imagen SÍ exista en disco.
  const finalSections = [];
  let knownCount = 0;

  knownSections.forEach((sec) => {
    const products = sec.products
      .filter((p) => filesSet.has(p.img))
      .map((p) => {
        knownCount++;
        const line = LINES[sec.tag] || LINES.deportivo;
        return {
          img: p.img,
          name: p.name,
          ref: p.ref,
          colors: p.colors,
          sizes: p.sizes,
          price: p.price.toFixed(2),
          line: line.label,
          tag: sec.tag,
          ribbonCls: line.ribbon,
        };
      });
    if (products.length) {
      const line = LINES[sec.tag] || LINES.deportivo;
      finalSections.push({
        title: sec.title,
        tag: sec.tag,
        badgeCls: line.badge,
        products,
      });
    }
  });

  // 2. Imágenes huérfanas: existen en disco pero no están en data/catalog.js.
  //    Se generan fichas automáticas rotando línea/color/talla/precio para
  //    que NUNCA se pierda una foto que el usuario coloque en img/.
  const orphanFiles = filesOnDisk.filter((f) => !knownByImg.has(f));
  if (orphanFiles.length) {
    const autoProducts = orphanFiles.map((file, i) => {
      const lineKey = LINE_KEYS[i % LINE_KEYS.length];
      const line = LINES[lineKey];
      const idxMatch = file.match(/(\d+)/);
      const idx = idxMatch ? idxMatch[1] : String(i + 1).padStart(3, "0");
      return {
        img: file,
        name: `MODELO ${idx}`,
        ref: `REF-${idx}`,
        colors: COLOR_POOL[i % COLOR_POOL.length],
        sizes: SIZE_POOL[i % SIZE_POOL.length],
        price: PRICE_POOL[i % PRICE_POOL.length].toFixed(2),
        line: line.label,
        tag: lineKey,
        ribbonCls: line.ribbon,
      };
    });

    finalSections.push({
      title: "Colección Completa",
      tag: "all",
      badgeCls: "",
      products: autoProducts,
    });
  }

  return {
    sections: finalSections,
    totalImages: filesOnDisk.length,
    knownCount,
    autoCount: orphanFiles.length,
  };
}

// ─── Middlewares ────────────────────────────────────────────────────────────
app.use(express.json());
app.use("/img", express.static(IMG_DIR, { maxAge: "1d" }));
app.use(express.static(path.join(__dirname, "public")));

// ─── API ────────────────────────────────────────────────────────────────────
app.get("/api/products", (req, res) => {
  try {
    const catalog = buildCatalog();
    res.json(catalog);
  } catch (err) {
    console.error("Error construyendo el catálogo:", err);
    res.status(500).json({ error: "No se pudo leer la carpeta img/" });
  }
});

// Fuerza un re-escaneo explícito (útil si agregas fotos sin reiniciar el server)
app.get("/api/refresh", (req, res) => {
  const catalog = buildCatalog();
  res.json({ ok: true, ...catalog });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, imgDir: IMG_DIR });
});

// Cualquier otra ruta -> index.html (SPA simple)
app.get("*", (req, res) => {
  res.sendFile
    ? res.sendFile(path.join(__dirname, "public", "index.html"))
    : res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  const { totalImages, knownCount, autoCount } = buildCatalog();
  console.log("─────────────────────────────────────────────");
  console.log(`  👠  Grayer — Catálogo corriendo`);
  console.log(`  ➜  http://localhost:${PORT}`);
  console.log(`  📁  Carpeta de imágenes: ${IMG_DIR}`);
  console.log(`  🖼️   Imágenes detectadas: ${totalImages}`);
  console.log(`     · Con datos definidos: ${knownCount}`);
  console.log(`     · Generadas automáticamente: ${autoCount}`);
  console.log("─────────────────────────────────────────────");
});
