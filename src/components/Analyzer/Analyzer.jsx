import { useEffect, useState } from "react";
import classnames from "tailwindcss-classnames";
import PropTypes from "prop-types";

import { checkSection } from "./analyzer-conditions";

import Accordion from "../Accordion/Accordion";
import Summary from "../Summary/Summary";
import Headings from "../Headings/Headings";
import InternalLinking from "../InternalLinking/InternalLinking";
import Images from "../Images/Images";
import Dot from "../Dot/Dot";
import Buttons from "../Buttons/Buttons";
import Anchors from "../Anchors/Anchors";
import Keyboard from "../Keyboard/Keyboard";
import Forms from "../Forms/Forms";

const cnListElements = classnames("border-b", "border-gray-200");
const accordionClasses = {
  container: "text-base font-bold",
  button: {
    text: "text-base font-bold py-2 px-4",
    icon: "w-4 h-4 text-primary",
  },
  content: "text-sm",
};
const cnAccordionTitle = classnames("flex", "gap-2", "items-center");

const getContents = () => {
  const url = window.location.href.split("?")[0];
  const head = window.document.querySelector("head");
  const body = window.document.querySelector("body");
  const lang = window.document.documentElement.lang;
  return { url, head: head.innerHTML, body: body.innerHTML, lang };
};

const getParsedString = (text) => {
  const parser = new DOMParser();
  const parsedNode = parser.parseFromString(text, "text/html");
  return parsedNode;
};

const cb = ({ res: [contents], update }) => {
  const { url, head: rawHead, body: rawBody, lang } = contents.result;
  const { body } = getParsedString(rawBody);
  const { head } = getParsedString(rawHead);
  update({ url, head, body, lang });
};

const accordionTitle = ({ section, analysis }) => {
  const { title, condition } = checkSection({ section, analysis });

  let status = "success";
  if (condition.danger) status = "danger";
  else if (condition.warning) status = "warning";

  return (
    <p className={cnAccordionTitle}>
      <Dot type={status} size="big" />
      <span>{title}</span>
    </p>
  );
};

const Analyzer = ({ analysis, updateAnalysis }) => {
  const [tabId, setTabId] = useState(null);
  const [contents, setContents] = useState({
    head: null,
    body: null,
  });

  useEffect(() => {
    async function getCurrentTab() {
      const queryOptions = { active: true, lastFocusedWindow: true };
      const [tab] = await chrome.tabs.query(queryOptions);
      setTabId(tab.id);
    }
    getCurrentTab();
  }, []);

  useEffect(() => {
    if (tabId)
      chrome.scripting.executeScript(
        {
          target: { tabId },
          function: getContents,
        },
        (res) => cb({ res, update: setContents })
      );
  }, [tabId]);
  return contents.body && contents.head ? (
    <>
      <ul>
        <li className={cnListElements}>
          <Accordion
            classes={accordionClasses}
            title={accordionTitle({ section: "summary", analysis })}
          >
            <Summary
              url={contents.url}
              head={contents.head}
              body={contents.body}
              lang={contents.lang}
              updateAnalysis={updateAnalysis}
            />
          </Accordion>
        </li>
        <li className={cnListElements}>
          <Accordion
            classes={accordionClasses}
            title={accordionTitle({ section: "anchors", analysis })}
          >
            <Anchors
              tabId={tabId}
              body={contents.body}
              updateAnalysis={updateAnalysis}
            />
          </Accordion>
        </li>
        <li className={cnListElements}>
          <Accordion
            classes={accordionClasses}
            title={accordionTitle({ section: "buttons", analysis })}
          >
            <Buttons
              tabId={tabId}
              body={contents.body}
              updateAnalysis={updateAnalysis}
            />
          </Accordion>
        </li>
        <li className={cnListElements}>
          <Accordion
            classes={accordionClasses}
            title={accordionTitle({ section: "keyboard", analysis })}
          >
            <Keyboard tabId={tabId} updateAnalysis={updateAnalysis} />
          </Accordion>
        </li>
        <li className={cnListElements}>
          <Accordion
            classes={accordionClasses}
            title={accordionTitle({ section: "forms", analysis })}
          >
            <Forms
              tabId={tabId}
              body={contents.body}
              updateAnalysis={updateAnalysis}
            />
          </Accordion>
        </li>
        <li className={cnListElements}>
          <Accordion
            classes={accordionClasses}
            title={accordionTitle({ section: "headings", analysis })}
          >
            <Headings body={contents.body} updateAnalysis={updateAnalysis} />
          </Accordion>
        </li>
        <li className={cnListElements}>
          <Accordion
            classes={accordionClasses}
            title={accordionTitle({ section: "internalLinking", analysis })}
          >
            <InternalLinking
              url={contents.url}
              body={contents.body}
              updateAnalysis={updateAnalysis}
            />
          </Accordion>
        </li>
        <li className={cnListElements}>
          <Accordion
            classes={accordionClasses}
            title={accordionTitle({ section: "images", analysis })}
          >
            <Images
              tabId={tabId}
              body={contents.body}
              updateAnalysis={updateAnalysis}
            />
          </Accordion>
        </li>
      </ul>
    </>
  ) : (
    <p>Cargando información...</p>
  );
};

Analyzer.propTypes = {
  analysis: PropTypes.shape({}).isRequired,
  updateAnalysis: PropTypes.func.isRequired,
};

export default Analyzer;
