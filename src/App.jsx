import React, { useState, useEffect } from 'react';
import LocationSelector from './components/LocationSelector';
import InventoryForm from './components/InventoryForm';
import AnalysisView from './components/AnalysisView';
import UpdateHistory from './components/UpdateHistory';
import SearchFilter from './components/SearchFilter';
import { locations, requiredItems } from './data/constants';
import './styles/styles.css';

function App() {
  // Core state management
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [showInventory, setShowInventory] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showUpdateHistory, setShowUpdateHistory] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    kitType: 'all',
    stockLevel: 'all',
    lastUpdated: 'all'
  });
  const [sortConfig, setSortConfig] = useState({
    field: 'name',
    direction: 'asc'
  });

  // History filter state
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

  // Search and Filter Functions
  const getFilteredItems = () => {
    let filtered = { ...inventoryData };

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = Object.entries(filtered).reduce((acc, [locationId, items]) => {
        const location = Object.values(locations).flat().find(loc => loc.id === locationId);
        if (location.name.toLowerCase().includes(query)) {
          acc[locationId] = items;
          return acc;
        }
        const filteredItems = Object.entries(items).reduce((itemAcc, [item, quantity]) => {
          if (item.toLowerCase().includes(query)) {
            itemAcc[item] = quantity;
          }
          return itemAcc;
        }, {});
        if (Object.keys(filteredItems).length > 0) {
          acc[locationId] = filteredItems;
        }
        return acc;
      }, {});
    }

    // Kit type filter
    if (filters.kitType !== 'all') {
      filtered = Object.entries(filtered).reduce((acc, [locationId, items]) => {
        const location = Object.values(locations).flat().find(loc => loc.id === locationId);
        if (location.type === filters.kitType) {
          acc[locationId] = items;
        }
        return acc;
      }, {});
    }

    // Stock level filter
    if (filters.stockLevel !== 'all') {
      filtered = Object.entries(filtered).reduce((acc, [locationId, items]) => {
        const location = Object.values(locations).flat().find(loc => loc.id === locationId);
        const filteredItems = Object.entries(items).reduce((itemAcc, [item, quantity]) => {
          const required = requiredItems[location.type][item];
          const stockStatus = 
            quantity === 0 ? 'outOfStock' :
            quantity < required ? 'low' : 'full';
          
          if (stockStatus === filters.stockLevel) {
            itemAcc[item] = quantity;
          }
          return itemAcc;
        }, {});
        
        if (Object.keys(filteredItems).length > 0) {
          acc[locationId] = filteredItems;
        }
        return acc;
      }, {});
    }

    // Last updated filter
    if (filters.lastUpdated !== 'all') {
      const now = new Date();
      const timeLimit = {
        today: new Date(now.setHours(0, 0, 0, 0)),
        week: new Date(now.setDate(now.getDate() - 7)),
        month: new Date(now.setMonth(now.getMonth() - 1))
      }[filters.lastUpdated];

      filtered = Object.entries(filtered).reduce((acc, [locationId, items]) => {
        const lastUpdate = updateHistory[locationId]?.[updateHistory[locationId].length - 1]?.timestamp;
        if (lastUpdate && new Date(lastUpdate) >= timeLimit) {
          acc[locationId] = items;
        }
        return acc;
      }, {});
    }

    // Apply sorting
    const sortedEntries = Object.entries(filtered).sort(([aId, aItems], [bId, bItems]) => {
      const aLocation = Object.values(locations).flat().find(loc => loc.id === aId);
      const bLocation = Object.values(locations).flat().find(loc => loc.id === bId);
      
      switch (sortConfig.field) {
        case 'name':
          return sortConfig.direction === 'asc' 
            ? aLocation.name.localeCompare(bLocation.name)
            : bLocation.name.localeCompare(aLocation.name);
        case 'lastUpdated':
          const aDate = updateHistory[aId]?.[updateHistory[aId].length - 1]?.timestamp || '0';
          const bDate = updateHistory[bId]?.[updateHistory[bId].length - 1]?.timestamp || '0';
          return sortConfig.direction === 'asc' 
            ? new Date(aDate) - new Date(bDate)
            : new Date(bDate) - new Date(aDate);
        case 'stockLevel':
          const aStock = Object.values(aItems).reduce((sum, qty) => sum + qty, 0);
          const bStock = Object.values(bItems).reduce((sum, qty) => sum + qty, 0);
          return sortConfig.direction === 'asc' 
            ? aStock - bStock
            : bStock - aStock;
        default:
          return 0;
      }
    });

    return Object.fromEntries(sortedEntries);
  };

  // Inventory Update Functions
  const updateInventoryWithTracking = (locationId, newData) => {
    const oldData = inventoryData[locationId] || {};
    const changes = [];
    
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

    setInventoryData(prev => ({
      ...prev,
      [locationId]: newData
    }));

    if (changes.length > 0) {
      const timestamp = new Date().toISOString();
      setUpdateHistory(prev => ({
        ...prev,
        [locationId]: [
          ...(prev[locationId] || []).slice(0, 19),
          {
            timestamp,
            type: prev[locationId]?.length ? 'Update' : 'Initial Entry',
            changes
          }
        ]
      }));
    }
  };

  // Data Management Functions
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all inventory data? This cannot be undone.')) {
      setInventoryData({});
      setUpdateHistory({});
      localStorage.removeItem('firstAidInventory');
      localStorage.removeItem('updateHistory');
      setSearchQuery('');
      setFilters({
        kitType: 'all',
        stockLevel: 'all',
        lastUpdated: 'all'
      });
      setSortConfig({
        field: 'name',
        direction: 'asc'
      });
    }
  };

  const getLastUpdated = (locationId) => {
    const history = updateHistory[locationId];
    if (!history?.length) return 'Never checked';
    const lastUpdate = new Date(history[history.length - 1].timestamp);
    return lastUpdate.toLocaleDateString() + ' ' + lastUpdate.toLocaleTimeString();
  };

  // Data Validation Functions
  // ... [Previous validation functions remain the same]

  // Import/Export Functions
  // ... [Previous import/export functions remain the same]

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
            inventoryData={getFilteredItems()}
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
          <SearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            totalItems={Object.keys(getFilteredItems()).length}
          />
          <LocationSelector
            selectedBuilding={selectedBuilding}
            setSelectedBuilding={setSelectedBuilding}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            setShowInventory={setShowInventory}
            filteredLocations={getFilteredItems()}
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