import React from "react";
import './SectionTitle.scss';

export default function SectionTitle({title, subtitle}) {
    return (
        <div>
            <h5 className='section-title'>{title}</h5>
            {subtitle && <span className='section-subtitle'>{subtitle}</span>}
        </div>
    )
}