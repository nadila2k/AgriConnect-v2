import React from 'react';
import './Styles_table.css';
import { FaEdit } from 'react-icons/fa';

const Table = ({ columns, data, onUpdate }) => {
    return (
        <table>
            <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th key={index}>{column}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        <td>{row.id}</td>
                        <td>{row.name}</td>
                        <td>
                            <button 
                                className="crop-button update-crop-button"
                                onClick={() => onUpdate(row)} // Pass the row data to the onUpdate function
                            >
                                <FaEdit className="button-icon" /> Update
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;

