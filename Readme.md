<div style='display: flex; justify-content: center; width: 100%;'><img src='src/assets/images/a11y.png' style='width: 120px; height: 120px; border-radius: 50%; margin: 0 auto;' /></div>

# A11Y Inspector - Chrome Extension

En este repositorio se encuentra el código de la extensión de Chrome A11Y Inspector.

## Instalación + Configuración del proyecto

Tras clonar el repositorio, instalar las dependencias con `npm install`.

El desarrollo de la extensión se ha llevado a cabo utilizando React y Vite, habilitando el fast refresh con:

[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/)

Para lanzar la extensión en modo desarrollo, lanzar `npm run dev`, gracias al fast refresh podremos ver en tiempo real los cambios realizados en el código.

Para generar el paquete de la extensión, lanzar el comando `npm run build`, esto generará una carpeta dist, que será la que debemos cargar a chrome como extensión descomprimida.

## Desarrollo de aplicación

**A11y Analyzer** es una extensión para Chrome que analiza la siguiente información del DOM del tab en el que se ejecuta:

- **Resumen:** Resumen de algunos datos esenciales.
- **Enlaces:** Analiza los enlaces "a" .
- **Botones:** Analiza los botones "button".
- **Navegación por teclado:** Analiza la navegación por teclado de los elementos interactivos.
- **Formularios:** Analiza los elementos propios de formularios <form>.
- **Headings:** Estructura de encabezados h1-h6.
- **Internal Linking:** Lista y analiza los enlaces internos.
- **Imágenes:** Recoge las imágenes de la página y obtiene la información de textos alternativos y pesos.
  
Todas las secciones de análisis pueden **filtrar los resultados** mostrados en función del estatus de resultado obtenido (OK, WARNING o DANGER).

Al hacer click sobre los elementos del DOM extraídos del análisis en el listado mostrado, la página hará scroll hasta el elemento en cuestión y lo **resaltará modificando sus estilos css**.
Estos estilos se retirarán del elemento en cuestión al volver a hacer click sobre él en el listado.
  
Esta funcionalidad funcionará con los elementos visibles del DOM pero no con los ocultos.
  
### Resumen

Recoge info esencial de la página así como su URL y el Title y muestra las siguientes comprobaciones:

- Que la página contiene una etiqueta <main> 
- Que contiene un atributo "lang" y este es acorde al idioma del contenido expuesto.

### Enlaces

Lista los enlaces `<a>` y puede mostrar los siguientes errores o advertencias:

- `REVISAR: Anidamiento dentro del enlace` En caso de que haya alguno de los siguientes elementos anidados: 

"a",
"button",
"details",
"embed",
"iframe",
"input",
"keygen",
"label",
"menu",
"object",
"select",
"textarea",
"video"

- `REVISAR: Etiquetar como button si no lanza navegación` En caso de que el enlace no lance una navegación.

### Botones

Lista los botones `<button>` y puede mostrar los siguientes errores o advertencias:

- `REVISAR: anidamiento puede causar comportamiento inesperado` En caso de que haya alguno de los siguientes elementos anidados:

"abbr",
"b",
"bdi",
"bdo",
"br",
"cite",
"code",
"data",
"dfn",
"em",
"i",
"kbd",
"mark",
"q",
"rp",
"rt",
"ruby",
"s",
"samp",
"small",
"span",
"strong",
"sub",
"sup",
"svg",
"time",
"u",
"var",
"wbr"

### Navegación por teclado

Lista los elementos interactivos: 

"a",
"button",
"input",
"textarea",
"select",
"details",
"label"

O cuyo role sea igual a:

"link",
"button",
"checkbox",
"radio",
"textbox",
"combobox",
"menuitem"

Analiza si son tabulables y si se encuentran visibles y en base a ese criterio puede mostrar los siguientes errores y advertencias:

- `REVISAR: operabilidad por teclado`

- `Elemento interactivo no visible`
  
  
### Formularios

Lista los elementos de formulario del tipo `<button>`, `<input>` y `<textarea>` y puede mostrar los siguientes errores y advertencias:

- `REVISAR: elemento no tiene label` Cuando el elemento es un input y no va acompañado de un label o un atributo "aria-label".

- `REVISAR: elemento no está dentro de un formulario` Cuando el elemento no es un boton tipo "button" y no se encuentra dentro de una etiqueta <form>.
  
### Headings

Analiza todos los encabezados desde `<h1>` hasta `<h6>` y la estructura. Aparecerá un error en el caso que no exista el `<h1>`.
  
### Internal Linking

Lista los enlaces internos de la página, los agrupa, y aporta información del texto que acompaña al enlace, y sus atributos `rel`, `title` y `aria-label`.
  
### Imágenes

Recoge y lista todas las imágenes de la página. Obtiene información de las mismas y la muestra.

En caso que no exista el texto alternativo de la misma, lanza un danger y en caso de que l texto no sea descriptivo un warning.

Si el peso de la imagen supera los 200 KB, mostrará un error. Si el peso está entre los 100 KB y los 200 KB, el mensaje será de warning.

  

