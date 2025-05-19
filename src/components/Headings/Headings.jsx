import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "tailwindcss-classnames";

const styles = {
  base: classnames("w-full", "flex", "flex-col", "gap-2", "bg-gray-100", "p-4"),
  titles: classnames("text-primary"),
  empty: classnames(
    "flex",
    "gap-2",
    "items-center",
    "px-8",
    "pt-2",
    "pb-4",
    "text-warning-dark"
  ),
  broken: classnames("ml-2", "text-danger"),
};

const Headings = ({ body, updateAnalysis }) => {
  const [headings, setHeadings] = useState(undefined);
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes bgTransition {
        from { background-color: #f7fafc; }
        to { background-color:#ffd900; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (body) {
      const data = [
        ...body.querySelectorAll('h1, h2, h3, h4, h5, h6, *[role="heading"]'),
      ];

      const headingsBroken = data.some((heading, index, arr) => {
        if (index > 0) {
          const prevHeading = arr[index - 1];
          const prevLevel =
            Number(prevHeading.nodeName.at(-1)) ||
            Number(prevHeading.getAttribute("aria-level"));
          const currentLevel =
            Number(heading.nodeName.at(-1)) ||
            Number(heading.getAttribute("aria-level"));
          return currentLevel > prevLevel + 1;
        }
        return false;
      });

      setHeadings(data);
      updateAnalysis({ update: { headings: data, headingsBroken } });
    }
  }, [body, updateAnalysis]);

  if (!headings) return <p>Cargando encabezados...</p>;

  return headings.length > 0 ? (
    <ul className={styles.base}>
      {headings.map((heading, index) => {
        const level =
          heading.getAttribute("aria-level") || Number(heading.nodeName.at(-1));
        let broken = false;
        if (index > 0) {
          const prevHeading = headings[index - 1];
          const prevLevel =
            prevHeading.getAttribute("aria-level") ||
            Number(prevHeading.nodeName.at(-1));
          if (level > Number(prevLevel) + 1) broken = true;
        }
        // Si la jerarquía está rota, se aplica la animación de fondo.
        const liStyle = broken
          ? { animation: "bgTransition 1s infinite alternate" }
          : {};

        return (
          <li
            key={index}
            style={liStyle}
            className={classnames(`pl-heading${level}`)}
          >
            <span className={styles.titles}>{level} -</span>{" "}
            {heading.textContent}
            {broken && <span className={styles.broken}>/ JERARQUÍA ROTA</span>}
          </li>
        );
      })}
    </ul>
  ) : (
    <p className={styles.empty}>No se encontraron encabezados</p>
  );
};

Headings.propTypes = {
  body: PropTypes.object.isRequired,
  updateAnalysis: PropTypes.func.isRequired,
};

export default Headings;
