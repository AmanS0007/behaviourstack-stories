import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import NewCampaignFlow from './components/flows/NewCampaignFlow';
import PerformanceDebugFlow from './components/flows/PerformanceDebugFlow';
import RegionalExpansionFlow from './components/flows/RegionalExpansionFlow';
import { PresentationProvider } from './context/PresentationContext';
import './styles/global.css';

function App() {
  const [activeFlow, setActiveFlow] = useState(null); // null, 'new-campaign', 'performance-debug', 'regional-expansion'

  const handleStartFlow = (flow) => {
    setActiveFlow(flow);
  };

  const handleExitFlow = () => {
    setActiveFlow(null);
  };

  return (
    <PresentationProvider>
      {!activeFlow ? (
        <LandingPage onStart={handleStartFlow} />
      ) : activeFlow === 'new-campaign' ? (
        <NewCampaignFlow onExit={handleExitFlow} />
      ) : activeFlow === 'performance-debug' ? (
        <PerformanceDebugFlow onExit={handleExitFlow} />
      ) : activeFlow === 'regional-expansion' ? (
        <RegionalExpansionFlow onExit={handleExitFlow} />
      ) : null}
    </PresentationProvider>
  );
}

export default App;