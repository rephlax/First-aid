import React from 'react';
import { locations } from '../data/constants';

const LocationSelector = ({ 
  selectedBuilding, 
  setSelectedBuilding, 
  selectedArea, 
  setSelectedArea, 
  setShowInventory 
}) => {
  return (
    <div className="card">
      <h2 className="title">Select Location</h2>
      
      <div className="form-group">
        <h3>Building</h3>
        <div className="grid">
          {Object.keys(locations).map((building) => (
            <button
              key={building}
              className={`button ${selectedBuilding === building ? '' : 'secondary'}`}
              onClick={() => {
                setSelectedBuilding(building);
                setSelectedArea('');
              }}
            >
              {building}
            </button>
          ))}
        </div>
      </div>

      {selectedBuilding && (
        <div className="form-group">
          <h3>Area</h3>
          <div className="grid">
            {locations[selectedBuilding].map((area) => (
              <button
                key={area.id}
                className={`button ${selectedArea === area.id ? '' : 'secondary'}`}
                onClick={() => {
                  setSelectedArea(area.id);
                  setShowInventory(true);
                }}
              >
                {area.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;