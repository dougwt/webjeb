import React from 'react';
import _uniqueId from 'lodash/uniqueId';

function DeltaVCalculator() {
  const lowerId = _uniqueId('alt_lower_');
  const higherId = _uniqueId('alt_higher_');

  return (
    <form action="#">
      <fieldset>
        <legend className="title">
          Delta-v for Hohmann transfer orbital changes
        </legend>

        <label className="label" htmlFor={lowerId}>
          Lower altitude
        </label>
        <div className="field has-addons">
          <div className="control">
            <input className="input" type="text" id={lowerId} />
          </div>
          <div className="control">
            <button className="button is-static" type="button" tabIndex="-1">
              km
            </button>
          </div>
        </div>

        <label className="label" htmlFor={higherId}>
          Higher altitude
        </label>
        <div className="field has-addons">
          <div className="control">
            <input className="input" type="text" id={higherId} />
          </div>
          <div className="control">
            <button className="button is-static" type="button" tabIndex="-1">
              km
            </button>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <button className="button is-link is-pulled-right" type="submit">
              Submit
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  );
}

export default DeltaVCalculator;
