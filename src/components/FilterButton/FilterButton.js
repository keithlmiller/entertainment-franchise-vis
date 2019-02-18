import React from "react";
import './FilterButton.scss';

export default function FilterButton({title, onClick, active, sortClass}) {
    return (
        <button className={`filter-button ${title} ${active ? 'active' : ''} ${sortClass}`} onClick={onClick} alt={title}>{title}</button>
    )
}