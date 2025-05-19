import { useState, useCallback } from 'react';
import classnames from 'tailwindcss-classnames';

import { IconSource } from '../../components/Icon/Icon';
import Header from '../../components/Header/Header';
import Analyzer from '../../components/Analyzer/Analyzer';
import { inyectTesseract } from './utils/commonMethods';

import '../../assets/styles/base.css';
import './App.css';

const cnBase = classnames(
  'relative',
  'min-w-extension',
  'min-h-extension',
  'pb-14'
);

inyectTesseract();

const App = () => {
  const [analysis, setAnalysis] = useState({});

  const updateAnalysis = useCallback(
    ({ update }) => setAnalysis((prev) => ({ ...prev, ...update })),
    []
  );

  return (
    <div className={cnBase}>
      <Header />
      <Analyzer analysis={analysis} updateAnalysis={updateAnalysis} />
      <IconSource />
    </div>
  );
};

export default App;
