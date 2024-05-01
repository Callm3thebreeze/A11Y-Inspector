export function getClassSelector(classList) {
  const classArray = classList
    .split(" ")
    .filter((className) => className.length > 0);
  const classSelector = classArray.length > 0 ? "." + classArray.join(".") : "";
  return classSelector;
}

export const highlightElement = (tabId, classSelector, item) => {
  chrome.scripting.executeScript({
    target: { tabId },
    function: function (classSelector, item) {
      const highlightFunction = (classSelector, item) => {
        if (!document.getElementById("highlightStyle")) {
          const style = document.createElement("style");
          style.id = "highlightStyle";
          style.textContent = `
                        @keyframes highlight-a11y {
                            0% { background-color: #fecb00; }
                            50% { background-color: transparent; }
                            100% { background-color: #fecb00; }
                        }
                        
                        .highlight-a11y {
                            animation-name: highlight-a11y;
                            animation-duration: 2s;
                            animation-iteration-count: infinite;
                            border: 3px dashed #00ff1c;
                            border-radius: 5px;
                            padding: 5px;
                        }
                        `;
          document.head.append(style);
        }
        const elements = Array.from(document.querySelectorAll(classSelector));
        const element = elements.find(
          (el) =>
            el.innerText.trim() === item.text.trim() &&
            el.title.trim() === item.title.trim() &&
            el.id === item.id
        );
        if (!element) return;
        if (item.html !== "input") {
          element.classList.toggle("highlight-a11y");
          element.scrollIntoView({ behavior: "smooth" });
          return;
        }

        const inputLabel = document.querySelector(`[for="${item.id}"]`);
        if (!inputLabel) return;

        inputLabel.classList.toggle("highlight-a11y");
        inputLabel.scrollIntoView({ behavior: "smooth" });
      };
      highlightFunction(classSelector, item);
    },
    args: [classSelector, item],
  });
};
