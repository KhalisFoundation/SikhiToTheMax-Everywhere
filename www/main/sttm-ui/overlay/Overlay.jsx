import React from 'react';
import PropTypes from 'prop-types';

const Overlay = ({ onScreenClose, children }) => {
  return (
    <div className="backdrop">
      <button className="close-screen" onClick={onScreenClose}>
        <i className="fa fa-times" />
      </button>
      {children}
    </div>
  );
};

Overlay.propTypes = {
  onScreenClose: PropTypes.func,
};

export default Overlay;
