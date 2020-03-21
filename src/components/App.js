import React from 'react';
import ToolWidget from './ToolWidget';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <section className="hero">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">webjeb</h1>
              <h2 className="subtitle">Tagline</h2>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <p>
              <span className="hello">Hello</span>, and welcome to the
              experimental test site for a small collection of handy calculators
              for use with Kerbal Space Program. This site is powered by a{' '}
              <a href="/api/">
                publicly available API containing community-sourced info about
                the Kerbol solar system
              </a>
              .
            </p>
          </div>
        </section>
      </header>

      <ToolWidget defaultValue="Kerbin" />
    </div>
  );
}

export default App;
