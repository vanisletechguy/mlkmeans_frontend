import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import DataDisplay from './dataDisplay';
import ClusterData from './clusterData';
import ClusterDataDisplay from './clusterDataDisplay';
import VisualizationComponent from './visualization';


function App() {

    const [clusterResult, setClusterResult] = useState(null);

    const handleClusterResults = (results) => {
        setClusterResult(results);
    };

    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemSelected = (selectedData) => {
        // Handle the selected item (update state or perform an action)
        setSelectedItem(selectedData);
    };

    return (

        <div className="container-fluid h-100" style={{ maxHeight: '100vh', overflow: 'hidden' }}>
            <div className="row h-100">
                {/* ClusterData and DataDisplay */}
                <div className="col-md-4 d-flex flex-column p-3" style={{ maxHeight: '100vh' }}>
                    <div className="border mb-3 p-3" style={{ height: '50vh', overflowY: 'auto' }}>
                        <h1>ML Clusters</h1>
                        <ClusterData onClusterResults={handleClusterResults} />
                    </div>
                    <div className="border p-3" style={{ height: 'calc(50vh - 1rem)', overflowY: 'auto' }}>
                        <h2>Data Display</h2>
                        <DataDisplay />
                    </div>
                </div>

                {/* Visualization and ClusterDataDisplay */}

                <div className="col-md-8 p-3">
                    <div className="border p-3" style={{ height: '50vh', overflowY: 'auto' }}>
                        <VisualizationComponent clusterData={clusterResult && clusterResult.data} onSelected={setSelectedItem} selectedItem={selectedItem}  />
                    </div>
                    <div className="border p-3" style={{ height: '50vh', overflowY: 'auto' }}>
                        <ClusterDataDisplay clusterResult={clusterResult} selectedItem={selectedItem} onItemSelected={setSelectedItem} />
                    </div>
                </div>
            </div>
        </div>

    );
}

export default App;
