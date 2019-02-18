import React from "react";
import './Tooltip.scss';

export default function Tooltip({title, gross, score, year, x, y, sortClass}) {
    const positionStyles = {
        top: y - 5,
        left: x + 10,
    }

    return (
        <div className='tooltip' style={positionStyles}>
            <div className={`tootip-title ${sortClass}`}>{title}</div>
            <div className='tooltip-content'>
                <div className='tooltip-item tootip-gross'>
                    <span className='tooltip-label'>Gross:</span> ${gross}
                </div>
                {year && 
                    <div className='tooltip-item'>
                        <span className='tooltip-label'>>Released:</span> {year}
                    </div>
                }
                {score && 
                    <div className='tooltip-item'>
                        <span className='tooltip-label'>MetaScore:</span> {score}
                    </div>
                }
            </div>
        </div>
    )
}