import React, { Component } from 'react';
import * as d3 from 'd3';
import data from './data/boxoffice.csv';
import movieDataExtended from './data/movies_details.json';
import BarChart from './views/visualizations/BarChart';
import ExtendedBarChart from './views/visualizations/DetailsDataSet/BarChart';
import ExtendedBarChartHorizontal from './views/visualizations/DetailsDataSet/BarChartHorizontal';
import RatingsBarChartHorizontal from './views/visualizations/DetailsDataSet/RatingsBarChartHorizontal';
import RatingsBarChart from './views/visualizations/DetailsDataSet/RatingsBarChart';
import GenresLineChart from './views/visualizations/DetailsDataSet/GenresLineChart';
import ScatterPlot from './views/visualizations/ScatterPlot';
import ExtendedScatterPlot from './views/visualizations/DetailsDataSet/ScatterPlot';
import LineChart from './views/visualizations/LineChart'
import GenresFilter from './views/filters/GenresFilter/GenresFilter';
import { groupBy, getFirstX, getRandX, getMoviesInRange, sortByPropertyAsc, filterPropertyNonNumbers } from './utils/data-utils';
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
        genreTimelineData: [],
        defaultChartWidth: 400,
        defaultChartHeight: 200,
        genresList: [],
        sortProperty: 'boxOffice',
    };
  }

  componentWillMount() {
    let boxOfficeData = [];
    d3.csv(data,
      (movie) => {
        boxOfficeData.push({
          title: movie.title,
          boxOffice: +movie.lifetime_gross,
          year: movie.year
        });
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

      const moviesWithBoxOffice = filterPropertyNonNumbers(movieDataExtendedArray, 'boxOffice');

      const moviesDataExtendedSorted = sortByPropertyAsc(moviesWithBoxOffice, 'boxOffice');
      const firstExtendedFive = getFirstX(moviesDataExtendedSorted, 5);
      const moviesPerYear = this.getMoviesPerYear(boxOfficeData);

      // get genres for genre timeline chart
      const moviesOfGenrePerYear = getFirstX(this.getMoviesOfGenrePerYear(moviesWithBoxOffice), 10);
      const genresList = moviesOfGenrePerYear.map((genre) => genre.genre);

      this.setState({
        ...this.state,
        extendedRawData: movieDataExtendedArray,
        extendedVisData: firstExtendedFive,
        visData: firstFive,
        rawData: boxOfficeData,
        timelineData: moviesPerYear,
        genreTimelineData: moviesOfGenrePerYear,
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
    const {
      rawData,
      extendedRawData,
      sortProperty,
    } = this.state;

    if (range) {
      const moviesInRange = getMoviesInRange(range, rawData, 'year');
      const moviesInRangeExtended = getMoviesInRange(range, sortByPropertyAsc(extendedRawData), 'year');
      const topRatedInRange = sortByPropertyAsc(moviesInRangeExtended, sortProperty);
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
  getGenresList(data) {
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
    const genresList = this.getGenresList(movies);
    const moviesOfGenrePerYear = genresList.map((genre) => {
      const moviesOfGenre = this.getMoviesOfGenre(genre, movies);
      return { 'genre': genre, 'data': this.getMoviesPerYear(moviesOfGenre), 'totalMoviesOfGenre': moviesOfGenre.length }
    })

    return sortByPropertyAsc(moviesOfGenrePerYear, 'totalMoviesOfGenre');
  }

  filterMoviesByGenre(genre) {
    const { extendedRawData, sortProperty } = this.state;

    if (genre === 'all') {
      const moviesWithBoxOffice = filterPropertyNonNumbers(extendedRawData, 'boxOffice');
      const moviesDataExtendedSorted = sortByPropertyAsc(moviesWithBoxOffice, 'boxOffice');
      const firstExtendedFive = getFirstX(moviesDataExtendedSorted, 5);
      return this.setState({
        ...this.state,
        extendedVisData: firstExtendedFive,
      });
    }

    let moviesOfGenre = this.getMoviesOfGenre(genre, extendedRawData);
    moviesOfGenre = sortByPropertyAsc(moviesOfGenre, sortProperty);

    this.setState({
      ...this.state,
      extendedVisData: getFirstX(moviesOfGenre, 5)
    });
  }

  setSortProperty = (sortProperty) => {
    const { extendedRawData } = this.state;
    
    this.setState({
      ...this.state,
      sortProperty,
      extendedVisData: getFirstX(sortByPropertyAsc(extendedRawData, sortProperty), 5),
    });
  }

  render() {
    const { 
      visData,
      extendedVisData,
      timelineData,
      genreTimelineData,
      defaultChartWidth,
      defaultChartHeight,
      genresList,
    } = this.state;

    return (
      <div className="App">
        <h1 className='section-title'>Exploring Movie Data</h1>
        <div className='visualizations-container'>
          {/* <BarChart visData={visData} width={defaultChartWidth} height={defaultChartHeight} /> */}
          {/* <ExtendedBarChart visData={extendedVisData} width={defaultChartWidth} height={defaultChartHeight} /> */}
          <ExtendedBarChartHorizontal visData={extendedVisData} width={800} height={300} chartTitle={'US Domestic Box Office'} />
          {/* <ScatterPlot visData={extendedVisData} width={defaultChartWidth} height={defaultChartHeight} chartTitle={'Box Office vs Release Year'} /> */}
          <ExtendedScatterPlot visData={extendedVisData} width={defaultChartWidth} height={defaultChartHeight} chartTitle={'Box Office vs MetaScore'} />
          {/* <RatingsBarChart visData={extendedVisData} width={defaultChartWidth} height={defaultChartHeight}  /> */}
          <RatingsBarChartHorizontal visData={extendedVisData} width={defaultChartWidth} height={defaultChartHeight} chartTitle={'Score on MetaCritic'} />
        </div>
        <div className='buttons-container'>
          <p>Sort By:</p>
          <button onClick={() => this.setSortProperty('boxOffice')}>Box Office Revenue</button>
          <button onClick={() => this.setSortProperty('metascore')}>MetaCritic Score</button>
        </div>
        <GenresFilter genres={genresList} onClick={(genre) => this.filterMoviesByGenre(genre)} />

        {/* <LineChart visData={timelineData} updateRange={this.updateDateRange} fixedBottom={true} /> */}

        <GenresLineChart visData={genreTimelineData} genres={genresList} updateRange={this.updateDateRange} fixedBottom={true} />
      </div>
    );
  }
}

export default App;
