import React from "react";
import './ChartTitle.scss';

export default function ChartTitle({title, subtitle}) {
    return (
        <div>
            <h5 className='chart-title'>{title}</h5>
            {subtitle && <span className='chart-subtitle'>{subtitle}</span>}
        </div>
    )
}