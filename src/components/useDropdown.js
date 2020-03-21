import React, { useState } from 'react';

const useDropdown = (label, defaultState, options) => {
  const [state, setState] = useState(defaultState);
  const id = `use-dropdown-${label.replace(' ', '').toLowerCase()}`;

  const Dropdown = () => (
    <label htmlFor={id}>
      {label}:&nbsp;
      <select
        id={id}
        value={state}
        onChange={e => setState(e.target.value)}
        onBlur={e => setState(e.target.value)}
        disabled={options && options.length && options.length === 0}
      >
        <option>Choose...</option>
        {options && options.map
          ? options.map(({ name }) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))
          : ''}
      </select>
    </label>
  );

  return [state, Dropdown, setState];
};

export default useDropdown;
