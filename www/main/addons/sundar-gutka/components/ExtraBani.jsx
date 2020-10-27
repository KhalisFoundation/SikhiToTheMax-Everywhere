import React from 'react';
import PropTypes from 'prop-types';
import { Tile } from '../../../common/sttm-ui';
import { convertToHyphenCase } from '../../../common/utils';

import loadBani from '../utils/load-bani';

const ExtraBani = ({ title, banis = [], onScreenClose }) => {
  const hyphenedTitle = convertToHyphenCase(title.toLowerCase());
  const groupHeaderClassName = `${hyphenedTitle}-heading`;
  const groupClassName = hyphenedTitle;
  const groupItemClassName = hyphenedTitle.slice(0, -1); // removes last character from string.

  return (
    <div className="bani-group-container">
      <header className={`bani-group-heading ${groupHeaderClassName}`}>{title}</header>
      <div className={`bani-group ${groupClassName}`}>
        {banis.map(b => (
          <Tile
            onClick={loadBani(b, onScreenClose)}
            key={b.name}
            type="extras"
            className={groupItemClassName}
          >
            {b.name}
          </Tile>
        ))}
      </div>
    </div>
  );
};

ExtraBani.propTypes = {
  title: PropTypes.string,
  onScreenClose: PropTypes.func,
  banis: PropTypes.arrayOf({
    name: PropTypes.string.isRequired,
  }),
};

export default ExtraBani;
