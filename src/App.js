import React, { Component } from 'react';
import * as d3 from 'd3';
import movieData from './data/movies_details.json';
import ExtendedBarChartHorizontal from './views/visualizations/DetailsDataSet/BarChartHorizontal';
import RatingsBarChartHorizontal from './views/visualizations/DetailsDataSet/RatingsBarChartHorizontal';
import GenresLineChart from './views/visualizations/DetailsDataSet/GenresLineChart';
import ExtendedScatterPlot from './views/visualizations/DetailsDataSet/ScatterPlot';
import GenresFilter from './views/filters/GenresFilter/GenresFilter';
import { 
  groupBy, 
  getFirstX, 
  getMoviesInRange, 
  sortByPropertyAsc, 
  filterPropertyNonNumbers 
} from './utils/data-utils';
import './App.css';
// import 'normalize.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        rawData: [], // original data, only modified on first read 
        allDataFiltered: [],
        timelineData: [],
        genreTimelineData: [],
        defaultChartWidth: 400,
        defaultChartHeight: 200,
        genresList: [],
        sortProperty: 'boxOffice',
        genreFilter: 'all',
        dateRange: [],
        moviesPerChart: 5,
    };
  }

  componentWillMount() {
    const movieDataArray =
      Object.keys(movieData).map((key) => {
        const movie = movieData[key];
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

    const moviesWithBoxOffice = filterPropertyNonNumbers(movieDataArray, 'boxOffice');
    const moviesDataSorted = sortByPropertyAsc(moviesWithBoxOffice, 'boxOffice');
    const firstFive = getFirstX(moviesDataSorted, 5);

    // get genres for genre timeline chart
    const moviesOfGenrePerYear = getFirstX(this.getMoviesOfGenrePerYear(moviesWithBoxOffice), 10);
    const genresList = moviesOfGenrePerYear.map((genre) => genre.genre);

    const dateRange = d3.extent(movieDataArray, d => d.year);

    this.setState({
      ...this.state,
      dateRange,
      rawData: movieDataArray,
      allDataFiltered: movieDataArray,
      visData: firstFive,
      genreTimelineData: moviesOfGenrePerYear,
      genresList,
    });
  }

  componentDidUpdate(prevProps, prevState) {

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
      sortProperty,
    } = this.state;

    if (range) {
      const moviesInRange = getMoviesInRange(range, sortByPropertyAsc(rawData), 'year');
      const topRatedInRange = sortByPropertyAsc(moviesInRange, sortProperty);
      const firstFiveExtended = getFirstX(topRatedInRange, 5);

      this.setState({
        ...this.state,
        dateRange: range,
        allDataFiltered: topRatedInRange,
        visData: firstFiveExtended,
      });
    }
  }

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
    const { rawData, sortProperty } = this.state;

    if (genre === 'all') {
      const moviesWithBoxOffice = filterPropertyNonNumbers(rawData, 'boxOffice');
      const moviesDataExtendedSorted = sortByPropertyAsc(moviesWithBoxOffice, 'boxOffice');
      const firstExtendedFive = getFirstX(moviesDataExtendedSorted, 5);
      return this.setState({
        ...this.state,
        visData: firstExtendedFive,
      });
    }

    let moviesOfGenre = this.getMoviesOfGenre(genre, rawData);
    moviesOfGenre = sortByPropertyAsc(moviesOfGenre, sortProperty);

    this.setState({
      ...this.state,
      visData: getFirstX(moviesOfGenre, 5)
    });
  }

  filterMoviesByGenre2(data, genre) {
    if (genre === 'all') {
      return data;
    }

    return this.getMoviesOfGenre(genre, data);
  }

  setSortProperty = (sortProperty) => {
    const { allDataFiltered } = this.state;
    
    this.setState({
      ...this.state,
      sortProperty,
      visData: getFirstX(sortByPropertyAsc(allDataFiltered, sortProperty), 5),
    });
  }

  setSortProperty2 = (sortProperty) => {    
    this.setState({
      ...this.state,
      sortProperty,
    });
  }

  // include genre filter
  // include data range filter
  // include sort by filter
  // updateData = (updateFunc, numItems) => {
  //   const { rawData } = this.state;

  //   return () => this.setState({
  //     ...this.state,
  //     visData: updateFunc(rawData, numItems)
  //   });
  // }

  updateVisData = (data) => {
    const {
      sortProperty,
      genreFilter,
      dateRange,
      moviesPerChart,
    } = this.state;

    // sort, filter, filter
    const sortedData = sortByPropertyAsc(sortProperty, sortProperty);
    const moviesOfGenre = this.filterMoviesByGenre2(sortedData, genreFilter);
    const moviesInDateRange = getMoviesInRange(dateRange, moviesOfGenre, 'year');
    const visData = getFirstX(moviesInDateRange, moviesPerChart);

    return () => this.setState({
      ...this.state,
      visData,
    });
  }

  render() {
    const { 
      visData,
      genreTimelineData,
      defaultChartWidth,
      defaultChartHeight,
      genresList,
    } = this.state;

    return (
      <div className="App">
        <h1 className='section-title'>Exploring Movie Data</h1>
        <div className='visualizations-container'>
          <ExtendedBarChartHorizontal visData={visData} width={800} height={300} chartTitle={'US Domestic Box Office'} />
          <ExtendedScatterPlot visData={visData} width={defaultChartWidth} height={defaultChartHeight} chartTitle={'Box Office vs MetaScore'} />
          <RatingsBarChartHorizontal visData={visData} width={defaultChartWidth} height={defaultChartHeight} chartTitle={'Score on MetaCritic'} />
        </div>
        <div className='buttons-container'>
          <p>Sort By:</p>
          <button onClick={() => this.setSortProperty2('boxOffice')}>Box Office Revenue</button>
          <button onClick={() => this.setSortProperty2('metascore')}>MetaCritic Score</button>
        </div>
        <GenresFilter genres={genresList} onClick={(genre) => this.filterMoviesByGenre(genre)} />
        <GenresLineChart visData={genreTimelineData} genres={genresList} updateRange={this.updateDateRange} fixedBottom={true} />
      </div>
    );
  }
}

export default App;
