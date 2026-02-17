import React, { createContext, useContext, useState } from 'react';

const StoryContext = createContext();

export function StoryProvider({ children }) {
  const [activeBrand, setActiveBrand] = useState(null);
  const [currentAct, setCurrentAct] = useState(1);

  const [storyState, setStoryState] = useState({
    act1: {
      completed: false,
      selectedAudiences: [],
      selectedStrategy: null,
      crossoverRate: null,
      bridgeSegment: null
    },
    act2: {
      completed: false,
      selectedCreatives: [],
      winningCreative: null,
      testBudget: null,
      recommendedTrack: null
    },
    act3: {
      completed: false,
      diagnosisPath: null,
      recoveryStrategy: null,
      selectedMetrics: null
    },
    act4: {
      completed: false,
      selectedMarkets: [],
      playbooks: {}
    }
  });

  // Update a specific act's state
  const updateActState = (act, updates) => {
    setStoryState(prev => ({
      ...prev,
      [act]: {
        ...prev[act],
        ...updates
      }
    }));
  };

  // Mark an act as completed
  const completeAct = (actNumber) => {
    const actKey = `act${actNumber}`;
    setStoryState(prev => ({
      ...prev,
      [actKey]: {
        ...prev[actKey],
        completed: true
      }
    }));
  };

  // Reset story when switching brands
  const resetStory = () => {
    setCurrentAct(1);
    setStoryState({
      act1: {
        completed: false,
        selectedAudiences: [],
        selectedStrategy: null,
        crossoverRate: null,
        bridgeSegment: null
      },
      act2: {
        completed: false,
        selectedCreatives: [],
        winningCreative: null,
        testBudget: null,
        recommendedTrack: null
      },
      act3: {
        completed: false,
        diagnosisPath: null,
        recoveryStrategy: null,
        selectedMetrics: null
      },
      act4: {
        completed: false,
        selectedMarkets: [],
        playbooks: {}
      }
    });
  };

  // Get decisions summary for sidebar
  const getDecisionsSummary = () => {
    const summary = [];

    if (storyState.act1.selectedStrategy) {
      summary.push({
        act: 1,
        type: 'Strategy',
        value: storyState.act1.selectedStrategy
      });
    }

    if (storyState.act1.selectedAudiences.length > 0) {
      summary.push({
        act: 1,
        type: 'Audiences',
        value: `${storyState.act1.selectedAudiences.length} selected`
      });
    }

    if (storyState.act2.winningCreative) {
      summary.push({
        act: 2,
        type: 'Winner',
        value: storyState.act2.winningCreative
      });
    }

    if (storyState.act3.recoveryStrategy) {
      summary.push({
        act: 3,
        type: 'Recovery',
        value: storyState.act3.recoveryStrategy
      });
    }

    if (storyState.act4.selectedMarkets.length > 0) {
      summary.push({
        act: 4,
        type: 'Markets',
        value: `${storyState.act4.selectedMarkets.length} selected`
      });
    }

    return summary;
  };

  // Compute dynamic outputs based on previous decisions
  const getActOutputs = (actNumber) => {
    const { act1, act2, act3 } = storyState;

    switch (actNumber) {
      case 2:
        return {
          recommendedCreativeAngle: act1.selectedStrategy === 'best_canned_coffee'
            ? 'product'
            : act1.selectedStrategy === 'premium_convenience'
            ? 'heritage'
            : null,
          audienceFocus: act1.selectedAudiences
        };

      case 3:
        return {
          expectedMetrics: act1.selectedStrategy === 'best_canned_coffee'
            ? { cpa: 8.20, roas: 3.1, ctr: '3.2%' }
            : { cpa: 14.50, roas: 1.1, ctr: '1.6%' },
          winningCreative: act2.winningCreative
        };

      case 4:
        return {
          activatedBase: act3.recoveryStrategy === 'companion_positioning',
          strategyContext: act1.selectedStrategy,
          diagnosisResolved: act3.diagnosisPath
        };

      default:
        return {};
    }
  };

  return (
    <StoryContext.Provider value={{
      activeBrand,
      setActiveBrand,
      currentAct,
      setCurrentAct,
      storyState,
      updateActState,
      completeAct,
      resetStory,
      getDecisionsSummary,
      getActOutputs
    }}>
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
}

export default StoryContext;