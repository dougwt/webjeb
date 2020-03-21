import React, { useState } from 'react';

const useDropdown = (label, defaultState, options) => {
  const [state, setState] = useState(defaultState);
  const id = `use-dropdown-${label.replace(' ', '').toLowerCase()}`;

  const updateValue = value => {
    setState(value);
    console.log(`Selecting ${label}: ${value}`);
  };

  const Dropdown = () => (
    <label htmlFor={id}>
      {label}:&nbsp;
      <select
        id={id}
        value={state}
        onChange={e => updateValue(e.target.value)}
        onBlur={e => updateValue(e.target.value)}
        disabled={options && options.length && options.length === 0}
      >
        {options && options.map
          ? options.map(({ name, aroundBody }) => (
              <option key={name} value={name}>
                {aroundBody && aroundBody.body !== 'kerbol' ? '-' : ''}
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
