import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import DataDisplay from './dataDisplay';
import ClusterData from './clusterData';
import ClusterDataDisplay from './clusterDataDisplay';
import VisualizationComponent from './visualization';
import axios from 'axios';

function App() {

    const [data, setData] = useState([]);

    const [clusterResult, setClusterResult] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/data')
            .then(response => {
        setData(response.data);
        })
        .catch(error => {
        console.error('Error fetching data:', error);
        });
    }, []);

    const handleDataChange = (newData) => {
        setData(newData);
    };

    const handleClusterResults = (results) => {
        setClusterResult(results);
        console.log('Culster Results:', results);
    };

    const handleItemSelected = (selectedData) => {
        setSelectedItem(selectedData);
    };

  return (
    <div className="container-fluid h-100">
        <div className="row h-100">
            {/* ClusterData and DataDisplay */}
            <div className="col-md-4 d-flex flex-column p-3">
                <div className="card mb-3">
                    <div className="card-header"><h1>ML Cluster Analysis</h1></div>
                    <div className="card-body">
                        <ClusterData data={data} onClusterResults={handleClusterResults} onDataChange={handleDataChange} />
                    </div>
                </div>
                <div className="card">
                    <div className="card-header"><h2>Source Data</h2></div>
                    <div className="card-body">
                        <DataDisplay data={data} />
                    </div>
                </div>
            </div>

            {/* Visualization and ClusterDataDisplay */}
            <div className="col-md-8 p-3">
                <div className="border p-3" style={{ height: '50vh', overflowY: 'auto' }}>
                    <VisualizationComponent 
                        clusterData={clusterResult && clusterResult.data} 
                        onSelected={handleItemSelected} 
                        selectedItem={selectedItem} />
                </div>
                <div className="card">
                    <div className="card-header"><h2>Cluster Results</h2></div>
                    <div className="card-body">
                        <ClusterDataDisplay 
                            clusterResult={clusterResult} 
                            selectedItem={selectedItem} 
                            onItemSelected={handleItemSelected} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default App;
