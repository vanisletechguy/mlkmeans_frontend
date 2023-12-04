import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import DataDisplay from './dataDisplay';
import ClusterData from './clusterData';
import ClusterDataDisplay from './clusterDataDisplay';
import VisualizationComponent from './visualization';

function App() {
  const [clusterResult, setClusterResult] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClusterResults = (results) => {
      setClusterResult(results);
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
                        <ClusterData onClusterResults={handleClusterResults} />
                    </div>
                </div>
                <div className="card">
                    <div className="card-header"><h2>Source Data</h2></div>
                    <div className="card-body">
                        <DataDisplay />
                    </div>
                </div>
            </div>

            {/* Visualization and ClusterDataDisplay */}
            <div className="col-md-8 p-3">

                <div className="border p-3" style={{ height: '50vh', overflowY: 'auto' }}>
                    <VisualizationComponent clusterData={clusterResult && clusterResult.data} onSelected={handleItemSelected} selectedItem={selectedItem} />
                </div>
                <div className="card">
                    <div className="card-header"><h2>Cluster Results</h2></div>
                    <div className="card-body">
                        <ClusterDataDisplay clusterResult={clusterResult} selectedItem={selectedItem} onItemSelected={handleItemSelected} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default App;
