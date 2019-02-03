import React from "react";
import './Tooltip.css';

export default function Tooltip({title, gross, x, y}) {
    const positionStyles = {
        top: y + 3,
        left: x + 3,
    }

    return (
        <div className='tooltip' style={positionStyles}>
            <div className='tootip-title'>{title}</div>
            <div>Gross: ${gross}</div>
        </div>
    )
}