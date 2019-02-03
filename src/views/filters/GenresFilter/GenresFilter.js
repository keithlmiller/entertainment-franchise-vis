import React from "react";
import FilterButton from '../../../components/FilterButton/FilterButton';
import './GenresFilter.css';

export default function GenresFilter({genres, onClick}) {
    const genreButtons = genres.map((genre) => <FilterButton title={genre} onClick={() => onClick(genre)} />);

    return (
        <div className='genres-filter'>
            <FilterButton title='All' onClick={() => onClick('all')} />
            {genreButtons}
        </div>
    )
}

GenresFilter.defaultProps = {
    genres: [],
    onClick: () => {},
};