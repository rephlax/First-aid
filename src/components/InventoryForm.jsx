import React from 'react';
import { locations, requiredItems } from '../data/constants';

const InventoryForm = ({
  selectedBuilding,
  selectedArea,
  inventoryData,
  setInventoryData,
  setShowInventory,
  setShowAnalysis
}) => {
  const selectedAreaInfo = locations[selectedBuilding].find(a => a.id === selectedArea);
  const itemsToCheck = requiredItems[selectedAreaInfo.type];

  const handleInputChange = (item, value) => {
    setInventoryData(prev => ({
      ...prev,
      [selectedArea]: {
        ...prev[selectedArea],
        [item]: parseInt(value) || 0
      }
    }));
  };

  return (
    <div className="container">
      <div className="nav-buttons">
        <button 
          className="button secondary"
          onClick={() => setShowInventory(false)}
        >
          Back to Location Selection
        </button>
        
        <button 
          className="button"
          onClick={() => setShowAnalysis(true)}
        >
          View Analysis
        </button>
      </div>

      <div className="card">
        <h2 className="title">
          {selectedBuilding} - {selectedAreaInfo.name}
        </h2>
        
        <div className="grid">
          {Object.entries(itemsToCheck).map(([item, _]) => (
            <div key={item} className="item-row">
              <label>{item}</label>
              <input
                type="number"
                min="0"
                className="quantity-input"
                value={inventoryData[selectedArea]?.[item] || ''}
                onChange={(e) => handleInputChange(item, e.target.value)}
                placeholder="0"
              />
            </div>
          ))}
        </div>
        
        <button 
          className="button"
          onClick={() => setShowInventory(false)}
          style={{ marginTop: '20px', width: '100%' }}
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
};

export default InventoryForm;