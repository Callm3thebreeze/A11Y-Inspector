import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "tailwindcss-classnames";
import { getClassSelector, highlightElement } from "../../utils/commonMethods";
import "./Buttons.css";

const styles = {
  table: classnames(
    "buttons",
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
  tdBtnData: classnames("border-l", "border-gray-400", "break-all"),
  tdResult: classnames("border-l", "border-gray-400", "w-40"),
};

const checkInnerHtml = (button) => {
  if (button.children.length === 0) return true;
  const validElements = [
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
    "wbr",
  ];
  const innerButtonOrLink = button.querySelector(validElements);

  if (innerButtonOrLink) return true;

  return false;
};

const Buttons = ({ tabId, body, updateAnalysis }) => {
  const [buttons, setButtons] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (body) {
      const data = [...body.querySelectorAll("button")].map((el) => ({
        type: el.type,
        html: el.localName,
        name: el.name,
        id: el.id,
        text: el.innerText,
        title: el.title,
        classList: el.classList.toString(),
        isHtmlInsideValid: checkInnerHtml(el),
      }));
      setButtons(data);
    }
  }, [body]);

  useEffect(() => {
    if (buttons) updateAnalysis({ update: { buttons } });
  }, [buttons]);

  let filteredButtons;

  switch (filter) {
    case "OK":
      filteredButtons = buttons.filter((button) => button.isHtmlInsideValid);
      break;
    case "DANGER":
      filteredButtons = buttons.filter((button) => !button.isHtmlInsideValid);
      break;
    default:
      filteredButtons = buttons;
  }

  return (
    <>
      {buttons && filteredButtons ? (
        <table className={styles.table}>
          <tbody>
            <tr className={styles.tr}>
              <th className={styles.th}>Button Text</th>
              <th className={styles.th}>Class</th>
              <th className={styles.thFilter}>
                Result
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="ALL">ALL</option>
                  <option value="OK">OK</option>
                  <option value="DANGER">DANGER</option>
                </select>
              </th>
            </tr>

            {filteredButtons.map((button) => {
              const classSelector = getClassSelector(button.classList);
              const cdTDButtonStatus = classnames(
                styles.tdResult,
                "break-normal",
                {
                  danger: !button.isHtmlInsideValid,
                  success: button.isHtmlInsideValid,
                }
              );

              return (
                <tr
                  className={styles.tr}
                  key={crypto.randomUUID()}
                  onClick={() => highlightElement(tabId, classSelector, button)}
                >
                  <td className={styles.tdTitle}>
                    {button.text ? button.text : button.title}
                  </td>
                  <td className={styles.tdBtnData}>{button.classList}</td>
                  <td className={cdTDButtonStatus}>
                    {!button.isHtmlInsideValid
                      ? "⚠️ REVISAR: anidamiento puede causar comportamiento inesperado"
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

Buttons.propTypes = {
  tabId: PropTypes.number.isRequired,
  body: PropTypes.object.isRequired,
  updateAnalysis: PropTypes.func.isRequired,
};

export default Buttons;
