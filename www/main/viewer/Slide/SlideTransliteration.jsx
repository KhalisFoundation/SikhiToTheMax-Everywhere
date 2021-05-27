import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStoreState } from 'easy-peasy';
import anvaad from 'anvaad-js';

const SlideTransliteration = ({ gurmukhiString }) => {
  const { transliterationLanguage, transliterationFontSize } = useStoreState(
    state => state.userSettings,
  );
  const [transliterationString, setTransliterationString] = useState(null);

  const getTransliteration = gurmukhi => {
    switch (transliterationLanguage) {
      case 'English':
        setTransliterationString(anvaad.translit(gurmukhi));
        break;
      case 'Shahmukhi':
        setTransliterationString(anvaad.translit(gurmukhi || '', 'shahmukhi'));
        break;
      case 'Devanagari':
        setTransliterationString(anvaad.translit(gurmukhi || '', 'devnagri'));
        break;
      default:
        setTransliterationString(null);
        break;
    }
  };

  useEffect(() => {
    getTransliteration(gurmukhiString);
  }, [gurmukhiString]);

  return (
    transliterationString && (
      <div
        className={`slide-transliteration language-${transliterationLanguage}`}
        style={{ fontSize: `${transliterationFontSize * 3}px` }}
      >
        {transliterationString}
      </div>
    )
  );
};

SlideTransliteration.propTypes = {
  gurmukhiString: PropTypes.string,
};

export default SlideTransliteration;
