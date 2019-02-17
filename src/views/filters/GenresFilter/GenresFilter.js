import React from "react";
import FilterButton from '../../../components/FilterButton/FilterButton';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import './GenresFilter.scss';

export default function GenresFilter({genres, onClick, activeGenre}) {
    const genreButtons = genres.map((genre) => <FilterButton title={genre} active={activeGenre === genre} onClick={() => onClick(genre)} />);

    return (
        <div className='genres-filter'>
            <SectionTitle title='Filter by Genre' />
            <div className='genres-filter-list'>
                <FilterButton title='All' active={activeGenre === 'all'} onClick={() => onClick('all')} />
                {genreButtons}
            </div>
        </div>
    )
}

GenresFilter.defaultProps = {
    genres: [],
    onClick: () => {},
};