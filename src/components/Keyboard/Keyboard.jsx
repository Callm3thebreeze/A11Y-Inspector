import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "tailwindcss-classnames";
import {
  getClassSelector,
  highlightElement,
} from "../../entrypoints/data-panel/utils/commonMethods";
import "./Keyboard.css";

const styles = {
  table: classnames(
    "keyboard",
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
  tdClassNames: classnames("border-l", "border-gray-400", "break-all"),
  tdResult: classnames("border-l", "border-gray-400", "w-40"),
};

function renderItemStatus(isTabbable, isVisible) {
  if (!isVisible) return "⚠️ Elemento interactivo NO VISIBLE";

  if (!isTabbable) return "⚠️ REVISAR: operabilidad por teclado";

  return "✅";
}

function getItemStatus(isTabbable, isVisible) {
  if (!isVisible) return "danger";

  if (!isTabbable) return "warning";

  return "success";
}

const getInteractiveContent = () => {
  const interactiveElements = [
    "a",
    "button",
    "input",
    "textarea",
    "select",
    "details",
    "label",
  ];
  const interactiveRoles = [
    "link",
    "button",
    "checkbox",
    "radio",
    "textbox",
    "combobox",
    "menuitem",
  ];

  const body = window.document.querySelector("body");

  const mouseOperableElements = [...body.querySelectorAll("*")].filter(
    (element) => {
      const role = element.getAttribute("role");
      return (
        interactiveElements.includes(element.tagName.toLowerCase()) ||
        (role && interactiveRoles.includes(role.toLowerCase()))
      );
    }
  );

  const data = mouseOperableElements.map((el) => ({
    type: el.type,
    html: el.localName,
    name: el.name,
    id: el.id,
    text: el.innerText,
    title: el.title,
    classList: el.classList.toString(),
    isTabbable: el.tabIndex >= 0,
    isVisible: el.offsetParent !== null,
  }));

  return data;
};

const Keyboard = ({ tabId, updateAnalysis }) => {
  const [clickItems, setClickItems] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (tabId)
      chrome.scripting.executeScript(
        {
          target: { tabId },
          function: getInteractiveContent,
        },
        (res) => setClickItems(res[0].result)
      );
  }, [tabId]);

  useEffect(() => {
    if (clickItems) updateAnalysis({ update: { clickItems } });
  }, [clickItems]);

  let filteredClickItems;

  switch (filter) {
    case "OK":
      filteredClickItems = clickItems.filter(
        (clickItem) => clickItem.isTabbable && clickItem.isVisible
      );
      break;
    case "WARNING":
      filteredClickItems = clickItems.filter(
        (clickItem) => clickItem.isVisible && !clickItem.isTabbable
      );
      break;
    case "DANGER":
      filteredClickItems = clickItems.filter(
        (clickItem) => !clickItem.isVisible
      );
      break;
    default:
      filteredClickItems = clickItems;
  }

  return (
    <>
      {clickItems && filteredClickItems ? (
        <table className={styles.table}>
          <tbody>
            <tr className={styles.tr}>
              <th className={styles.th}>Item Text</th>
              <th className={styles.th}>Class</th>
              <th className={styles.thFilter}>
                Result
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

            {filteredClickItems.map((clickItem) => {
              const classSelector = getClassSelector(clickItem.classList);
              const itemStatus = getItemStatus(
                clickItem.isTabbable,
                clickItem.isVisible
              );
              const tdItemStatus = classnames(styles.tdResult, "break-normal", {
                [itemStatus]: itemStatus,
              });

              return (
                <tr
                  className={styles.tr}
                  key={crypto.randomUUID()}
                  onClick={() =>
                    highlightElement(tabId, classSelector, clickItem)
                  }
                >
                  <td className={styles.tdTitle}>
                    {clickItem.text ? clickItem.text : clickItem.title}
                  </td>
                  <td className={styles.tdClassNames}>{clickItem.classList}</td>
                  <td className={tdItemStatus}>
                    {renderItemStatus(
                      clickItem.isTabbable,
                      clickItem.isVisible
                    )}
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

Keyboard.propTypes = {
  tabId: PropTypes.number.isRequired,
  updateAnalysis: PropTypes.func.isRequired,
};

export default Keyboard;
