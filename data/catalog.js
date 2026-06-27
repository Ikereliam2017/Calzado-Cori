// data/catalog.js
// Catálogo base de Grayer. Cada entrada se vincula a un archivo de imagen
// dentro de la carpeta img/. El servidor (server.js) cruza esta lista con
// los archivos que realmente existen en img/ para generar el catálogo final:
// - Si la imagen existe -> se muestra el producto con sus datos reales.
// - Si faltan imágenes que SÍ existen en disco pero no están aquí abajo ->
//   se generan automáticamente como "Modelo NNN" con datos de relleno,
//   para que nunca se pierda ninguna foto que coloques en img/.

const LINES = {
  deportivo:  { label: "Deportivo",          badge: "sh-sport",    ribbon: "ribbon-sport",    icon: "👟" },
  ortopedico: { label: "Ortopédico",         badge: "sh-ortho",    ribbon: "ribbon-ortho",    icon: "🌿" },
  tacones:    { label: "Tacones",            badge: "sh-tacones",  ribbon: "ribbon-tacones",  icon: "👠" },
  sneakers:   { label: "Sneakers",           badge: "sh-sneakers", ribbon: "ribbon-sneakers", icon: "⭐" },
  plataforma: { label: "Plataforma",         badge: "sh-plat",     ribbon: "ribbon-plat",     icon: "💜" },
  men:        { label: "Sport Men",          badge: "sh-men",      ribbon: "ribbon-men",      icon: "👞" },
};

const sections = [
  {
    title: "Mini Tacones",
    tag: "tacones",
    products: [
      { img: "img308.jpg", name: "AMANDA",   ref: "952613", colors: "Negro · Camel", sizes: "35-40", price: 34.99 },
      { img: "img309.jpg", name: "ZULEYKA",  ref: "962606", colors: "Negro · Miel",  sizes: "35-40", price: 34.99 },
    ]
  },
  {
    title: "Plataformas",
    tag: "plataforma",
    products: [
      { img: "img006.jpg", name: "BELINA",     ref: "P962609", colors: "Negro · Beige",  sizes: "35-39", price: 37.50 },
      { img: "img007.jpg", name: "MUSH HAVE",  ref: "—",       colors: "Camel · Arena",  sizes: "35-40", price: 34.99 },
    ]
  },
  {
    title: "Calzado Ortopédico — Línea Confort",
    tag: "ortopedico",
    products: [
      { img: "img279.jpg", name: "VICTORIA", ref: "M962610", colors: "Negro · Miel",         sizes: "34-41", price: 34.99 },
      { img: "img281.jpg", name: "DALILA",   ref: "B932572", colors: "Negro · Blanco",       sizes: "35-40", price: 32.99 },
      { img: "img291.jpg", name: "ROSARIA",  ref: "C962646", colors: "Miel Matizado · Negro", sizes: "34-41", price: 34.99 },
      { img: "img295.jpg", name: "CAMELIA",  ref: "B952627", colors: "Negro · Yute",         sizes: "35-40", price: 24.99 },
    ]
  },
  {
    title: "Sneakers — Colección Floral",
    tag: "sneakers",
    products: [
      { img: "img008.jpg", name: "CARMELA", ref: "D962658", colors: "Negro · Blanco · Chocolate", sizes: "34-40", price: 34.99 },
      { img: "img009.jpg", name: "ELISA",   ref: "D962657", colors: "Negro · Vino · Blanco",      sizes: "34-40", price: 34.99 },
    ]
  },
  {
    title: "Línea Ortopédica — Sandalias Confort",
    tag: "ortopedico",
    products: [
      { img: "img014.jpg", name: "NAYARA",     ref: "C932567", colors: "Negro · Oro · Matiz",     sizes: "35-40", price: 34.99 },
      { img: "img015.jpg", name: "ANTONELLA",  ref: "C862403", colors: "Negro · Miel",            sizes: "35-40", price: 34.99 },
      { img: "img016.jpg", name: "ANGELA",     ref: "C892544", colors: "Beige · Negro",           sizes: "35-40", price: 34.99 },
      { img: "img017.jpg", name: "JULIANA",    ref: "C922553", colors: "Negro · Miel",            sizes: "35-40", price: 34.99 },
      { img: "img018.jpg", name: "BRENDA",     ref: "C872421", colors: "Negro · Camel",           sizes: "35-40", price: 34.99 },
      { img: "img019.jpg", name: "LENAY",      ref: "C872422", colors: "Negro · Oro · Matiz",     sizes: "35-40", price: 34.99 },
      { img: "img020.jpg", name: "LYGIA",      ref: "C932566", colors: "Beige · Negro",           sizes: "35-40", price: 34.99 },
      { img: "img021.jpg", name: "CELIANE",    ref: "B932574", colors: "Rojo · Negro",            sizes: "35-40", price: 32.99 },
      { img: "img022.jpg", name: "ORIANA",     ref: "B902574", colors: "Negro · Miel · Blanco",   sizes: "35-40", price: 32.99 },
      { img: "img023.jpg", name: "VALERIA",    ref: "B932575", colors: "Negro · Verde",           sizes: "35-40", price: 32.99 },
      { img: "img024.jpg", name: "YARITZA",    ref: "B922554", colors: "Negro · Blanco",          sizes: "35-40", price: 32.99 },
      { img: "img025.jpg", name: "DANIA",      ref: "B922558", colors: "Negro · Arena",           sizes: "35-40", price: 32.99 },
      { img: "img026.jpg", name: "CASIANA",    ref: "B932576", colors: "Negro · Bronce",          sizes: "35-40", price: 32.99 },
      { img: "img027.jpg", name: "LETICIA",    ref: "B932578", colors: "Negro · Nude · Verde",    sizes: "35-41", price: 27.50 },
      { img: "img028.jpg", name: "AMARA",      ref: "B942614", colors: "Miel · Negro · Fucsia",   sizes: "35-41", price: 27.50 },
      { img: "img029.jpg", name: "CANSU",      ref: "B932584", colors: "Negro · Blanco",          sizes: "35-41", price: 27.50 },
      { img: "img030.jpg", name: "AURICELIA",  ref: "B932580", colors: "Negro · Bronce",          sizes: "35-41", price: 27.50 },
      { img: "img031.jpg", name: "BABETTE",    ref: "B912505", colors: "Negro · Bronce",          sizes: "35-41", price: 27.50 },
      { img: "img032.jpg", name: "JIMENA",     ref: "B902561", colors: "Blanco · Miel · Negro",   sizes: "35-41", price: 27.50 },
      { img: "img033.jpg", name: "AYDAN",      ref: "B932583", colors: "Negro · Animal Print",    sizes: "35-41", price: 27.50 },
      { img: "img034.jpg", name: "ASYA",       ref: "B922566", colors: "Negro · Miel",            sizes: "35-41", price: 27.50 },
      { img: "img035.jpg", name: "DAVINIA",    ref: "B922564", colors: "Negro · Nude",            sizes: "35-41", price: 27.50 },
      { img: "img036.jpg", name: "GISELE",     ref: "B932581", colors: "Negro · Rojo",            sizes: "35-41", price: 27.50 },
    ]
  },
  {
    title: "Línea Deportiva Ortopédica",
    tag: "deportivo",
    products: [
      { img: "img037.jpg", name: "BIENESTAR", ref: "D912518", colors: "Negro · Rosa · Vino · Petróleo · Café · Blanco", sizes: "35-41", price: 34.99 },
      { img: "img038.jpg", name: "RITA",      ref: "D922550", colors: "Negro · Rosa · Petróleo",                       sizes: "35-41", price: 34.99 },
    ]
  },
  {
    title: "Sport Men — Calzado Masculino",
    tag: "men",
    products: [
      { img: "img041.jpg", name: "NESTOR", ref: "H1225148", colors: "Blanco · Café · Negro", sizes: "38-43", price: 39.99 },
    ]
  },
  {
    title: "Zapatillas Deportivas — Colección Principal",
    tag: "deportivo",
    products: [
      { img: "img001.jpg", name: "VIVIANA", ref: "D932545", colors: "Negro · Blanco Plomo",   sizes: "34-40", price: 34.99 },
      { img: "img002.jpg", name: "REBECA",  ref: "D902578", colors: "Negro · Camel · Blanco", sizes: "34-40", price: 34.99 },
      { img: "img003.jpg", name: "DELFINA", ref: "D932550", colors: "Negro · Blanco",         sizes: "34-40", price: 34.99 },
      { img: "img004.jpg", name: "ALDINA",  ref: "D932547", colors: "Negro · Arena · Blanco", sizes: "34-40", price: 32.99 },
      { img: "img005.jpg", name: "PIERINA", ref: "D932555", colors: "Plomo · Café · Blanco",  sizes: "34-40", price: 34.99 },
    ]
  },
];

module.exports = { sections, LINES };
