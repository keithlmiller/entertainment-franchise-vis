import React from "react";
import FilterButton from '../../../components/FilterButton/FilterButton';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import './GenresFilter.scss';

export default function GenresFilter({genres, onClick, activeGenre, sortClass, isDropDown = true}) {
    const genreButtons = genres.map((genre) => <FilterButton title={genre} active={activeGenre === genre} sortClass={sortClass} onClick={() => onClick(genre)} />);
    const genreDropdownOptions = genres.map((genre) => <option value={genre} onClick={() => onClick(genre)}>{genre}</option>);

    return (
        <div className='genres-filter'>
            <SectionTitle title='Filter by Genre' />
            {isDropDown ?
            (
                <div className='genres-filter-list'>
                    <select>
                        <option value='all' onClick={() => onClick('all')}>All</option>
                        {genreDropdownOptions}
                    </select>
                </div>
            ) : (
                    <div className='genres-filter-list'>
                        <FilterButton title='All' active={activeGenre === 'all'} sortClass={sortClass}  onClick={() => onClick('all')} />
                        {genreButtons}
                    </div>
                )
            }

        </div>
    )
}

GenresFilter.defaultProps = {
    genres: [],
    onClick: () => {},
};