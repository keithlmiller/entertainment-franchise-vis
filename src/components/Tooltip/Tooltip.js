import React from "react";
import './Tooltip.scss';

export default function Tooltip({title, gross, year, x, y}) {
    const positionStyles = {
        top: y - 5,
        left: x + 10,
    }

    return (
        <div className='tooltip' style={positionStyles}>
            <div className='tootip-title'>{title}</div>
            <div>Gross: ${gross}</div>
            <div>Released: {year}</div>
        </div>
    )
}