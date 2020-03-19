import React from 'react';

function DeltaVCalculator() {
  return (
    <form action="#">
      <fieldset>
        <legend>Delta-v for Hohmann transfer orbital changes</legend>

        <p>
          <label htmlFor="planet">
            Planetary body:
            <select name="planet" id="planet">
              <option value="">Loading...</option>
            </select>
          </label>
        </p>

        <p>
          <label htmlFor="lower">
            Lower altitude:
            <input type="text" id="lower" /> km
          </label>
        </p>

        <p>
          <label htmlFor="higher">
            Higher altitude:
            <input type="text" id="higher" /> km
          </label>
        </p>

        <p>
          <button type="submit">Submit</button>
          <button type="reset">Clear</button>
        </p>
      </fieldset>
    </form>
  );
}

export default DeltaVCalculator;
