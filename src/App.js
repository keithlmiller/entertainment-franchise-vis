import React, { Component } from 'react';
import * as d3 from 'd3';
import movieData from './data/movies_details.json';
import ExtendedBarChartHorizontal from './views/visualizations/DetailsDataSet/BarChartHorizontal';
import RatingsBarChartHorizontal from './views/visualizations/DetailsDataSet/RatingsBarChartHorizontal';
import GenresLineChart from './views/visualizations/DetailsDataSet/GenresLineChart';
import ExtendedScatterPlot from './views/visualizations/DetailsDataSet/ScatterPlot';
import GenresFilter from './views/filters/GenresFilter/GenresFilter';
import SortButton from './components/SortButton/SortButton';
import { 
  groupBy, 
  getFirstX, 
  getMoviesInRange, 
  sortByPropertyAsc, 
  filterPropertyNonNumbers 
} from './utils/data-utils';
import './App.scss';
// import 'normalize.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        rawData: [], // original data, only modified on first read 
        visData: [],
        timelineData: [],
        genreTimelineData: [],
        defaultChartWidth: 400,
        defaultChartHeight: 200,
        genresList: [],
        sortProperty: 'boxOffice',
        genreFilter: 'all',
        dateRange: [],
        moviesPerChart: 5,
        hoveredMovie: '',
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

    // get genres for genre timeline chart
    const moviesOfGenrePerYear = getFirstX(this.getMoviesOfGenrePerYear(moviesWithBoxOffice), 10);
    const genresList = moviesOfGenrePerYear.map((genre) => genre.genre);

    const dateRange = d3.extent(movieDataArray, d => d.year);

    this.setState({
      ...this.state,
      dateRange,
      rawData: moviesWithBoxOffice,
      visData: this.getNewVisData(moviesWithBoxOffice),
      genreTimelineData: moviesOfGenrePerYear,
      genresList,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      sortProperty: prevSortProperty,
      genreFilter: prevGenreFilter,
      dateRange: prevDateRange,
      rawData: prevRawData,
    } = prevState;

    const {
      sortProperty,
      genreFilter,
      dateRange,
      rawData,
    } = this.state;

    if (prevRawData !== rawData || prevSortProperty !== sortProperty || prevGenreFilter !== genreFilter || prevDateRange !== dateRange) {
      this.updateVisData(rawData);
    }
    
  }

  getMoviesPerYear = (data) => {
    const groupedData = groupBy(data, 'year');
    const moviesPerYear = Object.entries(groupedData)
      .map(year => ({year: year[0], numMovies: year[1].length}));
    return moviesPerYear;
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

  filterMoviesByGenre(data, genre) {
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

  updateHoveredMovie = (movie) => {
    if (movie) {
      return this.setState({
        ...this.state,
        hoveredMovie: movie,
      });
    }

    this.setState({
      ...this.state,
      hoveredMovie: '',
    });
  }

  updateDateRange = (range) => {
    if (range) {
      this.setState({
        ...this.state,
        dateRange: range,
      });
    }
  }

  updateGenreFilter(genre) {
    this.setState({
      ...this.state,
      genreFilter: genre,
    });
  }

  updateSortProperty = (sortProperty) => {    
    this.setState({
      ...this.state,
      sortProperty,
    });
  }

  updateVisData = (data) => {
    this.setState({
      ...this.state,
      visData: this.getNewVisData(data),
    });
  }

  getNewVisData = (data) => {
    const {
      sortProperty,
      genreFilter,
      dateRange,
      moviesPerChart,
    } = this.state;

    // sort by sort property, 
    // filter by filter genre, 
    // filter by date range
    const sortedData = sortByPropertyAsc(data, sortProperty);
    const moviesOfGenre = this.filterMoviesByGenre(sortedData, genreFilter);
    const moviesInDateRange = getMoviesInRange(dateRange, moviesOfGenre, 'year');
    const visData = getFirstX(moviesInDateRange, moviesPerChart);

    return visData;
  }

  render() {
    const { 
      visData,
      genreTimelineData,
      defaultChartWidth,
      defaultChartHeight,
      genresList,
      hoveredMovie,
    } = this.state;


    return (
      <div className="App">
        <h1 className='section-title'>Exploring Movie Data</h1>
        {!!visData.length ?
          <div className='content-container'>
            <div className='primary-visualizations'>
              <ExtendedBarChartHorizontal visData={visData} width={800} height={300} hoveredMovie={hoveredMovie} chartTitle={'US Domestic Box Office'} onDataHover={this.updateHoveredMovie} />
              <ExtendedScatterPlot visData={visData} width={defaultChartWidth} height={defaultChartHeight} hoveredMovie={hoveredMovie} chartTitle={'Box Office vs MetaScore'} onDataHover={this.updateHoveredMovie} />
              <RatingsBarChartHorizontal visData={visData} width={defaultChartWidth} height={defaultChartHeight} hoveredMovie={hoveredMovie} chartTitle={'Score on MetaCritic'} onDataHover={this.updateHoveredMovie} />
            </div>
            <div className='sort-options'>
              <p>Sort By:</p>
              <div className='buttons-container'>
                <SortButton title='Box Office Revenue' icon='dollar-sign' onClick={() => this.updateSortProperty('boxOffice')} />
                <SortButton title='MetaCritic Score' icon='star-half-alt' onClick={() => this.updateSortProperty('metascore')} />
              </div>
            </div>
            <GenresFilter genres={genresList} onClick={(genre) => this.updateGenreFilter(genre)} />
            <GenresLineChart visData={genreTimelineData} genres={genresList} updateRange={this.updateDateRange} fixedBottom={true} />
          </div>
          : <div>Visualization Loading</div>
        }
      </div>
    );
  }
}

export default App;
