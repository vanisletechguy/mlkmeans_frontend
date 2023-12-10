
// ClusterData.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

function ClusterData({ data, onClusterResults, onDataChange }) {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        //   setData(data);
    }, [data]);


    const handleFileUpload = event => {
        const file = event.target.files[0];
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true, // Skip empty lines

            complete: function(results) {
                const uploadedData = results.data
                    .filter(row => row.A !== undefined && row.B !== undefined && row.C !== undefined) // Filter out invalid rows
                    .map(row => ({
                        x: parseFloat(row.A), 
                        y: parseFloat(row.B), 
                        z: parseFloat(row.C)
                    }));
                onDataChange(uploadedData);
            }
        });
    };

    const handleClusterData = () => {
        console.log('Data inside ClusterData component:', data);

        if (data.length === 0) {
            alert("No data available for clustering");
            return;
        }
        setIsLoading(true);

        console.log('Sending data to cluster:', data);

        axios.post('http://localhost:3001/cluster-data', data)
        .then(response => {
            console.log('Cluster response:', response.data);
            onClusterResults(response.data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error in clustering data:', error);
            setIsLoading(false);
        });
    };

    return (
        <div>
            <input type="file" onChange={handleFileUpload} accept=".csv" />
            <button onClick={handleClusterData} disabled={isLoading}>
            {isLoading ? 'Clustering...' : 'Cluster Data'}
            </button>
        </div>
    );
}
export default ClusterData;

