import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>webjeb</h1>

        <p>
          <span className="hello">Hello</span>, and welcome to the experimental
          test site for a small collection of handy calculators for use with
          Kerbal Space Program. This site is powered by a{' '}
          <a href="/api/">
            publicly available API containing community-sourced info about the
            Kerbol solar system
          </a>
          .
        </p>

        <p>
          To begin, select a planetary body...
          <select name="bodies" id="body-select">
            <option value="">Loading...</option>
          </select>
        </p>

        <p>
          ...and a calculator...
          <ul>
            <li>
              <a href="#">Required delta-v for Hohmann transfer</a>
            </li>
            <li>
              <a href="#">Orbital period &amp; darkness time</a>
            </li>
          </ul>
        </p>
      </header>

      <form action="#">
        <fieldset>
          <legend>Delta-v for Hohmann transfer orbital changes</legend>

          <p>
            <label for="planet">Planetary body:</label>
            <select name="planet" id="planet">
              <option value="">Loading...</option>
            </select>
          </p>

          <p>
            <label for="lower">Lower altitude:</label>
            <input type="text" id="lower" /> km
          </p>

          <p>
            <label for="higher">Higher altitude:</label>
            <input type="text" id="higher" /> km
          </p>

          <p>
            <button>Submit</button>
            <button type="reset">Clear</button>
          </p>
        </fieldset>
      </form>
    </div>
  );
}

export default App;
