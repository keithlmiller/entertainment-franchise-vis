import React, { Component } from 'react';
import * as d3 from 'd3';
import data from './data/boxoffice.csv';
import BarChart from './views/visualizations/BarChart';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        visData: [],
        rawData: [],
    };
  }

  componentWillMount() {
    let boxOfficeData = [];
    d3.csv(data,
      (data) => {
        boxOfficeData.push(data);
      }
    ).then(() => {
      console.log('boxOfficeData', boxOfficeData);
      const firstFive = this.getFirstX(boxOfficeData, 5);
      this.setState({ visData: firstFive, rawData: boxOfficeData })
    });
  }

  getRandIndex = (boxOfficeData, numMovies) => Math.floor(Math.random() * Math.floor(boxOfficeData.length - numMovies));

  getFirstX = (boxOfficeData, numMovies) => boxOfficeData.slice(0, numMovies);

  getRandXAdjacent = (boxOfficeData, numMovies) => {
    const startingPoint = this.getRandIndex(boxOfficeData, numMovies);
    return boxOfficeData.slice(startingPoint, startingPoint + numMovies);
  }

  getRandX = (boxOfficeData, numMovies) => {
    let randMovies = [];
    for (let i=0; i<numMovies; i++) {
      const movieIndex = this.getRandIndex(boxOfficeData, 1);
      randMovies.push(boxOfficeData[movieIndex]);
    }
    return randMovies;
  }

  render() {
    const { rawData, visData } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <BarChart visData={visData}/>
          <button onClick={() => this.setState({ ...this.state, visData: this.getFirstX(rawData, 5) })}>Top Movies</button>
          <button onClick={() => this.setState({ ...this.state, visData: this.getRandX(rawData, 5) })}>Random Movies</button>
          <button onClick={() => this.setState({ ...this.state, visData: this.getRandXAdjacent(rawData, 5) })}>Random Peer Movies</button>

        </header>
      </div>
    );
  }
}

export default App;
