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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>To begin, select a planetary body...</p>
      <BodyDropdown />

      <p>...and a calculator...</p>

      <ul>
        <li>
          <a href="#">Required delta-v for Hohmann transfer</a>
        </li>
        <li>
          <a href="#">Orbital period &amp; darkness time</a>
        </li>
      </ul>

      <DeltaVCalculator />
    </div>
  );
}

export default ToolWidget;
