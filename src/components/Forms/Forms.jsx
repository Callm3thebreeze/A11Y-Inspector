import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "tailwindcss-classnames";
import {
  getClassSelector,
  highlightElement,
} from "../../entrypoints/data-panel/utils/commonMethods";
import "./Forms.css";

const styles = {
  table: classnames(
    "forms",
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
  tdBtnData: classnames("border-l", "border-r", "border-gray-400", "break-all"),
  tdResult: classnames("border-l", "border-gray-400", "w-40"),
};

const analyzeItem = (formItem) => {
  const isInputWithoutLabel = formItem.html === "input" && !formItem.hasLabel;
  const isButton = formItem.html === "button" && formItem.type === "button";
  const isNotFormDescendant = !isButton && !formItem.isAFormDescendant;

  let isOk = !isInputWithoutLabel && (isButton || !isNotFormDescendant);
  let result = "✅";
  if (isInputWithoutLabel) result = "⚠️ Elemento no tiene label";
  if (isNotFormDescendant)
    result = "⚠️ Elemento no está dentro de un formulario";

  //atributo autocomplete
  if (
    formItem.html === "input" &&
    ["tel", "email", "name", "address", "username"].includes(formItem.type) &&
    (!formItem.autocomplete || formItem.autocomplete.trim() === "")
  ) {
    result = "⚠️ Ausencia de autocomplete";
    isOk = false;
  }
  // Si NO tiene aria-label, se comprueba si tiene aria-describedby o aria-labelledby.
  if (!formItem.ariaLabel) {
    const refIds = formItem.ariaDescribedBy || formItem.ariaLabelledBy;
    if (refIds) {
      const firstId = refIds.split(/\s+/)[0];
      const refElem = document.getElementById(firstId);
      if (refElem) {
        const wordCount = refElem.innerText.trim().split(/\s+/).length;
        if (wordCount < 3) {
          result = "⚠️ Revisar que el elemento sea descriptivo";
          isOk = false;
        }
      }
    }
  }

  return { isOk, result };
};

const hasLabel = (formItem) => {
  if (formItem.getAttribute("aria-label")) return true;
  if (formItem.parentElement && formItem.parentElement.localName === "label")
    return true;
  if (formItem.parentElement) {
    return Array.from(formItem.parentElement.children).some(
      (sibling) => sibling !== formItem && sibling.localName === "label"
    );
  }

  return false;
};

const getRadioGroupError = (items) => {
  const radioItems = items.filter(
    (item) => item.html === "input" && item.type === "radio"
  );
  const nameCounts = radioItems.reduce((acc, item) => {
    if (item.name) {
      acc[item.name] = (acc[item.name] || 0) + 1;
    }
    return acc;
  }, {});
  const validGroupExists = Object.values(nameCounts).some(
    (count) => count >= 2
  );
  return validGroupExists || radioItems.length === 0
    ? null
    : "⚠️ No se encontraron 2 inputs radio con el mismo atributo name";
};

const Forms = ({ tabId, body, updateAnalysis }) => {
  const [formItems, setFormItems] = useState([]);
  const [allOk, setAllOk] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const itemsToAnalyze = ["button", "input", "textarea"];

  useEffect(() => {
    if (body) {
      const data = [...body.querySelectorAll(itemsToAnalyze)].map((el) => {
        const item = {
          type: el.type,
          html: el.localName,
          name: el.name,
          id: el.id,
          text: el.innerText,
          title: el.title,
          classList: el.classList.toString(),
          autocomplete: el.getAttribute("autocomplete") || "",
          ariaLabel: el.getAttribute("aria-label") || "",
          ariaDescribedBy: el.getAttribute("aria-describedby") || "",
          ariaLabelledBy: el.getAttribute("aria-labelledby") || "",
          sibling: el.nextElementSibling
            ? el.nextElementSibling.localName
            : null,
          hasLabel: hasLabel(el),
          isAFormButton:
            el.localName == "button" && el.type == "button" ? false : true,
          isAFormDescendant: el.closest("form") ? true : false,
        };
        const analysis = analyzeItem(item);
        return { ...item, ...analysis };
      });
      setFormItems(data);
      setAllOk(data.every((item) => item.isOk));
    }
  }, [body]);

  useEffect(() => {
    if (formItems.length > 0) updateAnalysis({ update: { formItems, allOk } });
  }, [formItems, allOk, updateAnalysis]);

  let filteredformItems;

  switch (filter) {
    case "OK":
      filteredformItems = formItems.filter((formItem) => formItem.isOk);
      break;
    case "WARNING":
      filteredformItems = formItems.filter((formItem) => !formItem.isOk);
      break;
    default:
      filteredformItems = formItems;
  }

  const radioErrorMessage = getRadioGroupError(formItems);

  return (
    <>
      {formItems && filteredformItems ? (
        <table className={styles.table}>
          <tbody>
            {radioErrorMessage && (
              <tr>
                <td colSpan="6" className="warning">
                  {radioErrorMessage}
                </td>
              </tr>
            )}
            <tr className={styles.tr}>
              <th className={styles.th}>Item</th>
              <th className={styles.th}>Type</th>
              <th className={styles.th}>Id/Name</th>
              <th className={styles.th}>Text</th>
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
                </select>
              </th>
            </tr>

            {filteredformItems.map((formItem) => {
              const classSelector = getClassSelector(formItem.classList);
              const { isOk, result } = analyzeItem(formItem);
              const tdButtonStatus = classnames(
                styles.tdResult,
                "break-normal",
                {
                  warning: !isOk,
                  success: isOk,
                }
              );

              return (
                <tr
                  className={styles.tr}
                  key={crypto.randomUUID()}
                  onClick={() =>
                    highlightElement(tabId, classSelector, formItem)
                  }
                >
                  <td className={styles.tdBtnData}>{formItem.html}</td>
                  <td className={styles.tdBtnData}>{formItem.type}</td>
                  <td className={styles.tdBtnData}>
                    {formItem.id ? formItem.id : formItem.name}
                  </td>
                  <td className={styles.tdTitle}>
                    {formItem.text ? formItem.text : formItem.title}
                  </td>
                  <td className={styles.tdBtnData}>{formItem.classList}</td>
                  <td className={tdButtonStatus}>{result}</td>
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

Forms.propTypes = {
  tabId: PropTypes.number.isRequired,
  body: PropTypes.object.isRequired,
  updateAnalysis: PropTypes.func.isRequired,
};

export default Forms;
