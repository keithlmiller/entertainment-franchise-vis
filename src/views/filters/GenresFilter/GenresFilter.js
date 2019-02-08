import React from "react";
import FilterButton from '../../../components/FilterButton/FilterButton';
import ChartTitle from '../../../components/ChartTitle/ChartTitle';
import './GenresFilter.css';

export default function GenresFilter({genres, onClick}) {
    const genreButtons = genres.map((genre) => <FilterButton title={genre} onClick={() => onClick(genre)} />);

    return (
        <div className='genres-filter'>
            <ChartTitle title='Filter by Genre' />
            <div className='genres-filter-list'>
                <FilterButton title='All' onClick={() => onClick('all')} />
                {genreButtons}
            </div>
        </div>
    )
}

GenresFilter.defaultProps = {
    genres: [],
    onClick: () => {},
};