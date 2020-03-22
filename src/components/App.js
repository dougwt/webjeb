import React from 'react';
import ToolWidget from './ToolWidget';
import './App.css';

function App() {
  return (
    <>
      <header>
        <section className="hero is-primary is-bold">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">webjeb</h1>
              <h2 className="subtitle">Tagline</h2>
              <p>
                <span className="hello">Hello</span>, and welcome to the
                experimental test site for a small collection of handy
                calculators for use with Kerbal Space Program. This site is
                powered by a{' '}
                <a href="/api/">
                  publicly available API containing community-sourced info about
                  the Kerbol solar system
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </header>

      <ToolWidget defaultValue="Kerbin" />

      <footer className="footer">
        <div className="content has-text-centered">
          <p>Footer text</p>
        </div>
      </footer>
    </>
  );
}

export default App;
