import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DataDisplay() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/data')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, []);

    return (
        <div>
            <h2>Data from CSV</h2>
            <table>
                <thead>
                    <tr>
                        <th>X</th>
                        <th>Y</th>
                        <th>Z</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.x}</td>
                            <td>{item.y}</td>
                            <td>{item.z}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
    );
}

export default DataDisplay;

