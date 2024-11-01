import React, { useState } from 'react';
import { locations, requiredItems } from '../data/constants';

const AnalysisView = ({ inventoryData, setShowAnalysis }) => {
  const [activeTab, setActiveTab] = useState('overall');

  // Helper function to determine item type and get corresponding styles
  const getItemTypeStyles = (item) => {
    const inFirstAid = item in requiredItems.firstAid;
    const inBurns = item in requiredItems.burns;
    
    if (inFirstAid && inBurns) {
      return {
        type: 'Both Kits',
        className: 'alert-both',
        titleClass: 'title-both'
      };
    } else if (inFirstAid) {
      return {
        type: 'First Aid Kit',
        className: 'alert-firstaid',
        titleClass: 'title-firstaid'
      };
    } else {
      return {
        type: 'Burns Kit',
        className: 'alert-burns',
        titleClass: 'title-burns'
      };
    }
  };

  const getLocationInventoryStatus = () => {
    const status = {
      overall: {},
      byBuilding: {}
    };

    Object.keys(locations).forEach(building => {
      status.byBuilding[building] = {};
    });

    Object.entries(locations).forEach(([building, areas]) => {
      areas.forEach(area => {
        const required = requiredItems[area.type];
        const current = inventoryData[area.id] || {};

        Object.entries(required).forEach(([item, requiredQty]) => {
          const currentQty = current[item] || 0;
          if (currentQty < requiredQty) {
            const missing = requiredQty - currentQty;
            
            if (!status.overall[item]) {
              status.overall[item] = { missing: 0, locations: [] };
            }
            status.overall[item].missing += missing;
            status.overall[item].locations.push({
              building,
              area: area.name,
              missing
            });

            if (!status.byBuilding[building][item]) {
              status.byBuilding[building][item] = { missing: 0, locations: [] };
            }
            status.byBuilding[building][item].missing += missing;
            status.byBuilding[building][item].locations.push({
              area: area.name,
              missing
            });
          }
        });
      });
    });

    return status;
  };

  const status = getLocationInventoryStatus();
  const buildingTabs = ['Knight Suite', 'Main House', 'Spa'];

  const renderMissingItems = (items, isOverall = false) => {
    if (Object.keys(items).length === 0) {
      return (
        <div className="alert success">
          <h3>All Items Complete</h3>
          <p>{isOverall ? 'All locations have required items.' : 'This building has all required items.'}</p>
        </div>
      );
    }

    // Group items by type
    const groupedItems = Object.entries(items).reduce((acc, [item, data]) => {
      const { type } = getItemTypeStyles(item);
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push([item, data]);
      return acc;
    }, {});

    return Object.entries(groupedItems).map(([type, itemsList]) => (
      <div key={type} className="item-group">
        <h3 className="group-title">{type}</h3>
        {itemsList.map(([item, data]) => {
          const { className, titleClass } = getItemTypeStyles(item);
          return (
            <div key={item} className={`alert ${className}`}>
              <h3 className={titleClass}>
                {item} - Missing {data.missing} total
              </h3>
              <ul className="location-list">
                {data.locations.map((loc, idx) => (
                  <li key={idx}>
                    {isOverall ? `${loc.building} - ${loc.area}` : loc.area}: 
                    Missing {loc.missing}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="container">
      <div className="nav-buttons">
        <button 
          className="button secondary"
          onClick={() => setShowAnalysis(false)}
        >
          Back to Inventory
        </button>
      </div>

      <div className="card">
        <h2 className="title">Inventory Analysis</h2>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'overall' ? 'active' : ''}`}
            onClick={() => setActiveTab('overall')}
          >
            Overall
          </button>
          {buildingTabs.map(building => (
            <button
              key={building}
              className={`tab ${activeTab === building ? 'active' : ''}`}
              onClick={() => setActiveTab(building)}
            >
              {building}
            </button>
          ))}
        </div>

        <div className="analysis-content">
          {activeTab === 'overall' ? (
            <div>
              <h3 className="title">Overall Missing Items</h3>
              {renderMissingItems(status.overall, true)}
            </div>
          ) : (
            <div>
              <h3 className="title">{activeTab} Missing Items</h3>
              {renderMissingItems(status.byBuilding[activeTab])}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;