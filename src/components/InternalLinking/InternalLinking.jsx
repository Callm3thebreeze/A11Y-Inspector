/* eslint no-useless-escape: 'off' */
import { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import classnames from "tailwindcss-classnames";

import Dot from "../Dot/Dot";

import "./InternalLinking.css";

const cnTable = classnames(
  "border-t",
  "border-b",
  "border-gray-400",
  "w-full",
  "text-ms"
);
const cnTopTable = classnames(cnTable, "internal-linking");
const cnTH = classnames("bg-gray-300");
const cnTHURL = classnames(cnTH, "w-1/3", "break-all");
const cnTDText = classnames("w-1/5");
const cnTDFollow = classnames("w-1/90");
const cnEmpty = classnames(
  "flex",
  "gap-2",
  "items-center",
  "px-8",
  "pt-2",
  "pb-4",
  "text-warning-dark"
);

const InternalLinking = ({ url, body, updateAnalysis }) => {
  const [internalLinking, setInternalLinking] = useState(undefined);

  useEffect(() => {
    if (!body) return;
    if (body) {
      const data = [...body.querySelectorAll("a")]
        .filter(
          (el) =>
            el.getAttribute("href")?.startsWith("https://www.vodafone.es") ||
            el.getAttribute("href")?.startsWith("#")
        )
        .reduce((acc, link) => {
          let href = link.getAttribute("href").trim().split("?")[0];
          if (href.startsWith("#")) {
            const exists = acc.find((el) => el.href === url);
            if (exists) exists.links.push(link);
            else
              acc.push({
                href: url,
                links: [link],
              });
          } else {
            const exists = acc.find((el) => el.href === href);
            if (exists) exists.links.push(link);
            else
              acc.push({
                href,
                links: [link],
              });
          }
          return acc;
        }, []);

      setInternalLinking(data);
      updateAnalysis({ update: { internalLinking: data } });
    }
  }, [body, updateAnalysis, url]);

  return internalLinking ? (
    internalLinking.length > 0 ? (
      <table className={cnTopTable}>
        <tbody>
          <tr>
            <th className={cnTHURL}>URL</th>
            <th className={cnTH}>Texto enlace</th>
            <th className={cnTH}>Rel</th>
            <th className={cnTH}>Title</th>
            <th className={cnTH}>Aria Label</th>
          </tr>
          {internalLinking.map((el) => (
            <Fragment key={crypto.randomUUID()}>
              <tr>
                <td rowSpan={el.links.length + 1}>{el.href}</td>
              </tr>
              {el.links.map((link) => (
                <tr key={link.title + crypto.randomUUID()}>
                  <td className={cnTDText}>
                    {link.textContent ||
                      link.querySelector("img")?.getAttribute("alt")}
                  </td>
                  <td className={cnTDFollow}>{link.getAttribute("rel")}</td>
                  <td className={cnTDText}>{link.getAttribute("title")}</td>
                  <td className={cnTDText}>
                    {link.getAttribute("aria-label")}
                  </td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    ) : (
      <p className={cnEmpty}>
        <Dot type="warning" />
        NO INTERNAL LINKS ON THIS PAGE
      </p>
    )
  ) : (
    <p>...</p>
  );
};

InternalLinking.propTypes = {
  url: PropTypes.string.isRequired,
  body: PropTypes.object.isRequired,
  updateAnalysis: PropTypes.func.isRequired,
};

export default InternalLinking;
