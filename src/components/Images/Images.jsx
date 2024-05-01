import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "tailwindcss-classnames";

import "./Images.css";

const cnTable = classnames(
  "images",
  "border-t",
  "border-b",
  "border-gray-400",
  "w-full",
  "text-ms"
);
const cnTH = classnames("bg-gray-300", "font-bold", "text-ms", "p-3");
const thFilter = classnames(
  "bg-gray-300",
  "text-ms",
  "p-3",
  "flex",
  "gap-x-0.5",
  "flex justify-between",
  "items-center"
);
const cnTR = classnames("border-b", "border-gray-400");
const cnTDUrl = classnames(
  "max-w-imagesUrl",
  "border-b-0",
  "border-gray-400",
  "w-70"
);
const cnLink = classnames("text-gray-700", "break-all", "hover:underline");
const cnTDLength = classnames("border-l", "border-gray-400", "w-40");

function renderAltStatus(image) {
  if (!image.alt || image.alt === "") {
    return "alt No encontrado";
  }

  const wordCount = image.alt ? image.alt.split(" ").length : 0;

  if (wordCount === 1 || wordCount === 2) {
    return "Revisar que el texto sea descriptivo";
  }

  return "Ok";
}

function getImageAltStatus(image) {
  if (!image.alt || image.alt === "") {
    return "danger";
  }

  const wordCount = image.alt ? image.alt.split(" ").length : 0;
  if (wordCount === 1 || wordCount === 2) {
    return "warning";
  }

  return null;
}

const addPrefix = ({ src }) => {
  let img = src;
  console.log(src);
  //Para probar en una pagina en dev mode podemos incluir antes de src la url del sitio en el que estemos probando
  //Ejemplo: `${https://misitio.es}${src}`
  if (src.startsWith("/c/") || src.startsWith("/ss/")) img = `${src}`;
  return img;
};

const getImagesData = (images = undefined) => {
  const result = [];

  Promise.all(
    images.map((image) => {
      fetch(image.src, { method: "HEAD" }).then((res) => {
        const img = images.find((el) => el.src === res.url);
        result.push({
          src: res.url,
          alt: img?.alt,
          size: Number(res.headers.get("content-length")),
        });
        if (result.length === images.length) chrome.runtime.sendMessage(result);
      });
    })
  );
};

const Images = ({ tabId, body, updateAnalysis }) => {
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState("ALL");

  chrome.runtime.onMessage.addListener(function listener(result) {
    chrome.runtime.onMessage.removeListener(listener);
    setImages(result);
  });

  useEffect(() => {
    if (body) {
      const data = [...body.querySelectorAll("img, source")]
        .map((el) => ({
          src: el.getAttribute("src")
            ? addPrefix({ src: el.getAttribute("src") })
            : addPrefix({ src: el.getAttribute("srcset") }),
          alt: el.getAttribute("src")
            ? el.getAttribute("alt")
            : "--- NO ALT EXPECTED ---",
        }))
        .filter((el) => {
          return (
            !el.src.includes("t.co") &&
            !el.src.includes("analytics") &&
            !el.src.includes("t.womtp") &&
            !el.src.includes("walmeric") &&
            !el.src.includes("bat.bing")
          );
        });
      chrome.scripting.executeScript({
        target: { tabId },
        function: getImagesData,
        args: [data],
      });
    }
  }, [body]);

  useEffect(() => {
    if (images) updateAnalysis({ update: { images } });
  }, [images]);

  return (
    <>
      {images.length > 0 ? (
        <table className={cnTable}>
          <tbody>
            <tr className={cnTR}>
              <th className={cnTH}>URL</th>
              <th className={cnTH}>Texto alternativo (alt)</th>
              <th className={cnTH}>alt status</th>
              <th className={thFilter}>
                Peso
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="ALL">ALL</option>
                  <option value="OK">OK</option>
                  <option value="WARNING">WARNING</option>
                  <option value="DANGER">DANGER</option>
                </select>
              </th>
            </tr>

            {images
              .filter((image) => {
                switch (filter) {
                  case "OK":
                    return getImageAltStatus(image) === null;
                  case "WARNING":
                    return getImageAltStatus(image) === "warning";
                  case "DANGER":
                    return getImageAltStatus(image) === "danger";
                  default:
                    return true;
                }
              })
              .map((image) => {
                const imageAltStatus = getImageAltStatus(image);
                const cnTdAltStatus = classnames(
                  "border-l",
                  "border-gray-400",
                  {
                    [imageAltStatus]: imageAltStatus,
                  }
                );
                const cnTDLengthStatus = classnames(cnTDLength, {
                  danger: image.size >= 200000,
                  warning: image.size > 100000 && image.size < 200000,
                  success: image.size <= 100000,
                });

                return (
                  <tr className={cnTR} key={image.src + crypto.randomUUID()}>
                    <td className={cnTDUrl}>
                      <a
                        href={image.src}
                        target="_blank"
                        className={cnLink}
                        rel="noreferrer"
                      >
                        {image.src}
                      </a>
                    </td>
                    <td className={cnTdAltStatus}>{image.alt}</td>
                    <td className={cnTdAltStatus}>{renderAltStatus(image)}</td>
                    <td className={cnTDLengthStatus}>{`${Math.round(
                      image.size / 1000
                    )} KB`}</td>
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
