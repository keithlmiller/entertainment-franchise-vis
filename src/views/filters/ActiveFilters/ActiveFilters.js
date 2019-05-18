import React from "react";
import './ActiveFilters.scss';

export default function ActiveFilters({ genreFilter, dateRange, sortProperty }) {
    return (
        <div className='active-filters'>
            <div className='active-date-range'>Showing blockbusters between <span className={`active-filter ${sortProperty}`}>{dateRange[0]}</span> and <span className={`active-filter ${sortProperty}`}>{dateRange[1]}</span></div>
            <div className='active-genre'>of genre <span className={`active-filter ${sortProperty}`}>{genreFilter}</span></div>
            <div className='active-genre'>sorted by <span className={`active-filter ${sortProperty}`}>{sortProperty === 'boxOffice' ? 'Revenue' : 'MetaScore'}</span></div>
        </div>
    )
}

ActiveFilters.defaultProps = {
    dateRange: [],
};