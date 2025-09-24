import React from 'react';
import './Styles_popup.css'; 

const Popup = ({ message, onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-button" onClick={onClose}>X</button>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default Popup;
