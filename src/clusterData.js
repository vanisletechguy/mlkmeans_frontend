import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ClusterData( {onClusterResults} ) {
    const [originalData, setOriginalData] = useState([]);
    const [clusterResult, setClusterResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch the original data
        axios.get('http://localhost:3001/OLDdata')
            .then(response => {
                setOriginalData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleClusterData = () => {
        if (originalData.length === 0) {
            alert("No data available for clustering");
            return;
        }

        console.log("Data sent to backend for clustering:", originalData);

        setIsLoading(true);
        axios.post('http://localhost:3001/cluster-data', originalData)
            .then(response => {
                console.log("Cluster result received:", response.data);
                setClusterResult(response.data);
                onClusterResults(response.data);
                //          props.onClusterResults(response.data); // Lift state up to parent
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error in clustering data:', error);
                setIsLoading(false);
            });
    };

    return (
        <div>
            <button onClick={handleClusterData} disabled={isLoading}>
                {isLoading ? 'Clustering...' : 'Cluster Data'}
            </button>

            {clusterResult && (
                <div>
                    <h3>Cluster Result</h3>
                    <p>Iterations: {clusterResult.iterations}</p>
                    <p>Centroids:</p>
                    {isLoading && <p>Loading...</p>}
                    {!isLoading && clusterResult &&
                        <ul>
                            {clusterResult.centroids.map((centroid, index) => (
                                <li key={index}>
                                    X: {centroid.x ? centroid.x.toFixed(2) : "N/A"}, 
                                    Y: {centroid.y ? centroid.y.toFixed(2) : "N/A"}, 
                                    Z: {centroid.z ? centroid.z.toFixed(2) : "N/A"}
                                </li>
                            ))}
                        </ul>
                    }
                </div>
            )}
        </div>
    );
}

export default ClusterData;
