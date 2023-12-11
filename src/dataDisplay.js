//dataDisplay.js
import React, { } from 'react';

function DataDisplay( {data}) {

    if (!data) {
        return <p>Loading data...</p>; // or any other placeholder content
    }

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
