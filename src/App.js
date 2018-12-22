import React, { Component } from 'react';
import * as d3 from 'd3';
import data from './data/boxoffice.csv';
import movieDataExtended from './data/movies_details.json';
import BarChart from './views/visualizations/BarChart';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        visData: [],
        rawData: [],
        extendedRawData: [],
        extendedVisData: [],
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

      const movieDataExtendedArray =
        Object.keys(movieDataExtended).map((key) => movieDataExtended[key]);
      const firstExtendedFive = this.getFirstX(movieDataExtendedArray, 5);

      this.setState({
        ...this.state,
        extendedRawData: movieDataExtendedArray,
        extendedVisData: firstExtendedFive,
        visData: firstFive,
        rawData: boxOfficeData,
      });
    });

    console.log('movieDataExtended', movieDataExtended);
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
