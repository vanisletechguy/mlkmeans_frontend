// ClusterData.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

function ClusterData({ data, onClusterResults, onDataChange}) {
    const [isLoading, setIsLoading] = useState(false);
    const [numClusters, setNumClusters] = useState(2); 
    const [autoDetectClusters, setAutoDetectClusters] = useState(false);

    const handleSliderChange = (event) => {
        console.log('slider changed, new value is:', Number(event.target.value));
        setNumClusters(Number(event.target.value)); 
    };

    const handleFileUpload = event => {
        const file = event.target.files[0];
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true, 

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

        const postData = {
            data: data
        };

        if (!autoDetectClusters) {
            postData.K = numClusters;
        }

        axios.post('http://localhost:3001/cluster-data', postData)
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
            <p>Select Find Cluster OR upload a new csv data file</p>
            <p>
                <input
                    type="checkbox"
                    checked={autoDetectClusters}
                    onChange={() => setAutoDetectClusters(!autoDetectClusters)}
                />
                Let backend decide the number of clusters
            </p>


            <p>Select number of clusters:</p>
                <input
                    type="range"
                    min="2"
                    max="5"
                    value={numClusters}
                    onChange={handleSliderChange}
                />
            <p>Number of clusters (K): {numClusters}</p>


            <button onClick={handleClusterData} disabled={isLoading}>
            {isLoading ? 'Clustering...' : 'Find Clusters in Data'}
            </button>{'   '}
            <input type="file" onChange={handleFileUpload} accept=".csv" />
        </div>
    );
}
export default ClusterData;
