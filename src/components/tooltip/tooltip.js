import React from "react";
import './tooltip.css';

export default function Tooltip({title, gross}) {
    return (
        <div className='tooltip'>
            <h6 className='tootip-title'>{title}</h6>
            <p>Gross: {gross}</p>
        </div>
    )
}