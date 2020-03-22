import React, { useState, useEffect } from 'react';
import DeltaVCalculator from './DeltaVCalculator';
import useDropdown from './useDropdown';

function ToolWidget(props) {
  const { defaultValue } = props;
  const [bodies, setBodies] = useState([]);
  const [body, BodyDropdown, setBody] = useDropdown(
    'Planetary Body',
    defaultValue,
    bodies
  );

  useEffect(() => {
    console.log('Fetching api data...');
    setBodies([]);
    setBody('');

    fetch('/api/bodies/')
      .then(response => response.json())
      .then(data => {
        setBodies(data);
        console.table(data);
        setBody(defaultValue);
        console.log(`Selecting default Planetary Value: ${defaultValue}`);
      });
  }, [setBody, defaultValue]);

  if (!bodies || bodies.length < 1) {
    return (
      <section className="section">
        <div className="container">Loading...</div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <BodyDropdown />

        {/*
        <p>Then choose a calculator...</p>

        <div className="tabs is-boxed">
          <ul>
            <li className="is-active">
              <a>Required delta-v for Hohmann transfer</a>
            </li>
            <li>
              <a>Orbital period &amp; darkness time</a>
            </li>
          </ul>
        </div>
        */}

        <div className="tile is-ancestor">
          <div className="tile is-6 is-parent">
            <div className="tile is-child box">
              <DeltaVCalculator />
            </div>
          </div>
          <div className="tile is-6 is-parent">
            <div className="tile is-child box">
              <DeltaVCalculator />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ToolWidget;
