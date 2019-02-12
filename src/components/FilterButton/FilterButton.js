import React from "react";
import './FilterButton.scss';

export default function FilterButton({title, onClick}) {
    return (
        <button className={`filter-button ${title}`} onClick={onClick} alt={title}>{title}</button>
    )
}