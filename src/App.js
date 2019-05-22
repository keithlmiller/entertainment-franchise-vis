import React, { Component } from 'react';
import * as d3 from 'd3';
import movieData from './data/movies_details.json';

// import chart components
import BarChartHorizontal from './views/visualizations/BarChartHorizontal';
import RatingsBarChartHorizontal from './views/visualizations/RatingsBarChartHorizontal';
import ScatterPlot from './views/visualizations/ScatterPlot';
import RevenueLineChart from './views/visualizations/RevenueLineChart';

// import other app section components
import DataOptions from './views/DataOptions/DataOptions';
import ActiveFilters from './views/filters/ActiveFilters/ActiveFilters';
import SelectedMovie from './views/SelectedMovie/SelectedMovie';

// import utils
import {
  groupBy,
  getFirstX, 
  getMoviesInRange, 
  sortByPropertyAsc, 
  filterPropertyNonNumbers,
  fillRange,
} from './utils/data-utils';
import {
  truncate,
} from './utils/format-utils';
import './App.scss';
// import 'normalize.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        rawData: [], // original data, only modified on first read 
        visData: [],
        fullVisData: [],
        timelineData: [],
        genreTimelineData: [],
        revenueTimelineData: [],
        defaultChartWidth: 400,
        defaultChartHeight: 200,
        genresList: [],
        sortProperty: 'boxOffice',
        genreFilter: 'all',
        dateRange: [],
        moviesPerChart: 7,
        hoveredMovie: '',
        selectedMovie: '',
    };
  }

  componentWillMount() {
    const movieDataArray =
      Object.keys(movieData).map((key) => {
        const movie = movieData[key];
        const date = new Date(movie.Released);
        const boxOffice = parseInt(movie.BoxOffice.replace(/[\$\,]/g, ""));

        return {
          title: truncate(movie.Title, 27),
          fullTitle: movie.Title,
          date,
          boxOffice: boxOffice,
          genre: movie.Genre.split(", "),
          year: +movie.Year,
          metascore: +movie.Metascore,
          rated: movie.Rated,
          ratings: movie.Ratings,
          poster: movie.Poster,
          plot: movie.Plot,
          director: movie.Director,
          runtime: movie.Runtime
        }
      });

    const moviesWithBoxOffice = filterPropertyNonNumbers(movieDataArray, 'boxOffice');

    // get genres for genre timeline chart
    const moviesOfGenrePerYear = getFirstX(this.getMoviesOfGenrePerYear(moviesWithBoxOffice), 10);
    const genresList = moviesOfGenrePerYear.map((genre) => genre.genre).sort();

    const dateRange = d3.extent(moviesWithBoxOffice, d => d.year);
    const allYears = fillRange(dateRange);

    const revenueRanges = [[100, 300], [300, 500], [500, 1000]]
    const timelineData = revenueRanges.map(range => {
      return { rangeName: `${range[0]}M-${range[1]}M`, data: this.getMoviesOfRevenuePerYear(moviesWithBoxOffice, range, allYears) };
    });

    const revenueTimelineData = this.getTotalRevenuePerYear(moviesWithBoxOffice);
    const { visData, fullVisData } = this.getNewVisData(moviesWithBoxOffice);

    this.setState({
      ...this.state,
      dateRange,
      rawData: moviesWithBoxOffice,
      visData,
      fullVisData,
      timelineData,
      revenueTimelineData,
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

  getMoviesPerYear = (data, { allYears } = {}) => {
    const groupedData = groupBy(data, 'year');

    let moviesPerYear = Object.entries(groupedData)
      .map(year => ({year: year[0], numMovies: year[1].length}));
    if (allYears) {
      moviesPerYear = allYears.map(year => {
        const yearHasMovie = moviesPerYear.find(movieYear => movieYear.year == year)
        return yearHasMovie ? yearHasMovie : {year, numMovies: 0}

      })
    }
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

  getMoviesOfRevenuePerYear(movies, revenueRangeInMillions, allYears) {
    const [min, max] = revenueRangeInMillions;
    const moviesOfRevenue = movies.filter(movie => (movie.boxOffice >= min*1000000 && movie.boxOffice <= max*1000000));

    return this.getMoviesPerYear(moviesOfRevenue, { allYears });
  }

  getTotalRevenuePerYear(movies) {
    const groupedData = groupBy(movies, 'year');

    return Object.entries(groupedData)
      .map(year => {
        const totalRevenue = year[1].reduce((a, v) => (a + v.boxOffice), 0);
        const avgRevenue = year[1].length ? totalRevenue / year[1].length : 0;

        return ({
          year: year[0],
          totalRevenue,
          avgRevenue,
        })
      });
  }

  filterMoviesByGenre(data, genre) {
    if (genre === 'all') {
      return data;
    }

    return this.getMoviesOfGenre(genre, data);
  }

  updateSelectedMovie = (movie) => {
    if (movie) {
      return this.setState({
        ...this.state,
        selectedMovie: movie,
      });
    }

    this.setState({
      ...this.state,
      selectedMovie: '',
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
        selectedMovie: '',
        dateRange: range,
      });
    }
  }

  updateGenreFilter = (genre) => {
    this.setState({
      ...this.state,
      selectedMovie: '',
      genreFilter: genre,
    });
  }

  updateSortProperty = (sortProperty) => {
    this.setState({
      ...this.state,
      selectedMovie: '',
      sortProperty,
    });
  }

  updateVisData = (data) => {
    const { visData, fullVisData } = this.getNewVisData(data);
    this.setState({
      ...this.state,
      visData,
      fullVisData,
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
    const fullVisData = moviesInDateRange;

    return { visData, fullVisData };
  }

  render() {
    const { 
      visData,
      timelineData,
      revenueTimelineData,
      defaultChartWidth,
      defaultChartHeight,
      genresList,
      hoveredMovie,
      sortProperty,
      genreFilter,
      selectedMovie,
      dateRange,
      rawData,
    } = this.state;

    let selectedMovieDetails = {};
    if (selectedMovie.length) {
      // would use selector if I decide to add Redux
      selectedMovieDetails = rawData.find(movie => (movie.title === selectedMovie));
    }

    return (
      <div className="App">
        <div className='page-header'>
          <div className={`page-intro ${sortProperty}`}>
            <h1 className='article-title'>Box Office Revenue vs MetaScore</h1>
            <h3 className='article-subtitle'>Explore the domestic (US) revenue and Metascores of top blockbusters in the past two decades</h3>
            <p className='article-description'>
              This dataset includes the top 10 grossing movies from each year between 1999 and 2017
              The data was originally pulled from IMDB. I found it through a <a href='https://frontendmasters.com/courses/d3-js-custom-charts/' target='_blank'>Front End Masters Course</a>.
            </p>
            <p className='article-description'>I made this visualization for learning and experimentation, hopefully you find it fun!</p>
          </div>
        </div>
        <div className='page-options'>
          <DataOptions
            genresList={genresList}
            genreFilter={genreFilter}
            sortProperty={sortProperty}
            updateGenre={this.updateGenreFilter}
            updateSortProperty={this.updateSortProperty}
          />
          <ActiveFilters
            genreFilter={genreFilter}
            dateRange={dateRange}
            sortProperty={sortProperty}
          />
        </div>
        {!!visData.length ?
          <div className='content-container'>
            <div className='primary-visualizations'>
              <BarChartHorizontal
                visData={visData} 
                width={800} height={300} 
                hoveredMovie={hoveredMovie}
                selectedMovie={selectedMovie}
                sortClass={sortProperty}
                onDataHover={this.updateHoveredMovie}
                onDataClick={this.updateSelectedMovie}
              />
              <RatingsBarChartHorizontal
                visData={visData}
                width={defaultChartWidth} height={defaultChartHeight}
                hoveredMovie={hoveredMovie}
                selectedMovie={selectedMovie}
                sortClass={sortProperty}
                chartTitle={'Score on MetaCritic'}
                onDataHover={this.updateHoveredMovie}
                onDataClick={this.updateSelectedMovie}
              />
              <ScatterPlot
                visData={visData} 
                width={defaultChartWidth} height={defaultChartHeight} 
                hoveredMovie={hoveredMovie} 
                selectedMovie={selectedMovie}
                sortClass={sortProperty}
                chartTitle={'Box Office vs MetaScore'}
                onDataHover={this.updateHoveredMovie}
                onDataClick={this.updateSelectedMovie}
              />

              <SelectedMovie
                selectedMovie={selectedMovie}
                selectedMovieDetails={selectedMovieDetails}
                sortProperty={sortProperty}
              />
            </div>

            <RevenueLineChart
              visData={revenueTimelineData}
              updateRange={this.updateDateRange}
              fixedBottom={true}
            />
          </div>
          : <div>Visualization Loading</div>
        }
      </div>
    );
  }
}

export default App;
