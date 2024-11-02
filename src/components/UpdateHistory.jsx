import React from 'react';
import { locations } from '../data/constants';

const UpdateHistory = ({ 
  updateHistory, 
  historyFilter, 
  setHistoryFilter, 
  setShowUpdateHistory 
}) => {
  const getFilteredHistory = () => {
    let filtered = {};
    
    Object.entries(updateHistory).forEach(([locationId, updates]) => {
      const area = Object.values(locations).flat().find(a => a.id === locationId);
      if (!area) return;

      // Filter by building
      if (historyFilter.building !== 'all' && !locationId.startsWith(historyFilter.building)) {
        return;
      }

      // Filter by time frame
      let filteredUpdates = updates.filter(update => {
        const updateDate = new Date(update.timestamp);
        const now = new Date();
        switch (historyFilter.timeFrame) {
          case 'today':
            return updateDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
            return updateDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
            return updateDate >= monthAgo;
          default:
            return true;
        }
      });

      // Filter by change type
      if (historyFilter.changeType !== 'all') {
        filteredUpdates = filteredUpdates.filter(update => 
          update.changes.some(change => change.changeType === historyFilter.changeType)
        );
      }

      if (filteredUpdates.length > 0) {
        filtered[locationId] = filteredUpdates;
      }
    });

    return filtered;
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Update History</h2>
        <div className="history-filters">
          <select 
            value={historyFilter.building} 
            onChange={(e) => setHistoryFilter(prev => ({ ...prev, building: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Buildings</option>
            <option value="ks">Knight Suite</option>
            <option value="mh">Main House</option>
            <option value="spa">Spa</option>
          </select>

          <select 
            value={historyFilter.timeFrame} 
            onChange={(e) => setHistoryFilter(prev => ({ ...prev, timeFrame: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
          </select>

          <select 
            value={historyFilter.changeType} 
            onChange={(e) => setHistoryFilter(prev => ({ ...prev, changeType: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Changes</option>
            <option value="initial">Initial Entries</option>
            <option value="updated">Updates</option>
            <option value="removed">Removals</option>
          </select>
        </div>

        <div className="history-content">
          {Object.keys(getFilteredHistory()).length === 0 ? (
            <div className="alert">No updates found for the selected filters</div>
          ) : (
            Object.entries(getFilteredHistory()).map(([locationId, updates]) => {
              const area = Object.values(locations).flat().find(a => a.id === locationId);
              return (
                <div key={locationId} className="area-history">
                  <h4>{area.name}</h4>
                  <div className="history-details">
                    {updates.map((update, updateIndex) => (
                      <div key={updateIndex} className="update-entry">
                        <div className="update-timestamp">
                          {new Date(update.timestamp).toLocaleDateString()} {' '}
                          {new Date(update.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="changes-list">
                          {update.changes.map((change, changeIndex) => (
                            <div 
                              key={changeIndex} 
                              className={`change-item ${change.changeType}`}
                            >
                              <span className="item-name">{change.item}:</span>
                              {change.changeType === 'initial' ? (
                                <span>Initial entry: {change.newValue}</span>
                              ) : change.changeType === 'removed' ? (
                                <span>Removed (was {change.oldValue})</span>
                              ) : (
                                <span>Changed from {change.oldValue} to {change.newValue}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        <button 
          className="button secondary"
          onClick={() => setShowUpdateHistory(false)}
        >
          Back to Inventory
        </button>
      </div>
    </div>
  );
};

export default UpdateHistory;