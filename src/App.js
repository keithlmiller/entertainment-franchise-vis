import React, { Component } from 'react';
import * as d3 from 'd3';
import data from './data/boxoffice.csv';
import movieDataExtended from './data/movies_details.json';
import BarChart from './views/visualizations/BarChart';
import ScatterPlot from './views/visualizations/ScatterPlot';
import LineChart from './views/visualizations/LineChart'
import { groupBy, getRandIndex, getFirstX, getRandXAdjacent, getRandX } from './utils/data-utils';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        visData: [],
        rawData: [],
        extendedRawData: [],
        extendedVisData: [],
        timelineData: [],
    };
  }

  componentWillMount() {
    let boxOfficeData = [];
    d3.csv(data,
      (data) => {
        boxOfficeData.push(data);
      }
    ).then(() => {
      const firstFive = getFirstX(boxOfficeData, 5);

      const movieDataExtendedArray =
        Object.keys(movieDataExtended).map((key) => movieDataExtended[key]);
      const firstExtendedFive = getFirstX(movieDataExtendedArray, 5);
      const moviesPerYear = this.getMoviesPerYear(boxOfficeData);

      this.setState({
        ...this.state,
        extendedRawData: movieDataExtendedArray,
        extendedVisData: firstExtendedFive,
        visData: firstFive,
        rawData: boxOfficeData,
        timelineData: moviesPerYear,
      });
    });
  }

  getMoviesPerYear = (data) => {
    const groupedData = groupBy(data, 'year');
    const moviesPerYear = Object.entries(groupedData)
      .map(year => ({year: year[0], numMovies: year[1].length}));
    return moviesPerYear;
  }

  getMoviesInDateRange = (range, data) => {
    const [minYear, maxYear] = range;
    const moviesInRange = data.filter((movie) => (movie.year > minYear && movie.year < maxYear));

    return moviesInRange;
  }

  updateDateRange = (range) => {
    if (range) {
      const moviesInRange = this.getMoviesInDateRange(range, this.state.rawData);
      const topFiveInRange = getFirstX(moviesInRange, 5);
      this.setState({
        ...this.state,
        visData: topFiveInRange,
      });
    }
  }

  updateData = (updateFunc, numItems) => {
    const { rawData, extendedRawData } = this.state;

    return () => this.setState({
      ...this.state,
      visData: updateFunc(rawData, numItems),
      extendedVisData: updateFunc(extendedRawData, numItems)
    });
  }

  render() {
    const { visData, extendedVisData, timelineData } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <BarChart visData={visData} />
          <LineChart visData={timelineData} updateRange={this.updateDateRange} />
          <ScatterPlot visData={visData} />

          <button onClick={this.updateData(getFirstX, 5)}>Top Movies</button>
          <button onClick={this.updateData(getRandX, 5)}>Random Movies</button>
        </header>
      </div>
    );
  }
}

export default App;
