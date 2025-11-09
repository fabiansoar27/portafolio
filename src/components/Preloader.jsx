import React from 'react';
import './Preloader.css';

const Preloader = ({ className }) => {
    return (
        <div className={`preloader ${className}`}>
            <div className="spinner">
                <div className="spinner-circle"></div>
                <div className="spinner-circle"></div>
                <div className="spinner-circle"></div>
            </div>
        </div>
    );
};

export default Preloader;