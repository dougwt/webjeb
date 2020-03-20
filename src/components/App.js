import React from 'react';
import './App.css';
import ToolWidget from './ToolWidget';

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
      </header>

      <ToolWidget />
    </div>
  );
}

export default App;
