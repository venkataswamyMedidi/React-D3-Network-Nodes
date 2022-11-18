import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import Graph from './Graph';
import './style.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
      <Graph />
    );
  }
}

render(<App />, document.getElementById('root'));
