import React, { useState, useEffect } from 'react';
import './App.css';
import DeltaVCalculator from './DeltaVCalculator';
import useDropdown from './useDropdown';

function App() {
  const [bodies, setBodies] = useState([]);
  const [body, BodyDropdown, setBody] = useDropdown(
    'Planetary Body',
    '',
    bodies
  );

  useEffect(() => {
    setBodies([]);
    setBody('');

    fetch('/api/bodies/')
      .then(response => response.json())
      .then(data => setBodies(data));
  }, [setBody]);

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

        <p>To begin, select a planetary body...</p>
        <BodyDropdown />

        {/* <p>
          ...and a calculator...
          <ul>
            <li>
              <a href="#">Required delta-v for Hohmann transfer</a>
            </li>
            <li>
              <a href="#">Orbital period &amp; darkness time</a>
            </li>
          </ul>
        </p> */}
      </header>

      {/* <DeltaVCalculator /> */}
    </div>
  );
}

export default App;
