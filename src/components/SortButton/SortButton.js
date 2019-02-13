import React from "react";
import './SortButton.scss';

export default function SortButton({title, onClick}) {
    return (
        <button className={`sort-button ${title}`} onClick={onClick} alt={title}>{title}</button>
    )
}