import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'tailwindcss-classnames';

import './Images.css';

const cnTable = classnames(
  'images',
  'border-t',
  'border-b',
  'border-gray-400',
  'w-full',
  'text-ms'
);
const cnTH = classnames('bg-gray-300', 'font-bold', 'text-ms', 'p-3');
const thFilter = classnames(
  'bg-gray-300',
  'text-ms',
  'p-3',
  'justify-between',
  'items-center'
);
const cnTR = classnames('border-b', 'border-gray-400');
const cnTDUrl = classnames(
  'max-w-imagesUrl',
  'border-b-0',
  'border-gray-400',
  'w-70'
);
const cnLink = classnames('text-gray-700', 'break-all', 'hover:underline');
const cnTDLength = classnames('border-l', 'border-gray-400', 'w-40');

// Función para calcular similitud entre textos
function computeSimilarity(str1, str2) {
  const set1 = new Set(
    str1
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word)
  );
  const set2 = new Set(
    str2
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word)
  );
  if (set1.size === 0 && set2.size === 0) return 100;
  const common = [...set1].filter((word) => set2.has(word)).length;
  return (common / ((set1.size + set2.size) / 2)) * 100;
}

// Comprueba redundancia entre alt text y texto cercano
function checkAltRedundancy(image) {
  const altText = image.getAttribute('alt') || '';
  let relatedText = '';

  if (image.parentElement) {
    Array.from(image.parentElement.children).forEach((sibling) => {
      if (sibling !== image && sibling.innerText) {
        relatedText += sibling.innerText + ' ';
      }
    });
  }

  if (image.parentElement && image.parentElement.parentElement) {
    Array.from(image.parentElement.parentElement.children).forEach(
      (parentSibling) => {
        if (parentSibling !== image.parentElement && parentSibling.innerText) {
          relatedText += parentSibling.innerText + ' ';
        }
      }
    );
  }

  const similarity = computeSimilarity(altText, relatedText);
  return similarity > 40 ? '⚠️ Comprobar redundancia' : '';
}

// Renderiza el estado del texto alternativo
function renderAltStatus(image) {
  const hasAriaHidden = image.ariaHidden === 'true';

  // Si es un tipo de elemento que no requiere alt, mostramos un mensaje específico
  if (
    image.elementType === 'svg-decorative' ||
    image.elementType === 'css-background-decorative' ||
    hasAriaHidden
  ) {
    return '✅ Decorativo';
  }

  if (image.alt === undefined || image.alt === 'undefined') {
    return '⚠️ el valor de alt no puede ser undefined ';
  }

  if (!image.alt || image.alt === '') {
    return '⚠️ alt No encontrado';
  }

  if (image.altStatus === '⚠️ Comprobar redundancia') {
    return image.altStatus;
  }
  const wordCount = image.alt.split(' ').length;
  if (wordCount === 1 || wordCount === 2) {
    return '⚠️ Revisar que el texto sea descriptivo';
  }
  return '✅';
}

// Obtiene el estado de accesibilidad de la imagen
function getImageAltStatus(image) {
  const hasAriaHidden = image.ariaHidden === 'true';

  // Si es un elemento decorativo, está bien sin alt
  if (
    image.elementType === 'svg-decorative' ||
    image.elementType === 'css-background-decorative' ||
    hasAriaHidden
  ) {
    return 'success';
  }

  if (image.alt === undefined || image.alt === 'undefined') {
    return 'danger';
  }

  if (!image.alt || image.alt === '') {
    return 'danger';
  }
  if (image.altStatus === '⚠️ Comprobar redundancia') {
    return 'warning';
  }
  const wordCount = image.alt.split(' ').length;
  if (wordCount === 1 || wordCount === 2) {
    return 'warning';
  }
  return 'success';
}

// Añade prefijo a las URLs relativas
const addPrefix = ({ src }) => {
  if (!src) return '';
  let img = src;
  if (src.startsWith('/c/') || src.startsWith('/ss/'))
    img = `${'https://www.vodafone.es'}${src}`;
  return img;
};

// Evalúa elementos SVG
function handleSvgAccessibility(el) {
  const hasImgRole = el.getAttribute('role') === 'img';
  const hasAriaHidden = el.getAttribute('aria-hidden') === 'true';

  // Determinar si el SVG es decorativo
  const isSmall = el.clientWidth < 24 && el.clientHeight < 24;
  const isLikelyIcon =
    el.classList.contains('icon') ||
    el.classList.contains('svg-icon') ||
    el.parentElement?.classList.contains('icon');
  const isLikelyDecorative = hasAriaHidden || isSmall || isLikelyIcon;

  // Información de ubicación para identificación
  const elId = el.getAttribute('id') || '';
  const elClasses = Array.from(el.classList).join(' ');
  let locationInfo = '';

  if (elId) {
    locationInfo = `id="${elId}"`;
  } else if (elClasses) {
    locationInfo = `class="${elClasses}"`;
  }

  // Obtener texto del contenedor padre para contexto
  let parentText = '';
  if (el.parentElement) {
    parentText = el.parentElement.innerText?.trim().substring(0, 50);
    if (parentText)
      parentText = `Cerca de: "${parentText}${
        parentText.length > 50 ? '...' : ''
      }"`;
  }

  // Verificar alternativas de texto
  const hasAriaLabel = el.hasAttribute('aria-label');
  const hasAriaLabelledby = el.hasAttribute('aria-labelledby');
  const hasTitle = el.querySelector('title');

  let alt = '';
  if (hasAriaLabel) {
    alt = el.getAttribute('aria-label');
  } else if (hasTitle) {
    alt = hasTitle.textContent;
  }

  let altStatus = '';

  // Si es decorativo, no necesita texto alternativo
  if (isLikelyDecorative) {
    return {
      src: `SVG decorativo ${locationInfo ? `[${locationInfo}]` : ''} ${
        parentText ? `- ${parentText}` : ''
      }`,
      alt: ' Elemento decorativo ',
      altStatus: '',
      elementType: 'svg-decorative',
    };
  }

  // Si no es decorativo, necesita alternativas de texto
  if (!hasImgRole) {
    altStatus = "⚠️ SVG necesita role='img'";
  } else if (!hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
    altStatus = '⚠️ SVG requiere aria-label o elemento title';
  } else {
    altStatus = checkAltRedundancy(el);
  }

  return {
    src: 'SVG: ' + (el.getAttribute('id') || '(sin id)'),
    alt: alt,
    altStatus: altStatus,
    elementType: 'svg',
  };
}

// Evalúa la accesibilidad de elementos input[type="image"]
function handleInputImageAccessibility(el) {
  const alt = el.getAttribute('alt') || '';
  const hasAlt = el.hasAttribute('alt');
  const src = el.getAttribute('src');

  let altStatus = '';
  if (!hasAlt || alt.trim() === '') {
    altStatus = '⚠️ input[type=image] requiere alt';
  } else {
    altStatus = checkAltRedundancy(el);
  }

  return {
    src: addPrefix({ src }),
    alt: alt,
    altStatus: altStatus,
    elementType: 'input[type=image]',
  };
}

// Evalúa la accesibilidad de elementos canvas
function handleCanvasAccessibility(el) {
  // Canvas debe tener contenido alternativo en su interior
  const hasFallbackContent = el.innerHTML.trim() !== '';

  // Verificar alternativas de texto
  const hasAriaLabel = el.hasAttribute('aria-label');
  const hasAriaLabelledby = el.hasAttribute('aria-labelledby');

  let alt = '';
  if (hasAriaLabel) {
    alt = el.getAttribute('aria-label');
  }

  let altStatus = '';
  if (!hasFallbackContent && !hasAriaLabel && !hasAriaLabelledby) {
    altStatus = '⚠️ Canvas requiere contenido alternativo';
  }

  return {
    src: `Canvas ${el.width}x${el.height}`,
    alt: alt,
    altStatus: altStatus,
    elementType: 'canvas',
  };
}

// Evalúa la accesibilidad de elementos area en mapas de imagen
function handleAreaAccessibility(el) {
  const alt = el.getAttribute('alt') || '';
  const hasAlt = el.hasAttribute('alt');
  const href = el.getAttribute('href');

  let altStatus = '';
  if (href && (!hasAlt || alt.trim() === '')) {
    altStatus = '⚠️ area clickable requiere alt';
  } else {
    altStatus = checkAltRedundancy(el);
  }

  return {
    src: `Area en mapa: ${
      el.parentElement ? el.parentElement.getAttribute('name') : 'desconocido'
    }`,
    alt: alt,
    altStatus: altStatus,
    elementType: 'area',
  };
}

// Detecta imágenes de fondo con CSS
function findBackgroundImages() {
  // Esta función se ejecutaría como script inyectado
  const allElements = Array.from(document.querySelectorAll('*'));
  const results = [];

  allElements.forEach((el) => {
    const computedStyle = window.getComputedStyle(el);
    const backgroundImage = computedStyle.backgroundImage;

    // Omitir si no hay imagen de fondo o es 'none'
    if (!backgroundImage || backgroundImage === 'none') return;

    // Comprobar si es una imagen real (no un gradiente)
    if (backgroundImage.includes('url(')) {
      // Extraer URL
      const url = backgroundImage
        .replace(/^url\(['"]?/, '')
        .replace(/['"]?\)$/, '');

      // Verificar alternativas de texto
      const hasAriaLabel = el.hasAttribute('aria-label');
      const hasAriaLabelledby = el.hasAttribute('aria-labelledby');
      const hasTitle = el.hasAttribute('title');

      let alt = '';
      if (hasAriaLabel) {
        alt = el.getAttribute('aria-label');
      } else if (hasTitle) {
        alt = el.getAttribute('title');
      }

      // Comprobar si es probablemente decorativa o de contenido
      const isLikelyDecorative =
        el.clientWidth < 50 ||
        el.clientHeight < 50 ||
        backgroundImage.includes('pattern') ||
        backgroundImage.includes('icon') ||
        el.classList.contains('bg') ||
        el.classList.contains('background');

      let altStatus = '';
      // Información de ubicación para identificación
      const elId = el.getAttribute('id') || '';
      const elClasses = Array.from(el.classList).join(' ');
      let locationInfo = '';

      if (elId) {
        locationInfo = `id="${elId}"`;
      } else if (elClasses) {
        locationInfo = `class="${elClasses}"`;
      }

      // Obtener texto del contenedor para contexto
      const elementText = el.innerText?.trim().substring(0, 50);
      const contextText = elementText
        ? `Texto: "${elementText}${elementText.length > 50 ? '...' : ''}"`
        : '';

      // Información sobre dimensiones
      const sizeInfo = `${el.clientWidth}x${el.clientHeight}px`;

      let elementType = isLikelyDecorative
        ? 'css-background-decorative'
        : 'css-background';
      let displaySrc = isLikelyDecorative
        ? `Fondo decorativo ${
            locationInfo ? `[${locationInfo}]` : ''
          } - ${sizeInfo} ${contextText ? `- ${contextText}` : ''}`
        : url;

      if (
        !isLikelyDecorative &&
        !hasAriaLabel &&
        !hasAriaLabelledby &&
        !hasTitle
      ) {
        altStatus = '⚠️ Imagen de fondo puede necesitar texto alternativo';
      }

      results.push({
        src: isLikelyDecorative ? displaySrc : url,
        alt: alt || (isLikelyDecorative ? ' Elemento decorativo' : ''),
        altStatus: altStatus,
        elementType: elementType,
        originalSrc: url, // guardamos la URL original para referencia
      });
    }
  });

  return results;
}

// Obtiene datos de imágenes via fetch HEAD
const getImagesData = (images = undefined) => {
  const result = [];
  Promise.all(
    images
      .map((image) => {
        // Solo hacer fetch si es una URL válida
        if (image.src && image.src.startsWith('http')) {
          return fetch(image.src, { method: 'HEAD' })
            .then((res) => {
              const img = images.find((el) => el.src === res.url);
              result.push({
                src: res.url,
                alt: img?.alt,
                size: Number(res.headers.get('content-length')),
                altStatus: img?.altStatus,
                imageText: img?.imageText || '',
                imageClassList: img?.classList || [],
                elementType: img?.elementType,
                ariaHidden: img?.ariaHidden,
              });
              if (result.length === images.length)
                chrome.runtime.sendMessage(result);
            })
            .catch(() => {
              // Si hay error en el fetch, agregamos el elemento sin tamaño
              const img = images.find((el) => el.src === image.src);
              result.push({
                src: image.src,
                alt: img?.alt,
                size: 0,
                altStatus: img?.altStatus,
                imageText: img?.imageText || '',
                imageClassList: img?.classList || [],
                elementType: img?.elementType,
              });
            });
        } else {
          // Elementos que no son URLs estándar (SVG, canvas, etc)
          result.push({
            ...image,
            size: 0,
          });
          return Promise.resolve();
        }
      })
      .filter(Boolean) // Eliminar promesas null
  ).then(() => {
    if (result.length > 0) chrome.runtime.sendMessage(result);
  });
};

const Images = ({ tabId, body, updateAnalysis }) => {
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState('ALL');

  chrome.runtime.onMessage.addListener(function listener(result) {
    chrome.runtime.onMessage.removeListener(listener);
    setImages(result);
  });

  useEffect(() => {
    if (body) {
      // Recolectamos imágenes estándar
      const imgElements = [...body.querySelectorAll('img')].map((el) => {
        const hasSrc = el.getAttribute('src');
        const srcValue = hasSrc
          ? addPrefix({ src: el.getAttribute('src') })
          : addPrefix({ src: el.getAttribute('srcset') });
        const altValue = el.getAttribute('alt') || '';
        const altStatus = checkAltRedundancy(el);
        const ariaHidden = el.getAttribute('aria-hidden') || 'false';
        return {
          src: srcValue,
          alt: altValue,
          altStatus,
          elementType: 'img',
          ariaHidden,
        };
      });

      // Recolectamos elementos input[type="image"]
      const inputImageElements = [
        ...body.querySelectorAll("input[type='image']"),
      ].map(handleInputImageAccessibility);

      // Recolectamos elementos SVG
      const svgElements = [...body.querySelectorAll('svg')].map(
        handleSvgAccessibility
      );

      // Recolectamos elementos canvas
      const canvasElements = [...body.querySelectorAll('canvas')].map(
        handleCanvasAccessibility
      );

      // Recolectamos elementos area en mapas de imagen
      const areaElements = [...body.querySelectorAll('area[href]')].map(
        handleAreaAccessibility
      );

      // Combinamos todos los elementos
      const allElements = [
        ...imgElements,
        ...inputImageElements,
        ...svgElements,
        ...canvasElements,
        ...areaElements,
      ].filter((el) => {
        // Filtrar elementos no deseados o tracking pixels
        if (!el.src) return false;
        return (
          !el.src.includes('t.co') &&
          !el.src.includes('analytics') &&
          !el.src.includes('t.womtp') &&
          !el.src.includes('walmeric') &&
          !el.src.includes('bat.bing')
        );
      });

      // Intentamos detectar imágenes de fondo CSS si es posible
      try {
        chrome.scripting.executeScript(
          {
            target: { tabId },
            function: findBackgroundImages,
            args: [document.body],
          },
          (results) => {
            if (results && results[0] && results[0].result) {
              const cssBackgroundElements = results[0].result;
              const updatedElements = [
                ...allElements,
                ...cssBackgroundElements,
              ];
              chrome.scripting.executeScript({
                target: { tabId },
                function: getImagesData,
                args: [updatedElements],
              });
              setImages(updatedElements);
            }
          }
        );
      } catch (e) {
        console.log('Error detectando imágenes de fondo CSS:', e);
        // Si falla la detección de imágenes CSS, continuamos con el resto
        chrome.scripting.executeScript({
          target: { tabId },
          function: getImagesData,
          args: [allElements],
        });
        setImages(allElements);
      }
    }
  }, [body, tabId]);

  // Función para ejecutar OCR sobre una imagen concreta
  const runImageOCR = async (img) => {
    if (!window.Tesseract) {
      console.warn('Tesseract script not loaded yet');
      return;
    }
    try {
      const worker = await window.Tesseract.createWorker('eng', 1, {
        workerPath: chrome.runtime.getURL('tesseract/worker.min.js'),
        corePath: chrome.runtime.getURL(
          'tesseract/tesseract-core-lstm.wasm.js'
        ),
        langPath: chrome.runtime.getURL('tesseract/languages/'),
        workerBlobURL: false,
      });

      const {
        data: { text },
      } = await worker.recognize(img.src, {}, { lang: 'eng' });

      setImages((prevImages) =>
        prevImages.map((el) =>
          el.src === img.src ? { ...el, imageText: text.trim() } : el
        )
      );
      await worker.terminate();
    } catch (error) {
      console.error('Error en OCR:', error);
      setImages((prevImages) =>
        prevImages.map((el) =>
          el.src === img.src ? { ...el, imageText: 'Error en OCR' } : el
        )
      );
    }
  };

  useEffect(() => {
    if (images) updateAnalysis({ update: { images } });
  }, [images, updateAnalysis]);

  return (
    <>
      {images.length > 0 ? (
        <table className={cnTable}>
          <tbody>
            <tr className={cnTR}>
              <th className={cnTH}>URL</th>
              <th className={cnTH}>Texto alternativo (alt)</th>
              <th className={cnTH}>alt status</th>
              <th className={cnTH}>
                <button
                  className='btn-ocr'
                  title='ejecutar OCR'
                  onClick={() => {
                    images
                      .filter(
                        (img) =>
                          img.src &&
                          img.src.startsWith('http') && // Solo URLs reales
                          (!img.alt || img.alt.trim() === '') &&
                          !img.imageText
                      )
                      .forEach((img) => runImageOCR(img));
                  }}
                >
                  Texto en Imagen
                </button>
              </th>
              <th className={thFilter}>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value='ALL'>ALL</option>
                  <option value='OK'>OK</option>
                  <option value='WARNING'>WARNING</option>
                  <option value='DANGER'>DANGER</option>
                </select>
              </th>
            </tr>

            {images
              .filter((image) => {
                switch (filter) {
                  case 'OK':
                    return getImageAltStatus(image) === 'success';
                  case 'WARNING':
                    return getImageAltStatus(image) === 'warning';
                  case 'DANGER':
                    return getImageAltStatus(image) === 'danger';
                  default:
                    return true;
                }
              })
              .map((image) => {
                const imageAltStatus = getImageAltStatus(image);
                const cnTdAltStatus = classnames(
                  'border-l',
                  'border-gray-400',
                  {
                    [imageAltStatus]: imageAltStatus,
                  }
                );
                const cnTDLengthStatus = classnames(cnTDLength, {
                  danger: image.size >= 200000,
                  warning: image.size > 100000 && image.size < 200000,
                  success: image.size <= 100000 || image.size === 0,
                });

                return (
                  <tr className={cnTR} key={image.src + crypto.randomUUID()}>
                    <td className={cnTDUrl}>
                      {image.src.startsWith('http') ? (
                        <a
                          href={image.src}
                          target='_blank'
                          className={cnLink}
                          rel='noreferrer'
                        >
                          {image.src}
                        </a>
                      ) : (
                        <span className={cnLink}>{image.src}</span>
                      )}
                    </td>
                    <td className={cnTDUrl}>{image.alt}</td>
                    <td className={cnTdAltStatus}>{renderAltStatus(image)}</td>
                    <td className={cnTDUrl}>
                      {image.imageText ? image.imageText : '---'}
                    </td>
                    <td className={cnTDLengthStatus}>
                      {image.size
                        ? `${Math.round(image.size / 1000)} KB`
                        : 'N/A'}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      ) : (
        <p>...</p>
      )}
    </>
  );
};

Images.propTypes = {
  tabId: PropTypes.number,
  body: PropTypes.object.isRequired,
  updateAnalysis: PropTypes.func.isRequired,
};

export default Images;
