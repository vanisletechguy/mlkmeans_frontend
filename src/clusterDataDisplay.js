import React, {useState, useEffect} from 'react';

function ClusteredDataDisplay({ clusterResult, selectedItem, onItemSelected }) {

    const [forceUpdate, setForceUpdate] = useState(0);

    const triggerForceUpdate = () => {
        setForceUpdate(prev => prev + 1);
    };

    useEffect(() => {
        console.log("Selected item changed:", selectedItem);
        triggerForceUpdate();
    }, [selectedItem]);


    if (!clusterResult || !clusterResult.data) {
        return <p>No clustering data available.</p>;
    }

    const cluster0Data = clusterResult.data.filter(item => item.clusterId === 0);
    const cluster1Data = clusterResult.data.filter(item => item.clusterId === 1);
    const isItemSelected = (item) => {
        const isSelected = selectedItem && 
            item.x === selectedItem.x && 
            item.y === selectedItem.y && 
            item.z === selectedItem.z;

        console.log("Row selected status:", isSelected, "for item:", item);

        return isSelected;
    };

    const handleRowClick = (itemData) => {
        onItemSelected(itemData); // Update selectedItem in App.js
        setForceUpdate(prev => prev + 1); // Force update on row click
        console.log("Row clicked:", itemData);

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
                    {data.map((item, index) => (
                        <tr key={index}
                        onClick={() => handleRowClick(item)}
                        className={isItemSelected(item) ? 'selectedRow' : 'unselectedRow'}>

                        <td>{item.x}</td>
                        <td>{item.y}</td>
                        <td>{item.z}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="d-flex justify-content-around" style={{ gap: '20px' }}>
            {renderTable(cluster0Data, 0)}
            {renderTable(cluster1Data, 1)}
        </div>
    );
}

export default ClusteredDataDisplay;

