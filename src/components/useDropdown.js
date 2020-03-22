import React, { useState } from 'react';

const useDropdown = (label, defaultState, options) => {
  const [state, setState] = useState(defaultState);
  const id = `use-dropdown-${label.replace(' ', '').toLowerCase()}`;

  const updateValue = value => {
    setState(value);
    console.log(`Selecting ${label}: ${value}`);
  };

  const Dropdown = () => (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label" htmlFor={id}>
          {label}
        </label>
      </div>
      <div className="field-body">
        <div className="field">
          <div className="control has-icons-left">
            <div className="select">
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
                        {aroundBody && aroundBody.body !== 'kerbol' ? '- ' : ''}
                        {name}
                      </option>
                    ))
                  : ''}
              </select>
            </div>
            <span className="icon is-large is-left">
              <i className="fas fa-globe" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return [state, Dropdown, setState];
};

export default useDropdown;
