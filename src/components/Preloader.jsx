import React from 'react';
import './Preloader.css';

const Preloader = () => {
    return (
        <div className="preloader">
            <div className="spinner">
                <div className="spinner-circle"></div>
                <div className="spinner-circle"></div>
                <div className="spinner-circle"></div>
            </div>
        </div>
    );
};

export default Preloader;