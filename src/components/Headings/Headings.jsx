import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "tailwindcss-classnames";

import Dot from "../Dot/Dot";

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
};

const Headings = ({ body, updateAnalysis }) => {
  const [headings, setHeadings] = useState(undefined);

  useEffect(() => {
    if (body) {
      const data = [
        ...body.querySelectorAll('h1, h2, h3, h4, h5, h6, *[role="heading"]'),
      ];
      setHeadings(data);
      updateAnalysis({ update: { headings: data } });
    }
  }, [body]);

  return headings ? (
    headings.length > 0 ? (
      <ul className={styles.base}>
        {headings.map((heading) => {
          const headingLevel =
            heading.getAttribute("aria-level") ||
            Number(heading.nodeName.at(-1));
          const listElement = classnames(`pl-heading${headingLevel}`);

          return (
            <li
              key={heading.textContent + crypto.randomUUID()}
              className={listElement}
            >
              <span className={styles.titles}>{headingLevel} -</span>{" "}
              {heading.textContent}
            </li>
          );
        })}
      </ul>
    ) : (
      <p className={styles.empty}>
        <Dot type="warning" />
        NO HEADINGS ON THIS PAGE
      </p>
    )
  ) : (
    <p>...</p>
  );
};

Headings.propTypes = {
  body: PropTypes.object.isRequired,
  updateAnalysis: PropTypes.func.isRequired,
};

export default Headings;
