<div style='display: flex; justify-content: center; width: 100%;'><img src='src/assets/images/a11y.png' style='width: 120px; height: 120px; border-radius: 50%; margin: 0 auto;' /></div>

# A11Y Inspector - Chrome Extension v.2.0.2

**A11Y Inspector** es una extensión para Chrome que realiza un análisis automatizado de accesibilidad web en la página activa según las directrices WCAG. Identifica problemas comunes y proporciona información clara y precisa para mejorar la accesibilidad del contenido para usuarios de tecnologías asistivas.

## Instalación y configuración del proyecto

Tras clonar el repositorio, instalar las dependencias utilizando `npm install` o `pnpm install`.

El proyecto está desarrollado con React y el framework WXT, que permite utilizar funcionalidades avanzadas como Hot Module Replacement (HMR) y generar paquetes compatibles con múltiples navegadores sin necesidad de modificar el código fuente:

[WXT - Introduction](https://wxt.dev/guide/introduction.html)

Para iniciar la extensión en modo desarrollo, ejecutar `npm run dev` o `pnpm dev`. Gracias al HMR, los cambios realizados se reflejarán inmediatamente en el navegador.

Para generar la versión distribuible de la extensión, ejecutar `npm run build` o `pnpm build`. Esto creará una carpeta `dist` que contiene los paquetes listos para cargarse en los navegadores como extensión descomprimida.

## Desarrollo de la aplicación

**A11Y Inspector** realiza análisis detallados sobre los siguientes aspectos clave del DOM de la pestaña activa:

- **Resumen:** Información general esencial de la página.
- **Enlaces:** Accesibilidad y estructura de enlaces (`<a>`).
- **Botones:** Accesibilidad y estructura de botones (`<button>`).
- **Navegación por teclado:** Operabilidad mediante teclado de elementos interactivos.
- **Formularios:** Estructura y etiquetas de elementos de formularios (`<form>`).
- **Headings:** Jerarquía y estructura de encabezados (`<h1>` a `<h6>`).
- **Internal Linking:** Análisis de enlaces internos y anclas.
- **Imágenes:** Textos alternativos y atributos relacionados con imágenes.

Todas las secciones permiten **filtrar resultados** por estado de accesibilidad (OK, WARNING, DANGER).

Al seleccionar un elemento analizado, la extensión realizará scroll hasta él y lo resaltará visualmente modificando temporalmente sus estilos CSS. Esta funcionalidad solo está disponible para elementos visibles.

# Resumen

El componente **Resumen** proporciona una visión ejecutiva rápida sobre los aspectos fundamentales de accesibilidad presentes en cada página analizada.

### Elementos analizados

- URL de la página
- Título de la página (`<title>`)
- Presencia de la etiqueta principal (`<main>`)
- Atributo de idioma (`lang`) y correspondencia con el contenido

### Criterios de evaluación

- **Título de la página**:
  - Presencia y descriptividad
- **Etiqueta `<main>`**: Presencia como contenedor principal del contenido
- **Idioma de la página**:
  - Definición correcta del atributo `lang`
  - Correspondencia entre idioma declarado y contenido real

### Indicadores visuales

- **Verde:** Elementos correctamente implementados
- **Amarillo:** Advertencias sobre posibles problemas
- **Rojo:** Errores o ausencia de elementos críticos

### Mensajes de error y advertencia

| Mensaje                                 | Caso de aparición                                               | Severidad   |
| --------------------------------------- | --------------------------------------------------------------- | ----------- |
| ⚠️ Etiqueta `<main>` no encontrada      | Ausencia de la etiqueta `<main>`                                | Peligro     |
| ⚠️ Atributo `lang` incorrecto o ausente | Atributo lang ausente o no coincide con el idioma del contenido | Advertencia |
| ⚠️ Página sin título                    | Ausencia de la etiqueta `<title>`                               | Peligro     |

### Funciones principales

- **Análisis automático**: Detecta elementos clave de accesibilidad
- **Detección de idioma**: Verifica automáticamente el idioma del contenido
- **Visualización de métricas**: Muestra métricas como la longitud del título
- **Indicadores visuales**: Código de colores según estado

### Uso técnico

El componente recibe:

- `url`: URL de la página analizada
- `head`: Elemento DOM del encabezado
- `body`: Elemento DOM del cuerpo del documento
- `updateAnalysis`: Función para actualizar el análisis general

### Soporte de accesibilidad

Este componente ayuda a cumplir los siguientes criterios WCAG:

- **2.4.2** Título de la página (Nivel A)
- **3.1.1** Idioma de la página (Nivel A)
- **1.3.1** Información y relaciones (Nivel A)
- **2.4.1** Evitar bloques (Nivel A)

El resumen proporciona una rápida visión general de los elementos fundamentales de accesibilidad que deben estar presentes en todas las páginas.

# Enlaces

El componente **Anchors** analiza todos los enlaces (`<a>`) de una página web para evaluar su accesibilidad según las directrices **WCAG**. Examina aspectos clave como la presencia y calidad del atributo `href`, la descriptividad del texto del enlace y la estructura interna del enlace para asegurar su comprensibilidad, especialmente para usuarios de tecnologías asistivas.

## Elementos analizados

- Enlaces HTML (`<a>`)
- Atributos `href` y su contenido
- Texto descriptivo de los enlaces
- Elementos anidados dentro de los enlaces

## Criterios de evaluación

### Atributo `href`

- **Presencia**: Verifica que el enlace tenga un atributo `href` no vacío
- **Adecuación**: Identifica enlaces sin `href` que deberían etiquetarse como botones

### Texto del enlace

- **Descriptividad**: Evalúa si el texto describe adecuadamente el destino o función del enlace
- **Calidad**: Analiza si el texto evita términos genéricos como "Haz clic aquí" o "Más"
- **Alternativas**: Comprueba el atributo `title` cuando el texto visible no es suficiente

### Estructura

- **Anidamiento válido**: Detecta elementos interactivos incorrectamente anidados dentro de enlaces
- **Compatibilidad**: Identifica estructuras que podrían causar problemas en lectores de pantalla

## Indicadores visuales

| Indicador | Significado                               |
| --------- | ----------------------------------------- |
| ✅        | Enlace correctamente implementado         |
| ⚠️        | Advertencias sobre problemas en el enlace |

## Mensajes de error y advertencia

| Mensaje                                         | Caso de aparición                                          | Severidad   |
| ----------------------------------------------- | ---------------------------------------------------------- | ----------- |
| ⚠️ Revisar anidamiento dentro del enlace        | Enlaces que contienen elementos interactivos anidados      | Advertencia |
| ⚠️ Etiquetar como button si no lanza navegación | Enlaces sin atributo `href` o con `href` vacío             | Advertencia |
| ⚠️ Comprobar que el texto sea descriptivo       | Enlaces con texto genérico o insuficientemente descriptivo | Advertencia |

## Funciones principales

- **Análisis automático**: Evalúa automáticamente todos los enlaces de la página
- **Validación de estructura**: Comprueba que los enlaces no contengan elementos interactivos anidados incorrectamente
- **Evaluación de texto**: Analiza si el texto del enlace describe adecuadamente su destino
- **Filtrado por estado**: Permite filtrar los enlaces por su estado de accesibilidad (`ALL/OK/WARNING`)
- **Highlighting visual**: Al seleccionar un enlace del listado, este se resalta visualmente en la página para facilitar su identificación

## Uso técnico

El componente recibe:

- `tabId`: ID de la pestaña activa
- `body`: Elemento DOM del cuerpo del documento
- `updateAnalysis`: Función para actualizar el análisis general

## Soporte de accesibilidad

Este componente ayuda a cumplir los siguientes criterios WCAG:

- **2.4.4** Propósito de los enlaces (en contexto) (Nivel A)
- **2.4.9** Propósito de los enlaces (solo enlace) (Nivel AAA)
- **4.1.2** Nombre, función, valor (Nivel A)
- **1.3.1** Información y relaciones (Nivel A)

Los enlaces accesibles son fundamentales para la navegación web, especialmente para usuarios de lectores de pantalla que requieren estructuras claras y textos descriptivos para navegar eficientemente.

# Botones

El componente **Buttons** analiza todos los elementos `<button>` de una página web para evaluar su accesibilidad según las directrices **WCAG**. Examina la calidad del texto descriptivo y la estructura interna del botón para asegurar que sean comprensibles y operables por usuarios de tecnologías asistivas.

## Elementos analizados

- Botones HTML (`<button>`)
- Texto descriptivo de los botones
- Estructura y anidamiento del contenido interno

## Criterios de evaluación

### Texto del botón

- **Descriptividad**: Verifica que el texto sea suficientemente descriptivo de la acción
- **Presencia**: Comprueba que exista texto visible o un título alternativo
- **Calidad**: Evalúa si el texto evita términos genéricos como "Haz clic aquí" o "Más"

### Estructura interna

- **Anidamiento válido**: Verifica que los botones solo contengan elementos HTML permitidos
- **Elementos seguros**: Asegura que no haya elementos interactivos incorrectamente anidados dentro de botones
- **Compatibilidad**: Identifica estructuras que podrían causar problemas en lectores de pantalla

## Indicadores visuales

| Indicador                                             | Significado                              |
| ----------------------------------------------------- | ---------------------------------------- |
| ✅                                                    | Botón correctamente implementado         |
| ⚠️                                                    | Advertencia sobre el texto del botón     |
| ⚠️ Anidamiento puede causar comportamiento inesperado | Error en la estructura interna del botón |

## Mensajes de error y advertencia

| Mensaje                                               | Caso de aparición                                                     | Severidad   |
| ----------------------------------------------------- | --------------------------------------------------------------------- | ----------- |
| ⚠️ Anidamiento puede causar comportamiento inesperado | Botón con elementos HTML no permitidos en su interior                 | Peligro     |
| ⚠️ Problemas en texto descriptivo                     | Texto genérico o insuficientemente descriptivo de la acción del botón | Advertencia |
| ⚠️ Texto vacío o insuficiente                         | Botón sin texto o con texto demasiado breve                           | Advertencia |

## Funciones principales

- **Análisis automático**: Evalúa automáticamente todos los botones de la página
- **Validación de estructura**: Comprueba que los botones solo contengan elementos HTML seguros
- **Evaluación de texto**: Analiza si el texto del botón describe adecuadamente su función
- **Filtrado por estado**: Permite filtrar los botones por estado de accesibilidad (`ALL/OK/DANGER`)
- **Highlighting visual**: Al seleccionar un botón del listado, lo resalta visualmente en la página para facilitar su identificación

## Uso técnico

El componente recibe:

- `tabId`: ID de la pestaña activa
- `body`: Elemento DOM del cuerpo del documento
- `updateAnalysis`: Función para actualizar el análisis general

## Soporte de accesibilidad

Este componente ayuda a cumplir los siguientes criterios WCAG:

- **2.4.4** Propósito de los enlaces (en contexto) (Nivel A)
- **2.4.9** Propósito de los enlaces (solo enlace) (Nivel AAA) - aplicado también a botones
- **4.1.2** Nombre, función, valor (Nivel A)
- **2.5.3** Etiqueta en nombre (Nivel A)

Los botones accesibles son esenciales para que todos los usuarios, especialmente aquellos que utilizan tecnologías asistivas, puedan interactuar eficazmente con los elementos interactivos de una página web.

# Navegación por teclado

El componente **Keyboard** analiza todos los elementos interactivos de una página web para evaluar su accesibilidad mediante navegación por teclado. Este análisis es crucial para garantizar que los usuarios que no pueden utilizar un ratón o dispositivo táctil puedan interactuar con todos los elementos de la página, cumpliendo así con los criterios **WCAG** de accesibilidad.

## Elementos analizados

- Elementos HTML interactivos: `a`, `button`, `input`, `textarea`, `select`, `details`, `label`
- Elementos con roles ARIA interactivos: `link`, `button`, `checkbox`, `radio`, `textbox`, `combobox`, `menuitem`

## Criterios de evaluación

### Navegabilidad por teclado

- **Accesibilidad por teclado**: Verifica si los elementos pueden recibir foco mediante teclado (`tabIndex >= 0`)
- **Visibilidad**: Confirma que los elementos interactivos son visibles para el usuario (`offsetParent !== null`)
- **Orden de tabulación**: Identifica elementos que podrían estar fuera del flujo natural de navegación

## Indicadores visuales

| Indicador                            | Significado                                            |
| ------------------------------------ | ------------------------------------------------------ |
| ✅                                   | Elemento correctamente accesible por teclado y visible |
| ⚠️ REVISAR: operabilidad por teclado | Elemento visible pero no accesible por teclado         |
| ⚠️ Elemento interactivo NO VISIBLE   | Elemento no visible pero potencialmente interactivo    |

## Mensajes de error y advertencia

| Mensaje                              | Caso de aparición                                   | Severidad   |
| ------------------------------------ | --------------------------------------------------- | ----------- |
| ⚠️ Elemento interactivo NO VISIBLE   | Elemento interactivo que no es visible en la página | Peligro     |
| ⚠️ REVISAR: operabilidad por teclado | Elemento visible pero no enfocable con teclado      | Advertencia |

## Funciones principales

- **Detección automática**: Identifica todos los elementos potencialmente interactivos
- **Verificación de accesibilidad**: Comprueba si cada elemento puede recibir foco mediante teclado
- **Filtrado por estado**: Permite filtrar elementos por su estado de accesibilidad (`ALL/OK/WARNING/DANGER`)
- **Highlighting visual**: Al hacer clic en un elemento de la lista, lo resalta en la página para facilitar su identificación

## Uso técnico

El componente recibe:

- `tabId`: ID de la pestaña activa
- `updateAnalysis`: Función para actualizar el análisis general con información sobre la accesibilidad por teclado

## Soporte de accesibilidad

Este componente ayuda a cumplir los siguientes criterios WCAG:

- **2.1.1** Teclado (Nivel A)
- **2.1.2** Sin trampas para el foco del teclado (Nivel A)
- **2.4.3** Orden del foco (Nivel A)
- **2.4.7** Foco visible (Nivel AA)

La accesibilidad por teclado es fundamental para garantizar que los usuarios con discapacidades motoras, personas que utilizan lectores de pantalla, o aquellos que prefieren navegar sin ratón puedan interactuar efectivamente con todos los componentes interactivos de una página web.

# Formularios

El componente **Forms** analiza los elementos de formulario de una página web para evaluar su accesibilidad según las directrices **WCAG**. Identifica problemas comunes que podrían dificultar la interacción para usuarios de tecnologías asistivas, como la falta de etiquetas, la ausencia de autocompletado o la agrupación incorrecta de elementos.

## Elementos analizados

- Campos de entrada (`<input>`) de todos los tipos
- Botones (`<button>`)
- Áreas de texto (`<textarea>`)
- Agrupaciones de radio buttons

## Criterios de evaluación

### Presencia y calidad de etiquetas

- **Etiquetas visibles**: Verifica la presencia de elementos `<label>` asociados
- **Alternativas ARIA**: Analiza atributos como `aria-label`, `aria-labelledby` o `aria-describedby`
- **Descriptividad**: Evalúa si las etiquetas o descripciones son suficientemente informativas

### Estructura y atributos

- **Inclusión en formulario**: Verifica si los elementos están correctamente dentro de un elemento `<form>`
- **Atributo autocomplete**: Comprueba la presencia de este atributo en campos apropiados (teléfono, email, etc.)
- **Agrupación de radio buttons**: Verifica que los radio buttons relacionados compartan el mismo atributo `name`

## Indicadores visuales

- **Código de colores**: Verde para elementos sin problemas, amarillo para elementos con advertencias
- **Filtrado selectivo**: Permite filtrar por estado (`ALL/OK/WARNING`)
- **Interactividad**: Los elementos se pueden destacar en la página al hacer clic

## Mensajes de error y advertencia

| Mensaje                                                        | Caso de aparición                                                          | Severidad          |
| -------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------ |
| ⚠️ Elemento no tiene label                                     | Campo de entrada sin etiqueta asociada                                     | Advertencia        |
| ⚠️ Elemento no está dentro de un formulario                    | Elementos fuera de un contenedor `<form>`                                  | Advertencia        |
| ⚠️ Ausencia de autocomplete                                    | Campos de tipo tel, email, name, etc. sin atributo autocomplete            | Advertencia        |
| ⚠️ Revisar que el elemento sea descriptivo                     | Textos de referencia (aria-describedby/labelledby) con menos de 3 palabras | Advertencia        |
| ⚠️ No se encontraron 2 inputs radio con el mismo atributo name | Radio buttons sin agrupar correctamente                                    | Advertencia global |

## Funciones principales

- **Análisis automatizado**: Detecta problemas comunes en elementos de formulario
- **Filtrado por estado**: Permite mostrar solo elementos con problemas o solo elementos correctos
- **Highlighting**: Permite localizar visualmente los elementos en la página
- **Evaluación de grupos**: Analiza la correcta agrupación de elementos relacionados

## Uso técnico

El componente recibe:

- `tabId`: ID de la pestaña activa
- `body`: Elemento DOM del cuerpo del documento
- `updateAnalysis`: Función para actualizar el análisis general

## Soporte de accesibilidad

Este componente ayuda a cumplir los siguientes criterios WCAG:

- **1.3.1** Información y relaciones (Nivel A)
- **2.4.6** Encabezados y etiquetas (Nivel AA)
- **3.3.2** Etiquetas o instrucciones (Nivel A)
- **1.3.5** Identificar el propósito de entrada (Nivel AA)
- **4.1.2** Nombre, función, valor (Nivel A)

Los formularios accesibles son cruciales para garantizar que todos los usuarios, incluidos aquellos con discapacidad, puedan completar tareas interactivas como registros, búsquedas o contacto en un sitio web.

# Headings

El componente **Headings** analiza la estructura jerárquica de los encabezados de una página web para evaluar su correcta organización según las directrices de accesibilidad **WCAG**. Un esquema de encabezados adecuadamente estructurado es fundamental para los usuarios de lectores de pantalla.

## Elementos analizados

- Encabezados HTML (`<h1>` a `<h6>`)
- Elementos con atributo `role="heading"` y `aria-level`

## Criterios de evaluación

### Estructura jerárquica

- **Secuencia lógica**: Verifica que los niveles de encabezado sigan un orden jerárquico adecuado
- **Saltos de nivel**: Detecta saltos incorrectos en la jerarquía (ej: un `<h1>` seguido de un `<h3>`)
- **Consistencia**: Evalúa la organización general de la estructura de contenido

## Indicadores visuales

- **Indentación progresiva**: Muestra visualmente la jerarquía mediante sangría
- **Animación**: Los encabezados con jerarquía incorrecta tienen una animación de fondo
- **Etiqueta explícita**: Se marca "JERARQUÍA ROTA" en los encabezados problemáticos

## Mensajes de error y advertencia

| Mensaje                           | Caso de aparición                                                                     | Visualización                        |
| --------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------ |
| **JERARQUÍA ROTA**                | Cuando un encabezado salta más de un nivel respecto al anterior (ej: `<h1>` → `<h3>`) | Texto en rojo con animación de fondo |
| **No se encontraron encabezados** | Cuando la página no contiene elementos de encabezado                                  | Mensaje en texto normal              |

## Funciones principales

- **Análisis automático**: Identifica problemas en la estructura de encabezados
- **Visualización jerárquica**: Representa visualmente la estructura con diferentes niveles de indentación
- **Alerta visual**: Destaca problemas de jerarquía mediante animaciones y texto de advertencia
- **Nivel numérico**: Muestra el nivel numérico de cada encabezado junto a su contenido

## Uso técnico

El componente recibe:

- `body`: Elemento DOM del cuerpo del documento
- `updateAnalysis`: Función para actualizar el análisis general con información sobre los encabezados

## Soporte de accesibilidad

Este componente ayuda a cumplir los siguientes criterios WCAG:

- **1.3.1** Información y relaciones (Nivel A)
- **2.4.1** Evitar bloques (Nivel A)
- **2.4.6** Encabezados y etiquetas (Nivel AA)
- **2.4.10** Encabezados de sección (Nivel AAA)

La estructura correcta de encabezados es esencial para que los usuarios de tecnologías asistivas puedan navegar eficientemente por el contenido, comprender la organización de la página y acceder rápidamente a secciones específicas.

# Internal Linking

El componente **InternalLinking** analiza y evalúa todos los enlaces internos de una página web, tanto aquellos que apuntan a otras páginas dentro del mismo dominio como los enlaces de anclaje dentro de la misma página. Esta evaluación es fundamental para garantizar una navegación accesible y coherente.

## Elementos analizados

- Enlaces (`<a>`) que apuntan a URLs de Vodafone.es
- Enlaces de anclaje (`<a href="#...">`) dentro de la misma página

## Criterios de evaluación

### Contenido y atributos de los enlaces

- **Texto del enlace**: Evalúa si los enlaces tienen texto descriptivo o alternativas para imágenes
- **Atributos de accesibilidad**: Verifica la presencia y contenido de atributos como `rel`, `title` y `aria-label`
- **Agrupación**: Organiza y agrupa enlaces que apuntan al mismo destino

## Indicadores visuales

- **Agrupación por URL**: Presenta los enlaces agrupados por destino para facilitar la revisión
- **Mensaje de advertencia**: Muestra un indicador cuando no hay enlaces internos en la página

## Mensajes informativos

| Mensaje                            | Caso de aparición                             | Visualización                           |
| ---------------------------------- | --------------------------------------------- | --------------------------------------- |
| **NO INTERNAL LINKS ON THIS PAGE** | Cuando la página no contiene enlaces internos | Texto con punto amarillo de advertencia |

## Funciones principales

- **Detección automática**: Identifica todos los enlaces internos y de anclaje
- **Agrupación eficiente**: Organiza enlaces por URL de destino para facilitar la evaluación
- **Extracción de texto**: Obtiene el texto descriptivo del enlace o el texto alternativo de imágenes
- **Análisis de atributos**: Muestra atributos relevantes para la accesibilidad

## Uso técnico

El componente recibe:

- `url`: La URL actual de la página
- `body`: Elemento DOM del cuerpo del documento
- `updateAnalysis`: Función para actualizar el análisis general con información sobre los enlaces

## Soporte de accesibilidad

Este componente ayuda a cumplir los siguientes criterios WCAG:

- **2.4.4** Propósito de los enlaces (en contexto) (Nivel A)
- **2.4.9** Propósito de los enlaces (solo enlace) (Nivel AAA)
- **1.3.1** Información y relaciones (Nivel A)
- **2.4.1** Evitar bloques (Nivel A)

La correcta implementación de enlaces internos mejora la navegabilidad de la página, facilitando tanto a usuarios de tecnologías asistivas como a todos los visitantes la comprensión de la estructura del sitio y la ubicación de información relacionada.

# Imágenes

## Elementos analizados

- Imágenes estándar (`<img>`)
- SVGs (decorativos e informativos)
- Botones de imagen (`<input type="image">`)
- Áreas en mapas de imagen (`<area>`)
- Elementos Canvas (`<canvas>`)
- Imágenes de fondo CSS

## Criterios de evaluación

### Evaluación de texto alternativo

- **Presencia**: Verifica si existe un atributo `alt`
- **Calidad**: Analiza si el texto es descriptivo (más de 2 palabras)
- **Redundancia**: Detecta si el texto alternativo es redundante con el texto circundante
- **Contexto**: Diferencia entre elementos decorativos e informativos

## Indicadores visuales

| Indicador            | Significado                                            |
| -------------------- | ------------------------------------------------------ |
| ✅                   | Elemento accesible sin problemas                       |
| ✅ Decorativo        | Elemento decorativo correctamente marcado              |
| ⚠️                   | Advertencias que requieren revisión manual             |
| ⚠️ alt No encontrado | Elementos sin texto alternativo ni haria-hidden="true" |

## Mensajes de error y advertencia

| Mensaje                                              | Caso de aparición                                               | Severidad   |
| ---------------------------------------------------- | --------------------------------------------------------------- | ----------- |
| ⚠️ alt No encontrado                                 | Elemento no decorativo sin atributo `alt` o con `alt` vacío     | Peligro     |
| ⚠️ Comprobar redundancia                             | Texto alternativo similar al texto circundante (similitud >40%) | Advertencia |
| ⚠️ Revisar que el texto sea descriptivo              | Texto alternativo con solo 1 o 2 palabras                       | Advertencia |
| ⚠️ SVG necesita role='img'                           | SVG no decorativo sin atributo `role="img"`                     | Advertencia |
| ⚠️ SVG requiere aria-label o elemento title          | SVG con `role="img"` sin alternativas de texto                  | Advertencia |
| ⚠️ input[type=image] requiere alt                    | Elemento `input[type="image"]` sin atributo `alt`               | Peligro     |
| ⚠️ Canvas requiere contenido alternativo             | Elemento canvas sin contenido alternativo ni atributos ARIA     | Peligro     |
| ⚠️ area clickable requiere alt                       | Área clickable en mapa de imagen sin texto alternativo          | Peligro     |
| ⚠️ Imagen de fondo puede necesitar texto alternativo | Imagen de fondo CSS no decorativa sin texto alternativo         | Advertencia |

## Funciones principales

- **Análisis automático**: Identifica problemas comunes de accesibilidad
- **Filtrado**: Permite filtrar elementos por estado (`OK`, `WARNING`, `DANGER`)
- **OCR**: Reconocimiento de texto en imágenes sin texto alternativo
- **Optimización**: Evaluación del tamaño de archivos de imágenes

## Uso técnico

El componente recibe:

- `tabId`: ID de la pestaña activa
- `body`: Elemento DOM del cuerpo del documento
- `updateAnalysis`: Función para actualizar el análisis general

## Soporte de accesibilidad

Este componente ayuda a cumplir los siguientes criterios WCAG:

- **1.1.1** Contenido no textual (Nivel A)
- **1.4.5** Imágenes de texto (Nivel AA)
- **1.4.9** Imágenes de texto (sin excepciones) (Nivel AAA)
