import React from 'react';
import { v4 as uuidv4 } from 'uuid';

function ClusteredDataDisplay({ clusterResult, selectedItem, onItemSelected, dataReloadIdentifier }) {

    if (!clusterResult || !clusterResult.data) {
        return <p>No clustering data available.</p>;
    }

    const uniqueClusterIds = [...new Set(clusterResult.data.map(item => item.clusterId))];

    const isItemSelected = (item) => {
        return selectedItem && item.x === selectedItem.x && item.y === selectedItem.y && item.z === selectedItem.z;
    };

    const handleRowClick = (itemData) => {
        onItemSelected(itemData); 
    };

    const renderTable = (data, clusterId) => (
        <div style={{ flex: 1, margin: '0 10px' }}>
            <h3>Cluster {clusterId}</h3>
            <table>
                <thead>
                    <tr>
                        <th>X</th>
                        <th>Y</th>
                        <th>Z</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((item) => {
                        const key = uuidv4();
                        return (
                            <tr key={key}
                                onClick={() => handleRowClick(item)}
                                className={isItemSelected(item) ? 'selectedRow' : ''}>
                                <td>{item.x}</td>
                                <td>{item.y}</td>
                                <td>{item.z}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

    if (!clusterResult || !clusterResult.data) {
        return <p>No clustering data available.</p>;
    }

    return (
        <div className="d-flex justify-content-around" style={{ gap: '20px' }}>

            {uniqueClusterIds.map(clusterId => {
                const clusterData = clusterResult.data.filter(item => item.clusterId === clusterId);
                return renderTable(clusterData, clusterId);
            })}
        </div>
    );
}

export default React.memo(ClusteredDataDisplay);
