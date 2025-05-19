import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'tailwindcss-classnames';

const styles = {
  base: classnames('w-full', 'flex', 'flex-col', 'gap-1', 'p-4'),
  valueBase: classnames('font-normal', 'p-2', 'last'),
  value: classnames('font-normal', 'p-2', 'last', 'bg-gray-100'),
  bold: classnames('font-bold'),
  link: classnames('text-primary', 'underline', 'hover:no-underline'),
  listElement: classnames('flex', 'gap-1'),
  titleBase: classnames('p-2', 'whitespace-nowrap'),
  title: classnames('p-2', 'whitespace-nowrap', 'bg-gray-200'),
  correct: classnames('font-normal', 'p-2', 'last', 'bg-green-200'),
  titleDanger: classnames(
    'p-2',
    'whitespace-nowrap',
    'bg-danger-light',
    'text-danger-dark',
    'border',
    'border-danger-dark',
    'border-dashed'
  ),
  titleWarning: classnames(
    'p-2',
    'whitespace-nowrap',
    'bg-warning-light',
    'text-warning-dark',
    'border',
    'border-warning-dark',
    'border-dashed'
  ),
};

const getTitleClass = ({ condition, cnError }) =>
  condition ? styles.title : cnError;

const getInfoClass = ({ condition, cnError }) =>
  condition ? styles.correct : cnError;

const getLanguageMatch = async (body, lang) => {
  let detectingLanguages = await chrome.i18n.detectLanguage(body.innerText);
  return detectingLanguages.languages[0].language === lang;
};

const TextPlusCharsCount = ({ text }) => (
  <p>
    {text} <span className={styles.bold}>({text.length} caracteres)</span>
  </p>
);
const Link = ({ url }) => (
  <a href={url} target='_blank' className={styles.link} rel='noreferrer'>
    {url}
  </a>
);

const Summary = ({ url, head, body, lang, updateAnalysis }) => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (head && body) {
        const langMatch = await getLanguageMatch(body, lang);
        const data = {
          url,
          title: head.querySelector('title')?.textContent,
          main: body.querySelector('main'),
          lang: lang,
          langMatch: langMatch,
        };
        setInfo(data);
        updateAnalysis({ update: { summary: data } });
      }
    };
    fetchData();
  }, [head, body, lang, url, updateAnalysis]);

  return info ? (
    <ul className={styles.base}>
      <li className={styles.listElement}>
        <span
          className={getTitleClass({
            condition: info.url,
            cnError: styles.titleDanger,
          })}
        >
          URL:
        </span>
        <span className={styles.value}>
          <Link url={info.url} />
        </span>
      </li>
      <li className={styles.listElement}>
        <span
          className={getTitleClass({
            condition: info.title,
            cnError: styles.titleDanger,
          })}
        >
          Title:
        </span>
        <span className={styles.value}>
          {info.title ? <TextPlusCharsCount text={info.title} /> : 'NO DATA'}
        </span>
      </li>
      <li className={styles.listElement}>
        <span
          className={getTitleClass({
            condition: info.main,
            cnError: styles.titleDanger,
          })}
        >
          Main Tag:
        </span>
        <span className={styles.value}>
          {info.main ? 'Contains Main Tag' : 'NO DATA'}
        </span>
      </li>
      <li className={styles.listElement}>
        <span
          className={getTitleClass({
            condition: info.lang,
            cnError: styles.titleDanger,
          })}
        >
          Language attribute:
        </span>
        <span className={styles.value}>
          {info.lang ? 'Contains lang' : 'NO DATA'}
        </span>
        <span
          className={getInfoClass({
            condition: info.langMatch,
            cnError: styles.titleWarning,
          })}
        >
          {info.langMatch ? 'Correct lang attribute' : "Data doesn't match"}
        </span>
      </li>
    </ul>
  ) : (
    <p>...</p>
  );
};

Summary.propTypes = {
  url: PropTypes.string.isRequired,
  head: PropTypes.object,
  body: PropTypes.object,
  lang: PropTypes.string.isRequired,
  updateAnalysis: PropTypes.func.isRequired,
};

export default Summary;
