import React, { Component } from 'react';
import * as d3 from 'd3';
import data from './data/boxoffice.csv';
import movieDataExtended from './data/movies_details.json';
import BarChart from './views/visualizations/BarChart';
import ExtendedBarChart from './views/visualizations/DetailsDataSet/BarChart';
import RatingsBarChart from './views/visualizations/RatingsBarChart';
import ScatterPlot from './views/visualizations/ScatterPlot';
import LineChart from './views/visualizations/LineChart'
import GenresFilter from './views/filters/GenresFilter/GenresFilter';
import { groupBy, getFirstX, getRandX, getMoviesInRange, sortByPropertyAsc, sortByPropertyDesc } from './utils/data-utils';
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
        Object.keys(movieDataExtended).map((key) => {
          const movie = movieDataExtended[key];
          const date = new Date(movie.Released);
          const boxOffice = parseInt(movie.BoxOffice.replace(/[\$\,]/g, ""));
          return {
            title: movie.Title,
            date,
            boxOffice: boxOffice,
            genre: movie.Genre.split(", "),
            year: +movie.Year,
            metascore: +movie.Metascore,
          }
        });

      const moviesWithBoxOffice = movieDataExtendedArray.filter((movie) => !isNaN(movie.boxOffice))

      const moviesDataExtendedSorted = sortByPropertyAsc(moviesWithBoxOffice, 'boxOffice');
      const firstExtendedFive = getFirstX(moviesDataExtendedSorted, 5);
      const moviesPerYear = this.getMoviesPerYear(boxOfficeData);

      const genresList = this.getGenresData(movieDataExtendedArray);

      this.setState({
        ...this.state,
        extendedRawData: movieDataExtendedArray,
        extendedVisData: firstExtendedFive,
        visData: firstFive,
        rawData: boxOfficeData,
        timelineData: moviesPerYear,
        genresList,
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
      const moviesInRangeExtended = getMoviesInRange(range, this.state.extendedRawData, 'year');
      const topRatedInRange = sortByPropertyAsc(moviesInRangeExtended, 'metascore');
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


  // get number of movies per genre
  // get revenue per genre per year
  // get list of genres
  getGenresData(data) {
    const genresData = data.map((movie) => movie.genre);
    const genresFlat = genresData.flat(1);
    const genresList = [...new Set(genresFlat)].sort();

    return genresList;
  }

  // get all movies that have specified genre
  getMoviesOfGenre(genre, movies) {
    return movies.filter((movie) => movie.genre.includes(genre));
  }

  // get number of movies of each genre per year
  // this will be used to get the line chart data, with a line per genre
  getMoviesOfGenrePerYear(movies) {
    const genresList = this.getGenresData(movies);
    const moviesOfGenrePerYear = genresList.map((genre) => {
      return { [genre]: this.getMoviesPerYear(this.getMoviesOfGenre(genre, movies))}
    })

    return moviesOfGenrePerYear;
  }



  filterMoviesByGenre(genre) {
    const { extendedRawData } = this.state;

    let moviesOfGenre = this.getMoviesOfGenre(genre, extendedRawData);
    moviesOfGenre = sortByPropertyAsc(moviesOfGenre, 'metascore');

    this.setState({
      ...this.state,
      extendedVisData: getFirstX(moviesOfGenre, 5)
    });
  }

  render() {
    const { 
      visData,
      extendedVisData,
      timelineData,
      defaultChartWidth,
      defaultChartHeight,
      genresList,
    } = this.state;

    return (
      <div className="App">
        <h1 className='section-title'>Top Grossing Films US Box Office</h1>
        <div className='visualizations-container'>
          {/* <BarChart visData={visData} width={defaultChartWidth} height={defaultChartHeight} /> */}
          <ExtendedBarChart visData={extendedVisData} width={defaultChartWidth} height={defaultChartHeight} />
          <ScatterPlot visData={visData} width={defaultChartWidth} height={defaultChartHeight}  />
          <RatingsBarChart visData={extendedVisData} width={defaultChartWidth} height={defaultChartHeight}  /> 
        </div>
        <GenresFilter genres={genresList} onClick={(genre) => this.filterMoviesByGenre(genre)} /> 
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
