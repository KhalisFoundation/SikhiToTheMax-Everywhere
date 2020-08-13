import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Switch = ({ title, controlId, className, onToggle, defaultValue = false }) => {
  const [isSwitched, toggleSwitchedState] = useState(defaultValue);

  return (
    <div className={className}>
      {title && <span>{title}</span>}
      <div className="switch">
        <input
          id={controlId}
          type="checkbox"
          checked={isSwitched}
          onChange={() => {
            const newState = !isSwitched;
            toggleSwitchedState(newState);
            if (onToggle) {
              onToggle(newState);
            }
          }}
        />
        <label htmlFor={controlId} />
      </div>
    </div>
  );
};

Switch.propTypes = {
  title: PropTypes.string,
  controlId: PropTypes.string,
  className: PropTypes.string,
  defaultValue: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default Switch;
