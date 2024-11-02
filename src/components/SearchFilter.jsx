import React from 'react';

const SearchFilter = ({ 
  searchQuery, 
  setSearchQuery, 
  filters, 
  setFilters,
  sortConfig,
  setSortConfig,
  totalItems
}) => {
  return (
    <div className="search-filter-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search items, locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <div className="search-stats">
          Found {totalItems} items
        </div>
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label>Kit Type:</label>
          <select 
            value={filters.kitType} 
            onChange={(e) => setFilters({ ...filters, kitType: e.target.value })}
            className="filter-select"
          >
            <option value="all">All Kits</option>
            <option value="firstAid">First Aid Only</option>
            <option value="burns">Burns Only</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Stock Level:</label>
          <select 
            value={filters.stockLevel} 
            onChange={(e) => setFilters({ ...filters, stockLevel: e.target.value })}
            className="filter-select"
          >
            <option value="all">All Levels</option>
            <option value="low">Low Stock</option>
            <option value="outOfStock">Out of Stock</option>
            <option value="full">Fully Stocked</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Last Updated:</label>
          <select 
            value={filters.lastUpdated} 
            onChange={(e) => setFilters({ ...filters, lastUpdated: e.target.value })}
            className="filter-select"
          >
            <option value="all">Any Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select 
            value={`${sortConfig.field}-${sortConfig.direction}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              setSortConfig({ field, direction });
            }}
            className="filter-select"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="lastUpdated-desc">Recently Updated</option>
            <option value="lastUpdated-asc">Oldest Updated</option>
            <option value="stockLevel-asc">Stock Level (Low-High)</option>
            <option value="stockLevel-desc">Stock Level (High-Low)</option>
          </select>
        </div>
      </div>

      <div className="active-filters">
        {Object.entries(filters).map(([key, value]) => {
          if (value !== 'all') {
            return (
              <div key={key} className="filter-tag">
                {value}
                <button 
                  onClick={() => setFilters({ ...filters, [key]: 'all' })}
                  className="remove-filter"
                >
                  ×
                </button>
              </div>
            );
          }
          return null;
        })}
        {Object.keys(filters).some(key => filters[key] !== 'all') && (
          <button 
            onClick={() => {
              setFilters({
                kitType: 'all',
                stockLevel: 'all',
                lastUpdated: 'all'
              });
              setSortConfig({ field: 'name', direction: 'asc' });
            }}
            className="clear-filters"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;