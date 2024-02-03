import React from 'react';
import '../styles/app.css'

const Filters = ({ selectedOption, handleOptionChange, options, defaultLabel }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '5px 0', padding: '10px' }}>
            <select
                value={selectedOption}
                onChange={handleOptionChange}
                className = "filters"
                >
                <option value=''>{defaultLabel}</option>
                {options.map((option, index) => <option key={index} value={option}>{option}</option>)}
            </select>
        </div>
    );
};

export default Filters;
