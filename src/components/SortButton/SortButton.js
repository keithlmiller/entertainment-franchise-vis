import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './SortButton.scss';


export default function SortButton({title, onClick, icon, sortClass, active}) {
    return (
        <button className={`sort-button ${sortClass} ${active ? 'active' : ''}`} onClick={onClick} alt={title}>
            <div className={'btn-icon'}><FontAwesomeIcon icon={icon} /></div>
            <span className={'btn-title'}>{title}</span>
        </button>
    )
}