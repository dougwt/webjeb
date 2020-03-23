import React from 'react';

function DeltaVCalculator() {
  return (
    <form action="#">
      <fieldset>
        <legend className="title">
          Delta-v for Hohmann transfer orbital changes
        </legend>

        <label className="label" htmlFor="lower">
          Lower altitude
        </label>
        <div className="field has-addons">
          <div className="control">
            <input className="input" type="text" id="lower" />
          </div>
          <div className="control">
            <button className="button is-static" type="button">
              km
            </button>
          </div>
        </div>

        <label className="label" htmlFor="higher">
          Higher altitude
        </label>
        <div className="field has-addons">
          <div className="control">
            <input className="input" type="text" id="higher" />
          </div>
          <div className="control">
            <button className="button is-static" type="button">
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
