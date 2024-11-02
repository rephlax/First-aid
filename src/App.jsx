import React, { useState, useEffect } from 'react';
import LocationSelector from './components/LocationSelector';
import InventoryForm from './components/InventoryForm';
import AnalysisView from './components/AnalysisView';
import UpdateHistory from './components/UpdateHistory';
import { locations, requiredItems } from './data/constants';
import './styles/styles.css';

function App() {
  // Core state management
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [showInventory, setShowInventory] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showUpdateHistory, setShowUpdateHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState({
    building: 'all',
    timeFrame: 'all',
    changeType: 'all'
  });

  // Initialize data from localStorage
  const [inventoryData, setInventoryData] = useState(() => {
    const savedData = localStorage.getItem('firstAidInventory');
    return savedData ? JSON.parse(savedData) : {};
  });

  const [updateHistory, setUpdateHistory] = useState(() => {
    const savedHistory = localStorage.getItem('updateHistory');
    return savedHistory ? JSON.parse(savedHistory) : {};
  });

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('firstAidInventory', JSON.stringify(inventoryData));
  }, [inventoryData]);

  useEffect(() => {
    localStorage.setItem('updateHistory', JSON.stringify(updateHistory));
  }, [updateHistory]);

  // Update inventory with history tracking
  const updateInventoryWithTracking = (locationId, newData) => {
    const oldData = inventoryData[locationId] || {};
    const changes = [];
    
    // Compare old and new values to track changes
    Object.entries(newData).forEach(([item, newValue]) => {
      const oldValue = oldData[item] || 0;
      newValue = parseInt(newValue) || 0;
      
      if (newValue !== oldValue) {
        changes.push({
          item,
          oldValue,
          newValue,
          changeType: oldValue === 0 ? 'initial' : newValue === 0 ? 'removed' : 'updated'
        });
      }
    });

    // Update inventory
    setInventoryData(prev => ({
      ...prev,
      [locationId]: newData
    }));

    // Only add to history if there are changes
    if (changes.length > 0) {
      const timestamp = new Date().toISOString();
      setUpdateHistory(prev => ({
        ...prev,
        [locationId]: [
          ...(prev[locationId] || []).slice(0, 19), // Keep last 20 updates
          {
            timestamp,
            type: prev[locationId]?.length ? 'Update' : 'Initial Entry',
            changes
          }
        ]
      }));
    }
  };

  // Data management functions
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all inventory data? This cannot be undone.')) {
      setInventoryData({});
      setUpdateHistory({});
      localStorage.removeItem('firstAidInventory');
      localStorage.removeItem('updateHistory');
    }
  };

  const getLastUpdated = (locationId) => {
    const history = updateHistory[locationId];
    if (!history?.length) return 'Never checked';
    const lastUpdate = new Date(history[history.length - 1].timestamp);
    return lastUpdate.toLocaleDateString() + ' ' + lastUpdate.toLocaleTimeString();
  };

  // Data validation functions
  const validateDataStructure = (data) => {
    const requiredFields = ['inventory', 'history', 'exportDate'];
    const missingFields = requiredFields.filter(field => !data.hasOwnProperty(field));
    
    if (missingFields.length > 0) {
      throw new Error(`Invalid data format: Missing required fields: ${missingFields.join(', ')}`);
    }
    
    if (typeof data.exportDate !== 'string' || isNaN(Date.parse(data.exportDate))) {
      throw new Error('Invalid export date format');
    }
  };

  const validateInventoryData = (inventory) => {
    if (typeof inventory !== 'object' || inventory === null) {
      throw new Error('Invalid inventory data format');
    }

    Object.entries(inventory).forEach(([locationId, items]) => {
      const locationExists = Object.values(locations).flat().some(loc => loc.id === locationId);
      if (!locationExists) {
        throw new Error(`Invalid location ID: ${locationId}`);
      }

      if (typeof items !== 'object' || items === null) {
        throw new Error(`Invalid items format for location: ${locationId}`);
      }

      Object.entries(items).forEach(([itemName, quantity]) => {
        if (typeof quantity !== 'number' || quantity < 0) {
          throw new Error(`Invalid quantity for item "${itemName}" in location ${locationId}`);
        }
      });
    });
  };

  const validateHistoryData = (history) => {
    if (typeof history !== 'object' || history === null) {
      throw new Error('Invalid history data format');
    }

    Object.entries(history).forEach(([locationId, updates]) => {
      if (!Array.isArray(updates)) {
        throw new Error(`Invalid history format for location: ${locationId}`);
      }

      updates.forEach((update, index) => {
        if (!update.timestamp || !update.type || !Array.isArray(update.changes)) {
          throw new Error(`Invalid update format at index ${index} for location ${locationId}`);
        }

        update.changes.forEach((change, changeIndex) => {
          if (!change.item || typeof change.newValue !== 'number' || 
              typeof change.oldValue !== 'number' || !change.changeType) {
            throw new Error(`Invalid change format at index ${changeIndex} in update ${index}`);
          }
        });
      });
    });
  };

  // Import/Export functions
  const exportData = () => {
    try {
      const dataToExport = {
        inventory: inventoryData,
        history: updateHistory,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      validateInventoryData(dataToExport.inventory);
      validateHistoryData(dataToExport.history);

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `first-aid-inventory-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Error exporting data: ${error.message}`);
    }
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          validateDataStructure(importedData);
          validateInventoryData(importedData.inventory);
          validateHistoryData(importedData.history);

          const importDate = new Date(importedData.exportDate);
          const currentData = localStorage.getItem('firstAidInventory');
          
          if (currentData) {
            const currentDate = new Date(JSON.parse(currentData).exportDate || 0);
            if (importDate < currentDate) {
              if (!window.confirm('The imported data is older than your current data. Continue?')) {
                return;
              }
            }
          }

          if (window.confirm('This will replace all current data. Are you sure?')) {
            setInventoryData(importedData.inventory);
            setUpdateHistory(importedData.history);
            alert('Data imported successfully!');
          }
        } catch (error) {
          alert(`Error importing data: ${error.message}`);
        }
      };
      reader.readAsText(file);
    }
  };

  // UI Components
  const DataTransfer = () => (
    <div className="data-transfer">
      <h3>Data Transfer</h3>
      <div className="transfer-buttons">
        <button 
          className="button export-button" 
          onClick={exportData}
        >
          Export Data
        </button>
        <div className="import-container">
          <input
            type="file"
            id="import-file"
            accept=".json"
            onChange={importData}
            className="import-input"
          />
          <label htmlFor="import-file" className="button import-button">
            Import Data
          </label>
        </div>
      </div>
      <p className="transfer-note">
        Export data to transfer to another device or create a backup. 
        Import previously exported data to restore inventory and history.
      </p>
    </div>
  );

  const renderLastUpdated = () => (
    <div className="last-updated-container">
      <div className="last-updated">
        {selectedArea 
          ? `${locations[selectedBuilding].find(a => a.id === selectedArea)?.name}: Last Updated ${getLastUpdated(selectedArea)}`
          : 'Select a location to see last update time'}
      </div>
      <button 
        className="button secondary history-button"
        onClick={() => setShowUpdateHistory(true)}
      >
        View Update History
      </button>
    </div>
  );

  // Main Render
  return (
    <div className="container">
      {showUpdateHistory ? (
        <UpdateHistory
          updateHistory={updateHistory}
          historyFilter={historyFilter}
          setHistoryFilter={setHistoryFilter}
          setShowUpdateHistory={setShowUpdateHistory}
        />
      ) : showAnalysis ? (
        <>
          {renderLastUpdated()}
          <AnalysisView 
            inventoryData={inventoryData}
            setShowAnalysis={setShowAnalysis}
            updateHistory={updateHistory}
          />
          <DataTransfer />
          <button 
            className="button secondary clear-button"
            onClick={clearAllData}
          >
            Clear All Data
          </button>
        </>
      ) : showInventory ? (
        <>
          {renderLastUpdated()}
          <InventoryForm
            selectedBuilding={selectedBuilding}
            selectedArea={selectedArea}
            inventoryData={inventoryData}
            setInventoryData={updateInventoryWithTracking}
            setShowInventory={setShowInventory}
            setShowAnalysis={setShowAnalysis}
          />
          <DataTransfer />
        </>
      ) : (
        <>
          {renderLastUpdated()}
          <LocationSelector
            selectedBuilding={selectedBuilding}
            setSelectedBuilding={setSelectedBuilding}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            setShowInventory={setShowInventory}
          />
          <DataTransfer />
          <button 
            className="button secondary clear-button"
            onClick={clearAllData}
          >
            Clear All Data
          </button>
        </>
      )}
    </div>
  );
}

export default App;