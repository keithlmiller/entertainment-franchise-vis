import React from "react";
import SortButton from '../../components/SortButton/SortButton';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import GenresFilter from '../filters/GenresFilter/GenresFilter';
import './DataOptions.scss';

export default function DataOptions({ genresList, genreFilter, sortProperty, updateGenre, updateSortProperty }) {

    return (
        <div className='display-options'>
            <div className='sort-filter'>
                <div className='sort-options'>
                    <SectionTitle title='Sort By:' />
                    <div className='buttons-container'>
                    <SortButton title='Box Office' icon='dollar-sign' sortClass='boxOffice' onClick={() => updateSortProperty('boxOffice')} active={sortProperty === 'boxOffice'} />
                    <SortButton title='MetaCritic' icon='star-half-alt' sortClass='metascore' onClick={() => updateSortProperty('metascore')} active={sortProperty === 'metascore'} />
                    </div>
                </div>
                <GenresFilter genres={genresList} activeGenre={genreFilter} sortClass={sortProperty} onClick={(genre) => updateGenre(genre)} />
            </div>
        </div>
    );
}

DataOptions.defaultProps = {
    selectedMovieDetails: {},
    selectedMovie: '',
};