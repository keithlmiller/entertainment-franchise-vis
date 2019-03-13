import React from "react";
import SortButton from '../../components/SortButton/SortButton';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import GenresFilter from '../filters/GenresFilter/GenresFilter';
import './DataOptions.scss';

export default function DataOptions({ genresList, genreFilter, dateRange, sortProperty, updateGenre, updateSortProperty }) {

    return (
        <div className='display-options'>
            <div className='sort-options'>
                <SectionTitle title='Sort By:' />
                <div className='buttons-container'>
                <SortButton title='Box Office' icon='dollar-sign' sortClass='boxOffice' onClick={() => updateSortProperty('boxOffice')} active={sortProperty === 'boxOffice'} />
                <SortButton title='MetaCritic' icon='star-half-alt' sortClass='metascore' onClick={() => updateSortProperty('metascore')} active={sortProperty === 'metascore'} />
                </div>
            </div>

            <GenresFilter genres={genresList} activeGenre={genreFilter} sortClass={sortProperty} onClick={(genre) => updateGenre(genre)} />

            <div className='active-filters'>
                <div className='active-date-range'>Showing blockbusters between <span className={`active-filter ${sortProperty}`}>{dateRange[0]}</span> and <span className={`active-filter ${sortProperty}`}>{dateRange[1]}</span></div>
                <div className='active-genre'>of genre <span className={`active-filter ${sortProperty}`}>{genreFilter}</span></div>
                <div className='active-genre'>sorted by <span className={`active-filter ${sortProperty}`}>{sortProperty === 'boxOffice' ? 'Revenue' : 'MetaScore'}</span></div>
            </div>
        </div>
    );
}

DataOptions.defaultProps = {
    selectedMovieDetails: {},
    selectedMovie: '',
};