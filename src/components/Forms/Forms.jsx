import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "tailwindcss-classnames";
import { getClassSelector, highlightElement } from "../../utils/commonMethods";
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
  const isButton = formItem.type === "button" && formItem.html === "button";
  const isNotFormDescendant = !isButton && !formItem.isAFormDescendant;

  const isOk = !isInputWithoutLabel && (isButton || !isNotFormDescendant);
  let result = "OK";
  if (isInputWithoutLabel) result = "⚠️ REVISAR: elemento no tiene label";
  if (isNotFormDescendant)
    result = "⚠️ REVISAR: elemento no está dentro de un formulario";

  return { isOk, result };
};

const hasLabel = (formItem) => {
  let siblingElement = "";
  formItem.nextElementSibling
    ? (siblingElement = formItem.nextElementSibling.localName)
    : null;
  if (
    formItem.parentElement == "label" ||
    siblingElement == "label" ||
    formItem.getAttribute("aria-label")
  )
    return true;
  return false;
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
  }, [formItems, allOk]);

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

  return (
    <>
      {formItems && filteredformItems ? (
        <table className={styles.table}>
          <tbody>
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
