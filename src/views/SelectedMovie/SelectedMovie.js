import React from "react";
import * as d3 from 'd3';
import {
    commadList,
} from '../../utils/format-utils';
import './SelectedMovie.scss';

export default function SelectedMovie({ selectedMovie, selectedMovieDetails, sortProperty }) {

    return (
        <div className='selected-movie-section'>
            <div className={`fixed-section-title ${sortProperty}`}>
                <span>Selected Movie:</span>
            </div>

            {!!selectedMovie.length ?
                <div className='selected-movie-details'>
                    <div className='movie-details-header'>
                        <img src={selectedMovieDetails.poster} className='movie-poster' alt='poster' />
                        <div className='general-details'>
                            <h3 className='selected-movie-title'>{selectedMovieDetails.title}</h3>
                            <ul className='movie-details-list'>
                                <li><label>Director:</label> {selectedMovieDetails.director}</li>
                                <li><label>Rated:</label> {selectedMovieDetails.rated}</li>
                                <li><label>Runtime:</label> {selectedMovieDetails.runtime}</li>
                            </ul>
                        </div>
                    </div>

                <ul className='movie-details-list'>
                    {/* <li>{new Date(selectedMovieDetails.date)}</li> */}
                    <li><label>Box Office:</label> ${d3.format(',')(selectedMovieDetails.boxOffice)}</li>
                    <li><label>Metascore:</label> {selectedMovieDetails.metascore}</li>
                    <li><label>Genres:</label> {commadList(selectedMovieDetails.genre)}</li>
                    {/* <li>{selectedMovieDetails.ratings}</li> */}
                </ul>

                <div className='selected-movie-synopsis'>
                    <p>
                        {selectedMovieDetails.plot}
                    </p>
                </div>
                </div> : <p className='empty-message'>Click a movie to see details here</p>
            }
            </div>
    );
}

SelectedMovie.defaultProps = {
    selectedMovieDetails: {},
    selectedMovie: '',
};