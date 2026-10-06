# La Trama · Asociación Cultural y Juvenil · Espacio de Dinamización Rural

Sitio web estático y multilingüe de **La Trama**, una asociación cultural y juvenil y
espacio de dinamización rural (contenido ficticio de ejemplo).

Diseñado a partir de la estructura y la limpieza visual de [aticoi.es](https://www.aticoi.es/),
adaptado a la identidad de la asociación: metáfora del tejido, paleta de colores tierra
(tinta `#17130e`, crema `#f7f2e8`, papel `#fffdf7`, terracota `#c4552e`, bosque `#2c5545`,
ocre `#e0a33e`) y tipografías Fraunces + Inter.

---

## Contenido

| Página            | Archivo          | Secciones principales                                                        |
| ----------------- | ---------------- | ---------------------------------------------------------------------------- |
| Portada           | `index.html`     | Hero con slider, quiénes somos, 4 líneas de trabajo, actividades destacadas, agenda, voces, CTA |
| Asociación        | `asociacion.html`| Historia, misión y valores, cifras, cronología 2011–2025, equipo, red de entidades |
| Actividades       | `actividades.html`| 6 programas (cultura, juventud, rural, formación) y FAQ con acordeón         |
| Agenda            | `agenda.html`    | 8 eventos con filtros por línea de trabajo                                   |
| Noticias          | `noticias.html`  | Noticia destacada, tarjetas editoriales y boletín                            |
| Contacto          | `contacto.html`  | Formulario con validación, info práctica, horarios, mapa y FAQ               |

## Estructura

```
la-trama/
├── index.html
├── asociacion.html
├── actividades.html
├── agenda.html
├── noticias.html
├── contacto.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css            → sistema de diseño completo (tokens, componentes, responsive)
    ├── js/
    │   ├── i18n.js              → diccionarios ES / GL / EN + motor de traducción
    │   └── main.js              → menú, slider, reveal, acordeón, filtros, formularios
    └── img/
        ├── hero-1.svg … hero-3.svg      → fondos del slider
        ├── act-1.svg … act-6.svg        → tarjetas de actividades
        ├── about.svg                    → telar (portada)
        ├── story.svg                    → cine en la plaza (asociación)
        └── news-featured.svg            → noticia destacada
```

## Cómo abrirlo

No hay build ni dependencias: abre `index.html` directamente en el navegador
(doble clic), o sirve la carpeta con cualquier servidor estático. Funciona también
sobre `file://`.

El selector de idioma (ES / GL / EN) traduce la página al momento y recuerda la
elección en `localStorage` (con soporte para `?lang=gl` en la URL).

## Cómo añadir o corregir traducciones

Todos los textos están en `assets/js/i18n.js`, dentro de los objetos `es`, `gl` y
`en`. Cada página referencia las claves con atributos:

- `data-i18n` → sustituye el texto del elemento
- `data-i18n-html` → sustituye HTML interno (p. ej. `<em>`, enlaces)
- `data-i18n-ph` → `placeholder` de un campo
- `data-i18n-aria` → `aria-label`
- `data-i18n-title` → título del documento

Para añadir un texto nuevo: crear la clave en los tres idiomas y usar el atributo
correspondiente en el HTML. Si falta una clave, el sistema muestra la versión en
español como respaldo.

## Nota

La dirección (Rúa do Prado, 14 · 27600 Vilalba), teléfono (+34 658 123 456),
correo (hola@latrama.org), cifras y nombres son **contenido de ejemplo** creado
para maquetar el sitio: deben sustituirse por los datos reales de la asociación.
Las ilustraciones SVG están dibujadas a mano para este proyecto.

---

Diseño y desarrollo: sitio de ejemplo · HTML + CSS + JS vanilla, sin dependencias.