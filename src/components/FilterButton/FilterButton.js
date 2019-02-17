import React from "react";
import './FilterButton.scss';

export default function FilterButton({title, onClick, active}) {
    return (
        <button className={`filter-button ${title} ${active ? 'active' : ''}`} onClick={onClick} alt={title}>{title}</button>
    )
}