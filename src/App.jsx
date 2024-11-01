import React, { useState } from 'react';
import LocationSelector from './components/LocationSelector';
import InventoryForm from './components/InventoryForm';
import AnalysisView from './components/AnalysisView';
import './styles/styles.css';

function App() {
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [showInventory, setShowInventory] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [inventoryData, setInventoryData] = useState({});

  if (showAnalysis) {
    return (
      <AnalysisView 
        inventoryData={inventoryData}
        setShowAnalysis={setShowAnalysis}
      />
    );
  }

  if (showInventory) {
    return (
      <InventoryForm
        selectedBuilding={selectedBuilding}
        selectedArea={selectedArea}
        inventoryData={inventoryData}
        setInventoryData={setInventoryData}
        setShowInventory={setShowInventory}
        setShowAnalysis={setShowAnalysis}
      />
    );
  }

  return (
    <LocationSelector
      selectedBuilding={selectedBuilding}
      setSelectedBuilding={setSelectedBuilding}
      selectedArea={selectedArea}
      setSelectedArea={setSelectedArea}
      setShowInventory={setShowInventory}
    />
  );
}

export default App;