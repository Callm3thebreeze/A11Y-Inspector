export const checkSection = ({ section, analysis }) => {
  console.log(analysis);
  switch (section) {
    case "summary":
      return {
        title: "Resumen",
        condition: {
          danger:
            !analysis.summary?.title ||
            !analysis.summary?.main ||
            !analysis.summary?.lang,
          warning: !analysis.summary?.langMatch,
        },
      };
    case "anchors":
      return {
        title: "Enlaces",
        condition: {
          danger: !analysis.anchors?.every(
            ({ isCorrectHref, invalidHtmlInside }) =>
              isCorrectHref || invalidHtmlInside
          ),
        },
      };
    case "buttons":
      return {
        title: "Botones",
        condition: {
          danger: !analysis.buttons?.every(
            ({ isHtmlInsideValid }) => isHtmlInsideValid
          ),
        },
      };
    case "keyboard":
      return {
        title: "Navegación con teclado",
        condition: {
          warning: !analysis.keyboard?.isTabbable,
          danger: !analysis.keyboard?.isVisible,
        },
      };
    case "forms":
      return {
        title: "Formularios",
        condition: {
          warning: !analysis.allOk,
        },
      };
    case "headings":
      return {
        title: "Headings",
        condition: {
          danger: !analysis.headings?.find(
            (heading) => Number(heading.nodeName.at(-1)) === 1
          ),
        },
      };
    case "internalLinking":
      return {
        title: "Internal Linking",
        condition: {
          warning: !analysis.internalLinking?.length > 0,
        },
      };
    case "images":
      return {
        title: "Imágenes",
        condition: {
          danger:
            analysis.images?.find((image) => image.size >= 200000) ||
            !analysis.images?.alt,
          warning:
            analysis.images?.find((image) => !image.alt || image.alt === "") ||
            analysis.images?.find(
              (image) => image.size > 100000 && image.size < 200000
            ),
        },
      };
    default:
      break;
  }
};
