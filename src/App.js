import React, { Component } from 'react';
import * as d3 from 'd3';
import data from './data/boxoffice.csv';
import BarChart from './views/visualizations/BarChart';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        data: [],
    };
  }

  componentWillMount() {
    let boxOfficeData = [];
    d3.csv(data,
      (data) => {
        boxOfficeData.push(data);
      }
    ).then(() => {

      const firstFive = this.getFirstX(boxOfficeData, 5);
      const randFiveAdjacent = this.getRandXAdjacent(boxOfficeData, 5);
      const randFive = this.getRandX(boxOfficeData, 5);
      this.setState({ data: randFive })
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
    return (
      <div className="App">
        <header className="App-header">
          <BarChart data={this.state.data}/>

        </header>
      </div>
    );
  }
}

export default App;
