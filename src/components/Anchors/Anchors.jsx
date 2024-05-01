import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "tailwindcss-classnames";
import { getClassSelector, highlightElement } from "../../utils/commonMethods";

import "./Anchors.css";

const styles = {
  table: classnames(
    "anchors",
    "border-t",
    "border-b",
    "border-gray-400",
    "w-full",
    "text-ms"
  ),
  th: classnames("bg-gray-300", "text-ms", "p-3"),
  thFilter: classnames(
    "bg-gray-300",
    "text-ms",
    "p-3",
    "flex",
    "gap-x-0.5",
    "flex justify-between",
    "items-center"
  ),
  tr: classnames("border-b", "border-gray-400", "bg-gray-100"),
  tdTitle: classnames(
    "max-w-imagesUrl",
    "border-b-0",
    "border-gray-400",
    "w-40"
  ),
  tdHref: classnames("border-l", "border-gray-400", "break-all"),
  tdHrefError: classnames("border-l", "border-gray-400", "break-all", "danger"),
  tdResult: classnames("border-l", "border-gray-400", "w-40"),
};

const getHrefClass = ({ condition }) =>
  condition ? styles.tdHref : styles.tdHrefError;

const checkInnerHtml = (button) => {
  const incorrectHtml = [
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
    "video",
  ];
  const innerButtonOrLink = button.querySelector(incorrectHtml);

  if (innerButtonOrLink) return true;

  return false;
};

const Anchors = ({ tabId, body, updateAnalysis }) => {
  const [anchors, setAnchors] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (body) {
      const data = [...body.querySelectorAll("a")].map((el) => ({
        type: el.type,
        html: el.localName,
        name: el.name,
        id: el.id,
        text: el.innerText,
        title: el.title,
        classList: el.classList.toString(),
        invalidHtmlInside: checkInnerHtml(el),
        href: el.getAttribute("href"),
        isCorrectHref:
          el.getAttribute("href") === null || el.getAttribute("href") === ""
            ? false
            : true,
      }));
      setAnchors(data);
    }
  }, [body]);

  useEffect(() => {
    if (anchors) updateAnalysis({ update: { anchors } });
  }, [anchors]);

  let filteredAnchors;

  switch (filter) {
    case "OK":
      filteredAnchors = anchors.filter(
        (anchor) => anchor.invalidHtmlInside === false
      );
      break;
    case "WARNING":
      filteredAnchors = anchors.filter(
        (anchor) =>
          anchor.href === null || anchor.href === "" || anchor.invalidHtmlInside
      );
      break;
    default:
      filteredAnchors = anchors;
  }

  return (
    <>
      {anchors && filteredAnchors ? (
        <table className={styles.table}>
          <tbody>
            <tr className={styles.tr}>
              <th className={styles.th}>Anchor</th>
              <th className={styles.th}>Href</th>
              <th className={styles.thFilter}>
                Result
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="ALL">ALL</option>
                  <option value="OK">OK</option>
                  <option value="WARNING">WARNING</option>
                </select>
              </th>
            </tr>

            {filteredAnchors.map((anchor) => {
              const classSelector = getClassSelector(anchor.classList);
              const tdHrefStatus = classnames(styles.tdResult, {
                danger:
                  anchor.href === null ||
                  anchor.href === "" ||
                  anchor.invalidHtmlInside,
                success: anchor.href && !anchor.invalidHtmlInside,
              });

              return (
                <tr
                  className={styles.tr}
                  key={anchor.href + crypto.randomUUID()}
                  onClick={() => highlightElement(tabId, classSelector, anchor)}
                >
                  <td className={styles.tdTitle}>
                    {anchor.text ? anchor.text : anchor.title}
                  </td>
                  <td
                    className={getHrefClass({
                      condition:
                        anchor.isCorrectHref && !anchor.invalidHtmlInside,
                    })}
                  >
                    {anchor.invalidHtmlInside
                      ? "REVISAR: Anidamiento dentro del enlace"
                      : anchor.href === null || anchor.href === ""
                      ? "REVISAR: Etiquetar como button si no lanza navegación"
                      : anchor.href}
                  </td>
                  <td className={tdHrefStatus}>
                    {anchor.href === null ||
                    anchor.href === "" ||
                    anchor.invalidHtmlInside
                      ? "⚠️"
                      : "OK"}
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

Anchors.propTypes = {
  tabId: PropTypes.number.isRequired,
  body: PropTypes.object.isRequired,
  updateAnalysis: PropTypes.func.isRequired,
};

export default Anchors;
