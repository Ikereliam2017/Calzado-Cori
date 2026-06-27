# Grayer — Catálogo dinámico (Node.js + Express)

Catálogo de calzado con servidor Node.js que **lee automáticamente la carpeta `img/`**.
Cada vez que agregas, quitas o reemplazas una foto en `img/`, el catálogo se actualiza solo —
no hay que tocar código ni HTML.

## 🚀 Instalación

```bash
npm install
```

## ▶️ Uso

1. Copia todas tus fotos reales dentro de la carpeta `img/` (acepta `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`).
   - Si el nombre del archivo coincide con uno definido en `data/catalog.js` (ej. `img001.jpg`), el producto
     se mostrará con su nombre, referencia, colores, tallas y precio reales.
   - Si subes una foto con un nombre que **no** está en `data/catalog.js` (por ejemplo `img150.jpg`), de
     todas formas aparecerá en el catálogo, en la sección "Colección Completa", con datos generados
     automáticamente (nombre tipo "MODELO 150", precio y colores rotados). Así nunca se pierde una foto.

2. Arranca el servidor:

```bash
npm start
```

3. Abre tu navegador en:

```
http://localhost:3000
```

La terminal te mostrará cuántas imágenes detectó, cuántas tienen datos completos y cuántas se generaron
automáticamente:

```
👠  Grayer — Catálogo corriendo
➜  http://localhost:3000
📁  Carpeta de imágenes: .../img
🖼️   Imágenes detectadas: 310
   · Con datos definidos: 45
   · Generadas automáticamente: 265
```

## ✏️ Editar los datos de un producto

Abre `data/catalog.js` y agrega o edita una entrada dentro de la sección que corresponda:

```js
{ img: "img150.jpg", name: "VALENTINA", ref: "C123456", colors: "Negro · Camel", sizes: "35-40", price: 32.99 }
```

No necesitas reiniciar el servidor para que tome los cambios de imágenes: el catálogo se reconstruye en
cada visita a la página (lee la carpeta `img/` en cada petición a `/api/products`). Si editas
`data/catalog.js`, sí debes reiniciar el servidor (`npm start`) para que tome los nuevos datos.

## 📂 Estructura del proyecto

```
grayer/
├── server.js          ← servidor Express, escanea img/ y expone /api/products
├── data/
│   └── catalog.js      ← catálogo "conocido" (nombre, ref, colores, tallas, precio)
├── img/                ← AQUÍ van tus fotos reales (img001.jpg, img002.jpg, ...)
├── public/
│   ├── index.html       ← estructura de la página
│   ├── styles.css       ← estilos + todas las animaciones decorativas
│   └── app.js            ← lógica del frontend (fetch a la API, filtros, modal, partículas...)
└── package.json
```

## ✨ Qué se animó / decoró respecto a la versión anterior

- Loader de carga inicial con barra de progreso y logo animado.
- Fondo de partículas doradas flotando sobre toda la página (canvas, muy liviano).
- Brillo que sigue al cursor del mouse en el fondo.
- Destellos (sparkles) decorativos en el hero.
- Contador de modelos animado (cuenta hacia arriba al cargar).
- Barra de estado en vivo que muestra cuántas imágenes detectó el servidor en `img/`.
- Tarjetas con animación de entrada escalonada, esqueleto (skeleton) mientras cargan imágenes,
  brillo (shimmer) al pasar el mouse, y resplandor de color según la categoría.
- Botón de favoritos con animación de "latido" y contador flotante de favoritos guardados.
- Botón "subir arriba" que aparece al hacer scroll.
- Buscador con botón para limpiar y contador de resultados con efecto de "rebote".
- Modal de producto con selector de color/talla interactivo y botón directo a WhatsApp con el
  pedido prellenado (modelo, referencia, color, talla y precio).

## 🌐 Endpoints disponibles

- `GET /` → la página del catálogo
- `GET /api/products` → JSON con el catálogo completo (lee `img/` en cada llamada)
- `GET /api/refresh` → fuerza un re-escaneo explícito de `img/`
- `GET /api/health` → chequeo de salud del servidor
- `GET /img/<archivo>` → sirve las imágenes directamente desde la carpeta `img/`
