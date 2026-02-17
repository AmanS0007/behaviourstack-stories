import React, { useState } from 'react';
import { useStory } from '../context/StoryContext';
import {
  MapPin, TrendingUp, CheckCircle, ArrowRight,
  Brain, Zap, Target, Info, Trophy, Star,
  BarChart2, Globe, Layers, DollarSign
} from 'lucide-react';
import '../styles/Act4.css';

function Act4({ brandData, addChatMessage }) {
  const { storyState, updateActState, completeAct } = useStory();
  const [selectedMarkets, setSelectedMarkets] = useState(
    storyState.act4.selectedMarkets || []
  );
  const [expandedMarket, setExpandedMarket] = useState(null);
  const [showPlaybook, setShowPlaybook] = useState(false);
  const [storyComplete, setStoryComplete] = useState(false);

  const act4Data = brandData.act4;
  const brandColors = brandData.brand.colors;
  const selectedStrategy = storyState.act1.selectedStrategy;
  const recoveryStrategy = storyState.act3.recoveryStrategy;
  const winningCreative = storyState.act2.winningCreative;

  // Get positioning based on Act 3 recovery
  const getPositioning = () => {
    if (!recoveryStrategy) return null;
    const recovery = Object.values(brandData.act3.scenarios)
      .flatMap(s => s.recovery_strategies)
      .find(r => r.id === recoveryStrategy);
    return recovery?.impacts || null;
  };

  const positioning = getPositioning();

  // Get condition key from recovery strategy impacts
  const getConditionKey = () => {
    if (!positioning) return 'new_customer';
    return positioning.act4_positioning ||
      positioning.act4_angle ||
      'new_customer';
  };

  const conditionKey = getConditionKey();

  const handleMarketToggle = (marketId) => {
    const updated = selectedMarkets.includes(marketId)
      ? selectedMarkets.filter(id => id !== marketId)
      : [...selectedMarkets, marketId];
    setSelectedMarkets(updated);
    updateActState('act4', { selectedMarkets: updated });

    if (!selectedMarkets.includes(marketId)) {
      const market = act4Data.markets.find(m => m.id === marketId);
      addChatMessage({
        type: 'user',
        content: `Add ${market.name} to our expansion plan`
      });
      addChatMessage({
        type: 'assistant',
        content: `${market.name} added! LCBM score: ${market.lcbm_score}. Key insight: ${market.lcbm_insight}`
      });
    }
  };

  const handleCompleteStory = () => {
    if (selectedMarkets.length === 0) return;
    completeAct(4);
    setStoryComplete(true);
    updateActState('act4', {
      selectedMarkets,
      completed: true
    });
    addChatMessage({
      type: 'user',
      content: 'Launch the regional expansion!'
    });
    addChatMessage({
      type: 'assistant',
      content: `🎉 Story complete! ${brandData.brand.name}'s full journey from audience discovery to regional expansion is mapped out. You've made ${
        storyState.act1.selectedStrategy ? '1' : '0'
      } strategy decision, selected a winning creative, ran a performance diagnosis, and launched in ${selectedMarkets.length} new market${selectedMarkets.length > 1 ? 's' : ''}.`
    });
  };

  const getTotalBudget = () => {
    return selectedMarkets.reduce((sum, id) => {
      const market = act4Data.markets.find(m => m.id === id);
      return sum + (market?.budget || 0);
    }, 0);
  };

  const getAvgPredictedRoas = () => {
    if (selectedMarkets.length === 0) return 0;
    const avg = selectedMarkets.reduce((sum, id) => {
      const market = act4Data.markets.find(m => m.id === id);
      return sum + (market?.predicted_roas || 0);
    }, 0) / selectedMarkets.length;
    return avg.toFixed(1);
  };

  const getLcbmColor = (score) => {
    if (score >= 90) return '#4caf50';
    if (score >= 80) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="act4">
      {/* Story Context Bar */}
      <div className="story-context-bar">
        <div className="context-item">
          <span className="ctx-label">Strategy</span>
          <span className="ctx-value">
            {selectedStrategy
              ? brandData.act1.strategies.find(
                  s => s.id === selectedStrategy
                )?.emoji + ' ' +
                brandData.act1.strategies.find(
                  s => s.id === selectedStrategy
                )?.label
              : '—'}
          </span>
        </div>
        <div className="ctx-divider" />
        <div className="context-item">
          <span className="ctx-label">Winning Creative</span>
          <span className="ctx-value">
            {winningCreative || '—'}
          </span>
        </div>
        <div className="ctx-divider" />
        <div className="context-item">
          <span className="ctx-label">Recovery</span>
          <span className="ctx-value">
            {recoveryStrategy
              ? Object.values(brandData.act3.scenarios)
                  .flatMap(s => s.recovery_strategies)
                  .find(r => r.id === recoveryStrategy)?.label || '—'
              : '—'}
          </span>
        </div>
        <div className="ctx-divider" />
        <div className="context-item">
          <span className="ctx-label">Act 4 Angle</span>
          <span className="ctx-value ctx-highlight"
            style={{ color: brandColors.primary }}>
            {conditionKey.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Context Banner */}
      <div className="context-banner"
        style={{
          background: brandColors.light,
          borderColor: brandColors.primary + '40'
        }}>
        <Info className="context-icon"
          style={{ color: brandColors.primary }} />
        <p className="context-text">{act4Data.context}</p>
      </div>

      {/* Markets Grid */}
      <div className="card">
        <div className="card-header-row">
          <div className="card-icon-wrap"
            style={{ background: brandColors.primary }}>
            <Globe className="icon" />
          </div>
          <div className="card-header-flex">
            <div>
              <h3 className="card-title">Select Your Markets</h3>
              <p className="card-subtitle">
                Each market has a tailored LCBM playbook — choose which
                cities to expand into
              </p>
            </div>
            {selectedMarkets.length > 0 && (
              <div className="selection-counter"
                style={{
                  background: brandColors.light,
                  color: brandColors.primary,
                  borderColor: brandColors.primary + '40'
                }}>
                <MapPin className="counter-icon" />
                {selectedMarkets.length} market
                {selectedMarkets.length > 1 ? 's' : ''} selected
              </div>
            )}
          </div>
        </div>

        <div className="markets-grid">
          {act4Data.markets.map((market) => {
            const isSelected = selectedMarkets.includes(market.id);
            const isExpanded = expandedMarket === market.id;
            const condition = market.conditions?.[conditionKey] ||
              market.conditions?.[Object.keys(market.conditions)[0]];

            return (
              <div
                key={market.id}
                className={`market-card ${isSelected ? 'selected' : ''}`}
                style={isSelected ? {
                  borderColor: brandColors.primary,
                  background: brandColors.light
                } : {}}
              >
                {/* Market Header */}
                <div className="market-header">
                  <div className="market-left">
                    <span className="market-emoji">{market.emoji}</span>
                    <div>
                      <h4 className="market-name">{market.name}</h4>
                      <p className="market-state">{market.state}</p>
                    </div>
                  </div>
                  <div className="market-right">
                    <div className="lcbm-score"
                      style={{ color: getLcbmColor(market.lcbm_score) }}>
                      <span className="lcbm-value">
                        {market.lcbm_score}
                      </span>
                      <span className="lcbm-label">LCBM</span>
                    </div>
                  </div>
                </div>

                {/* Market Context */}
                <div className="market-context">
                  <div className="mkt-ctx-item">
                    <span className="mkt-ctx-label">Culture</span>
                    <span className="mkt-ctx-value">
                      {market.fitness_culture ||
                       market.cold_brew_adoption ||
                       market.beauty_culture}
                    </span>
                  </div>
                  <div className="mkt-ctx-item">
                    <span className="mkt-ctx-label">Competition</span>
                    <span className="mkt-ctx-value">
                      {market.competitive_landscape}
                    </span>
                  </div>
                </div>

                {/* LCBM Insight */}
                <div className="lcbm-insight"
                  style={{
                    background: isSelected
                      ? 'rgba(255,255,255,0.7)'
                      : '#f8f9fa',
                    borderColor: isSelected
                      ? brandColors.primary + '30'
                      : '#e0e0e0'
                  }}>
                  <Brain className="insight-brain-icon"
                    style={{ color: brandColors.primary }} />
                  <p className="lcbm-insight-text">
                    {market.lcbm_insight}
                  </p>
                </div>

                {/* Predicted Metrics */}
                <div className="predicted-metrics">
                  <div className="pred-metric">
                    <DollarSign className="pred-icon" />
                    <div>
                      <p className="pred-label">Budget</p>
                      <p className="pred-value">
                        ${market.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="pred-metric">
                    <TrendingUp className="pred-icon" />
                    <div>
                      <p className="pred-label">Predicted ROAS</p>
                      <p className="pred-value"
                        style={{ color: '#4caf50' }}>
                        {market.predicted_roas}x
                      </p>
                    </div>
                  </div>
                  <div className="pred-metric">
                    <Target className="pred-icon" />
                    <div>
                      <p className="pred-label">Predicted CPA</p>
                      <p className="pred-value">
                        ${market.predicted_cpa}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommended Angle */}
                <div className="recommended-angle-tag"
                  style={{
                    background: brandColors.primary,
                  }}>
                  <Target className="angle-tag-icon" />
                  <span>{market.recommended_angle}</span>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="market-expanded fade-in">
                    {/* Playbook */}
                    <div className="playbook-section">
                      <h5 className="playbook-title">
                        Market Playbook
                      </h5>
                      <div className="playbook-steps">
                        {Object.entries(market.playbook).map(
                          ([stage, action]) => (
                            <div key={stage} className="playbook-step">
                              <span className="playbook-stage">
                                {stage}
                              </span>
                              <span className="playbook-action">
                                {action}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Condition-based advantage */}
                    {condition && (
                      <div className="condition-advantage"
                        style={{
                          background: brandColors.light,
                          borderColor: brandColors.primary + '40'
                        }}>
                        <div className="condition-header">
                          <Zap className="condition-icon"
                            style={{ color: brandColors.primary }} />
                          <p className="condition-label">
                            Your Recovery Strategy Advantage
                          </p>
                        </div>
                        <p className="condition-text">
                          {condition.advantage}
                        </p>
                        {condition.extra_tactic && (
                          <div className="extra-tactic">
                            <Star className="tactic-icon" />
                            <span>{condition.extra_tactic}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Card Actions */}
                <div className="market-actions">
                  <button
                    className="expand-market-btn"
                    onClick={() => setExpandedMarket(
                      isExpanded ? null : market.id
                    )}
                  >
                    {isExpanded ? '▲ Less' : '▼ Full Playbook'}
                  </button>
                  <button
                    className={`select-market-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleMarketToggle(market.id)}
                    style={isSelected ? {
                      background: brandColors.primary,
                      borderColor: brandColors.primary
                    } : {}}
                  >
                    {isSelected ? (
                      <><CheckCircle className="btn-icon" /> Selected</>
                    ) : (
                      <>+ Select Market</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Markets Summary */}
      {selectedMarkets.length > 0 && (
        <div className="card summary-card fade-in">
          <div className="card-header-row">
            <div className="card-icon-wrap"
              style={{ background: '#4caf50' }}>
              <BarChart2 className="icon" />
            </div>
            <div>
              <h3 className="card-title">Expansion Summary</h3>
              <p className="card-subtitle">
                Combined forecast for selected markets
              </p>
            </div>
          </div>

          <div className="summary-stats">
            <div className="summary-stat">
              <p className="sum-stat-value"
                style={{ color: brandColors.primary }}>
                {selectedMarkets.length}
              </p>
              <p className="sum-stat-label">Markets</p>
            </div>
            <div className="summary-stat">
              <p className="sum-stat-value">
                ${getTotalBudget().toLocaleString()}
              </p>
              <p className="sum-stat-label">Total Budget</p>
            </div>
            <div className="summary-stat">
              <p className="sum-stat-value"
                style={{ color: '#4caf50' }}>
                {getAvgPredictedRoas()}x
              </p>
              <p className="sum-stat-label">Avg Predicted ROAS</p>
            </div>
            <div className="summary-stat">
              <p className="sum-stat-value">
                {selectedMarkets.map(id =>
                  act4Data.markets.find(m => m.id === id)?.emoji
                ).join(' ')}
              </p>
              <p className="sum-stat-label">Selected Cities</p>
            </div>
          </div>

          {/* Blended Playbook */}
          <div className="blended-playbook">
            <button
              className="playbook-toggle"
              onClick={() => setShowPlaybook(!showPlaybook)}
            >
              <Layers className="playbook-icon"
                style={{ color: brandColors.primary }} />
              <span>{act4Data.blended_playbook.title}</span>
              <span className="toggle-chevron">
                {showPlaybook ? '▲' : '▼'}
              </span>
            </button>

            {showPlaybook && (
              <div className="playbook-layers fade-in">
                {act4Data.blended_playbook.layers.map((layer, idx) => (
                  <div key={idx} className="playbook-layer">
                    <div className="layer-header">
                      <span className="layer-name">{layer.name}</span>
                      <span className="layer-pct"
                        style={{ color: brandColors.primary }}>
                        {layer.budget_pct}%
                      </span>
                    </div>
                    <div className="layer-bar-bg">
                      <div
                        className="layer-bar-fill"
                        style={{
                          width: `${layer.budget_pct}%`,
                          background: brandColors.primary
                        }}
                      />
                    </div>
                    <p className="layer-desc">{layer.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Per-market breakdown */}
          <div className="market-breakdown">
            <h4 className="breakdown-title">Per-Market Playbook</h4>
            {selectedMarkets.map(marketId => {
              const market = act4Data.markets.find(m => m.id === marketId);
              if (!market) return null;
              return (
                <div key={marketId} className="breakdown-row">
                  <div className="breakdown-market">
                    <span className="breakdown-emoji">{market.emoji}</span>
                    <span className="breakdown-name">{market.name}</span>
                  </div>
                  <div className="breakdown-angle"
                    style={{
                      background: brandColors.light,
                      color: brandColors.primary
                    }}>
                    {market.recommended_angle}
                  </div>
                  <div className="breakdown-metrics">
                    <span className="breakdown-metric">
                      ${market.budget.toLocaleString()}
                    </span>
                    <span className="breakdown-metric green">
                      {market.predicted_roas}x ROAS
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Story Complete Card */}
      {storyComplete && (
        <div className="story-complete-card fade-in">
          <div className="complete-header">
            <Trophy className="complete-trophy" />
            <div>
              <h2 className="complete-title">
                Story Complete! 🎉
              </h2>
              <p className="complete-subtitle">
                {brandData.brand.name}'s full 4-act journey is mapped
              </p>
            </div>
          </div>

          <div className="complete-journey">
            <div className="journey-act">
              <div className="journey-num"
                style={{ background: brandColors.primary }}>1</div>
              <div className="journey-content">
                <p className="journey-act-title">Audience Discovery</p>
                <p className="journey-act-value">
                  {brandData.act1.strategies.find(
                    s => s.id === selectedStrategy
                  )?.label || 'Completed'}
                </p>
              </div>
              <CheckCircle className="journey-check" />
            </div>

            <div className="journey-connector" />

            <div className="journey-act">
              <div className="journey-num"
                style={{ background: brandColors.primary }}>2</div>
              <div className="journey-content">
                <p className="journey-act-title">Creative Bake-off</p>
                <p className="journey-act-value">
                  {winningCreative || 'Completed'}
                </p>
              </div>
              <CheckCircle className="journey-check" />
            </div>

            <div className="journey-connector" />

            <div className="journey-act">
              <div className="journey-num"
                style={{ background: brandColors.primary }}>3</div>
              <div className="journey-content">
                <p className="journey-act-title">Performance Diagnosis</p>
                <p className="journey-act-value">
                  {Object.values(brandData.act3.scenarios)
                    .flatMap(s => s.recovery_strategies)
                    .find(r => r.id === recoveryStrategy)?.label ||
                    'Completed'}
                </p>
              </div>
              <CheckCircle className="journey-check" />
            </div>

            <div className="journey-connector" />

            <div className="journey-act">
              <div className="journey-num"
                style={{ background: brandColors.primary }}>4</div>
              <div className="journey-content">
                <p className="journey-act-title">Regional Expansion</p>
                <p className="journey-act-value">
                  {selectedMarkets.map(id =>
                    act4Data.markets.find(m => m.id === id)?.name
                  ).join(', ')}
                </p>
              </div>
              <CheckCircle className="journey-check" />
            </div>
          </div>

          <div className="complete-stats">
            <div className="complete-stat">
              <p className="cstat-value"
                style={{ color: brandColors.primary }}>
                {storyState.act1.selectedAudiences?.length || 0}
              </p>
              <p className="cstat-label">Audiences Discovered</p>
            </div>
            <div className="complete-stat">
              <p className="cstat-value"
                style={{ color: brandColors.primary }}>
                {storyState.act2.selectedCreatives?.length || 0}
              </p>
              <p className="cstat-label">Creatives Tested</p>
            </div>
            <div className="complete-stat">
              <p className="cstat-value"
                style={{ color: brandColors.primary }}>
                {selectedMarkets.length}
              </p>
              <p className="cstat-label">Markets Launched</p>
            </div>
            <div className="complete-stat">
              <p className="cstat-value"
                style={{ color: '#4caf50' }}>
                {getAvgPredictedRoas()}x
              </p>
              <p className="cstat-label">Avg Predicted ROAS</p>
            </div>
          </div>
        </div>
      )}

      {/* Launch Button */}
      {!storyComplete ? (
        <button
          className={`proceed-btn ${selectedMarkets.length === 0 ? 'disabled' : ''}`}
          onClick={handleCompleteStory}
          disabled={selectedMarkets.length === 0}
          style={selectedMarkets.length > 0 ? {
            background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})`
          } : {}}
        >
          {selectedMarkets.length > 0 ? (
            <>
              <Trophy className="proceed-icon" />
              Launch Expansion in {selectedMarkets.length} Market
              {selectedMarkets.length > 1 ? 's' : ''}
              <ArrowRight className="proceed-icon" />
            </>
          ) : (
            'Select at least 1 market to launch'
          )}
        </button>
      ) : (
        <div className="story-done-actions">
          <p className="done-text">
            🎊 Explore another brand story or restart this one
          </p>
        </div>
      )}
    </div>
  );
}

export default Act4;