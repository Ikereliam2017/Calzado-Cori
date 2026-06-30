# Grayer — Catálogo dinámico (Node.js + Express)

Catálogo de calzado con servidor Node.js que lee automáticamente la carpeta `img/`.

## Sobre los precios (este paquete)

Se revisaron las 310 fotos del catálogo Grayer y se leyó el precio impreso en cada una.

- **304 fotos** son fichas de producto con precio visible → tienen su precio real.
- **6 fotos** son portadas o banners promocionales sin ficha de producto (no traen precio
  propio impreso): "MUSH HAVE SHOES" (portada), 2 portadas de edición del catálogo,
  "Destaca Skechers Sport" (promo), "Style Kittenheels" (promo) y "Feliz Día Mamá" (portada).
  Como pediste los 310 productos completos, a estas 6 se les puso el precio del producto
  vecino más cercano como estimado, **no es un precio real leído de la foto**. Quedaron
  marcadas en `data/catalog.js` con el comentario `// SIN PRECIO REAL (heredado del vecino, revisar)`
  para que las ubiques fácil y les pongas el precio correcto si quieres.

Las imágenes se renombraron a `img001.jpg ... img310.jpg` (mismo orden que las fotos
originales) para que coincidan con `data/catalog.js`.

**Sobre nombre/referencia/color/talla:** se priorizó el precio y, cuando fue legible, el
nombre del modelo. La referencia (REF), color y tallas exactas no se transcribieron una por
una (letra muy chica en la foto, alto riesgo de error) y quedaron con valores genéricos
("—", "Ver foto", "35-40"). Si los quieres también, dímelo y los completo con el mismo método.

La categoría (Deportivo / Ortopédico / Tacones / Sneakers / Plataforma / Sport Men) se
asignó de forma aproximada según el tipo de calzado de cada foto — revisa y ajusta en
`data/catalog.js` si algún producto quedó en la categoría equivocada.

## 🚀 Instalación

```bash
npm install
```

## ▶️ Uso

```bash
npm start
```

Abre `http://localhost:3000`.

## ✏️ Editar los datos de un producto

Abre `data/catalog.js` y edita la entrada correspondiente (busca por nombre o por
número de imagen, ej. `img150.jpg`):

```js
{ img: "img150.jpg", name: "VALENTINA", ref: "C123456", colors: "Negro · Camel", sizes: "35-40", price: 32.99 }
```

Reinicia el servidor (`npm start`) después de editar `data/catalog.js`.

## 📂 Estructura del proyecto

```
grayer/
├── server.js
├── data/
│   └── catalog.js
├── img/                ← img001.jpg ... img310.jpg
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── package.json
```

## 🌐 Endpoints disponibles

- `GET /` → la página del catálogo
- `GET /api/products` → JSON con el catálogo completo
- `GET /api/refresh` → fuerza un re-escaneo
- `GET /api/health` → chequeo de salud
