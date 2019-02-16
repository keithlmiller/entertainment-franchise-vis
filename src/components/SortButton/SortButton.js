import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './SortButton.scss';


export default function SortButton({title, onClick, icon}) {
    return (
        <button className={`sort-button ${title}`} onClick={onClick} alt={title}>
            <div className='btn-icon'><FontAwesomeIcon icon={icon} /></div>
            <span className='btn-title'>{title}</span>
        </button>
    )
}