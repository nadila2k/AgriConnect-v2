import React, { useState } from 'react';
import './Styles_addcrop.css';
import { BsCloudPlusFill } from "react-icons/bs";

const AddCrops = ({ onAdd }) => {
    const [cropName, setCropName] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (event) => {
        setCropName(event.target.value);
        if (error) {
            setError(''); 
        }
    };

    const validateInput = () => {
        if (cropName.trim() === '') {
            setError('Crop name cannot be empty');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = () => {
        if (validateInput()) {
            onAdd(cropName);
            setCropName('');
        }
    };

    return (
        <div className="add-crops-container">
            <div className="input-container">
                <input 
                    type="text" 
                    value={cropName} 
                    onChange={handleInputChange} 
                    placeholder="Enter crop name..."
                    className="crop-input"
                />
                <button onClick={handleSubmit} className="crop-submit-button">
                    <BsCloudPlusFill /> Add Crop</button>
            </div>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default AddCrops;
