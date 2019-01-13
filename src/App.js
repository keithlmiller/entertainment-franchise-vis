import React, { Component } from 'react';
import * as d3 from 'd3';
import data from './data/boxoffice.csv';
import movieDataExtended from './data/movies_details.json';
import BarChart from './views/visualizations/BarChart';
import RatingsBarChart from './views/visualizations/RatingsBarChart';
import ScatterPlot from './views/visualizations/ScatterPlot';
import LineChart from './views/visualizations/LineChart'
import { groupBy, getFirstX, getRandX, getMoviesInRange, getTopByProperty } from './utils/data-utils';
import './App.css';
// import 'normalize.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        visData: [],
        rawData: [],
        extendedRawData: [],
        extendedVisData: [],
        timelineData: [],
        defaultChartWidth: 400,
        defaultChartHeight: 200,
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

  updateDateRange = (range) => {
    if (range) {
      const moviesInRange = getMoviesInRange(range, this.state.rawData, 'year');
      const moviesInRangeExtended = getMoviesInRange(range, this.state.extendedRawData, 'Year');
      const topRatedInRange = getTopByProperty(moviesInRangeExtended, 'Metascore');
      const topFiveInRange = getFirstX(moviesInRange, 5);
      const firstFiveExtended = getFirstX(topRatedInRange, 5);

      this.setState({
        ...this.state,
        visData: topFiveInRange,
        extendedVisData: firstFiveExtended,
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
    const { 
      visData,
      extendedVisData,
      timelineData,
      defaultChartWidth,
      defaultChartHeight,
    } = this.state;

    return (
      <div className="App">
        <h1 className='section-title'>Top Grossing Films US Box Office</h1>
        <div className='visualizations-container'>
          <BarChart visData={visData} width={defaultChartWidth} height={defaultChartHeight} />
          <ScatterPlot visData={visData} width={defaultChartWidth} height={defaultChartHeight}  />
          <RatingsBarChart visData={extendedVisData} width={defaultChartWidth} height={defaultChartHeight}  /> 
        </div>
        <div className='buttons-container'>
            <button onClick={this.updateData(getFirstX, 5)}>Top Movies</button>
            <button onClick={this.updateData(getRandX, 5)}>Random Movies</button>  
          </div>
        <LineChart visData={timelineData} updateRange={this.updateDateRange} fixedBottom={true} />
      </div>
    );
  }
}

export default App;
