import React, { useState } from 'react';
import { useStory } from '../context/StoryContext';
import {
  Users, Brain, TrendingUp, CheckCircle,
  ArrowRight, Zap, AlertTriangle, Target,
  ChevronDown, ChevronUp, Info
} from 'lucide-react';
import '../styles/Act1.css';

function Act1({ brandData, addChatMessage }) {
  const { storyState, updateActState, completeAct, setCurrentAct } = useStory();
  const [expandedAudience, setExpandedAudience] = useState(null);
  const [showSocialAgents, setShowSocialAgents] = useState(false);
  const [strategySelected, setStrategySelected] = useState(
    storyState.act1.selectedStrategy
  );
  const [selectedAudiences, setSelectedAudiences] = useState(
    storyState.act1.selectedAudiences || []
  );

  const act1Data = brandData.act1;
//   const brandColors = brandData.brand.colors;

  const handleAudienceToggle = (audienceId) => {
    const updated = selectedAudiences.includes(audienceId)
      ? selectedAudiences.filter(id => id !== audienceId)
      : [...selectedAudiences, audienceId];
    setSelectedAudiences(updated);
    updateActState('act1', { selectedAudiences: updated });
  };

  const handleStrategySelect = (strategyId) => {
    const strategy = act1Data.strategies.find(s => s.id === strategyId);
    setStrategySelected(strategyId);
    updateActState('act1', {
      selectedStrategy: strategyId,
      crossoverRate: act1Data.crossover_rate,
      bridgeSegment: act1Data.bridge_segment
    });
    addChatMessage({
      type: 'user',
      content: `I want to go with the "${strategy.label}" strategy`
    });
    addChatMessage({
      type: 'assistant',
      content: `Great choice! "${strategy.label}" means ${strategy.description} This will shape which creatives we recommend in Act 2.`
    });
  };

  const handleProceedToAct2 = () => {
    if (!strategySelected) return;
    completeAct(1);
    setCurrentAct(2);
    addChatMessage({
      type: 'assistant',
      content: `Act 1 complete! Based on your "${strategySelected}" strategy and ${selectedAudiences.length} selected audiences, I've pre-loaded the best creative recommendations for Act 2. Let's go!`
    });
  };

  const crossoverPct = Math.round(act1Data.crossover_rate * 100);
  const newAudiencePct = 100 - crossoverPct;

  return (
    <div className="act1">
      {/* Context Banner */}
      <div className="context-banner"
        style={{ background: brandData.brand.colors.light,
                 borderColor: brandData.brand.colors.primary + '40' }}>
        <Info className="context-icon"
          style={{ color: brandData.brand.colors.primary }} />
        <p className="context-text">{act1Data.context}</p>
      </div>

      {/* Crossover Analysis */}
      <div className="card crossover-card">
        <div className="card-header-row">
          <div className="card-icon-wrap"
            style={{ background: brandData.brand.colors.primary }}>
            <Brain className="icon" />
          </div>
          <div>
            <h3 className="card-title">LCBM Crossover Analysis</h3>
            <p className="card-subtitle">
              How many existing customers will buy the new product?
            </p>
          </div>
        </div>

        <div className="crossover-stats">
          <div className="crossover-stat">
            <div className="stat-bar-wrap">
              <div className="stat-bar-label">
                <span>Existing customers who'd buy new product</span>
                <span className="stat-pct" style={{ color: brandData.brand.colors.primary }}>
                  {crossoverPct}%
                </span>
              </div>
              <div className="stat-bar-bg">
                <div className="stat-bar-fill"
                  style={{
                    width: `${crossoverPct}%`,
                    background: brandData.brand.colors.primary
                  }}
                />
              </div>
              <p className="stat-count">
                ~{act1Data.crossover_count.toLocaleString()} of {act1Data.existing_customers.toLocaleString()} customers
              </p>
            </div>
          </div>

          <div className="crossover-stat">
            <div className="stat-bar-wrap">
              <div className="stat-bar-label">
                <span>New audience opportunity</span>
                <span className="stat-pct" style={{ color: '#6366f1' }}>
                  {newAudiencePct}%
                </span>
              </div>
              <div className="stat-bar-bg">
                <div className="stat-bar-fill"
                  style={{ width: `${newAudiencePct}%`, background: '#6366f1' }}
                />
              </div>
              <p className="stat-count">Untapped market outside existing base</p>
            </div>
          </div>
        </div>

        {/* Bridge Segment */}
        <div className="bridge-segment"
          style={{ background: brandData.brand.colors.light,
                   borderColor: brandData.brand.colors.primary + '60' }}>
          <div className="bridge-header">
            <Zap className="bridge-icon"
              style={{ color: brandData.brand.colors.primary }} />
            <h4 className="bridge-title">
              Bridge Segment: {act1Data.bridge_segment.name}
            </h4>
            <span className="bridge-fit"
              style={{ background: brandData.brand.colors.primary }}>
              {act1Data.bridge_segment.fit_score} Fit Score
            </span>
          </div>
          <p className="bridge-desc">{act1Data.bridge_segment.description}</p>
          <p className="bridge-insight">
            💡 {act1Data.bridge_segment.insight}
          </p>
          <p className="bridge-size">
            {act1Data.bridge_segment.size.toLocaleString()} people in this segment
          </p>
        </div>
      </div>

      {/* Discovered Audiences */}
      <div className="card">
        <div className="card-header-row">
          <div className="card-icon-wrap" style={{ background: '#6366f1' }}>
            <Users className="icon" />
          </div>
          <div>
            <h3 className="card-title">Discovered Audience Segments</h3>
            <p className="card-subtitle">
              Select audiences to target — your choices shape Act 2 creative recommendations
            </p>
          </div>
        </div>

        <div className="audiences-grid">
          {act1Data.new_audiences.map((audience) => {
            const isSelected = selectedAudiences.includes(audience.id);
            const isExpanded = expandedAudience === audience.id;

            return (
              <div
                key={audience.id}
                className={`audience-card ${isSelected ? 'selected' : ''}`}
                style={isSelected ? {
                  borderColor: brandData.brand.colors.primary,
                  background: brandData.brand.colors.light
                } : {}}
              >
                {/* Audience Header */}
                <div className="audience-card-header">
                  <div className="audience-left">
                    <span className="audience-emoji">{audience.icon}</span>
                    <div>
                      <h4 className="audience-name">{audience.name}</h4>
                      <p className="audience-demo">{audience.demographics}</p>
                    </div>
                  </div>
                  <div className="audience-right">
                    <div className="fit-score-wrap">
                      <span className="fit-score-value"
                        style={{ color: brandData.brand.colors.primary }}>
                        {audience.fit_score}
                      </span>
                      <span className="fit-score-label">fit</span>
                    </div>
                    <p className="audience-size">{audience.size}</p>
                  </div>
                </div>

                {/* Psychographics */}
                <p className="audience-psycho">{audience.psychographics}</p>

                {/* Affinity Preview */}
                <div className="affinity-bars">
                  {audience.affinities.slice(0, 2).map((aff, idx) => (
                    <div key={idx} className="affinity-bar-row">
                      <span className="affinity-name">{aff.name}</span>
                      <div className="affinity-bar-bg">
                        <div
                          className="affinity-bar-fill"
                          style={{
                            width: `${aff.strength}%`,
                            background: brandData.brand.colors.primary
                          }}
                        />
                      </div>
                      <span className="affinity-score">{aff.strength}</span>
                    </div>
                  ))}
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="audience-expanded fade-in">
                    {/* All Affinities */}
                    <div className="expanded-section">
                      <h5 className="expanded-title">All Content Affinities</h5>
                      {audience.affinities.map((aff, idx) => (
                        <div key={idx} className="affinity-detail">
                          <div className="affinity-bar-row">
                            <span className="affinity-name">{aff.name}</span>
                            <div className="affinity-bar-bg">
                              <div
                                className="affinity-bar-fill"
                                style={{
                                  width: `${aff.strength}%`,
                                  background: brandData.brand.colors.primary
                                }}
                              />
                            </div>
                            <span className="affinity-score">{aff.strength}</span>
                          </div>
                          <p className="affinity-reason">
                            <Zap className="reason-icon" /> {aff.reason}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Top Content */}
                    <div className="expanded-section">
                      <h5 className="expanded-title">Top Engaging Content</h5>
                      <div className="content-chips">
                        {audience.top_content.map((c, idx) => (
                          <span key={idx} className="content-chip"
                            style={{
                              background: brandData.brand.colors.light,
                              color: brandData.brand.colors.primary,
                              borderColor: brandData.brand.colors.primary + '40'
                            }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Angle */}
                    <div className="recommended-angle"
                      style={{ borderColor: brandData.brand.colors.primary + '40',
                               background: brandData.brand.colors.light }}>
                      <Target className="angle-icon"
                        style={{ color: brandData.brand.colors.primary }} />
                      <div>
                        <p className="angle-label">Recommended Creative Angle</p>
                        <p className="angle-value">{audience.recommended_angle}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Actions */}
                <div className="audience-card-actions">
                  <button
                    className="expand-btn"
                    onClick={() => setExpandedAudience(
                      isExpanded ? null : audience.id
                    )}
                  >
                    {isExpanded ? (
                      <><ChevronUp className="btn-icon" /> Less</>
                    ) : (
                      <><ChevronDown className="btn-icon" /> Affinity Details</>
                    )}
                  </button>

                  <button
                    className={`select-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleAudienceToggle(audience.id)}
                    style={isSelected ? {
                      background: brandData.brand.colors.primary,
                      borderColor: brandData.brand.colors.primary
                    } : {}}
                  >
                    {isSelected ? (
                      <><CheckCircle className="btn-icon" /> Selected</>
                    ) : (
                      <>+ Select Audience</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {selectedAudiences.length > 0 && (
          <div className="selection-summary"
            style={{ background: brandData.brand.colors.light,
                     borderColor: brandData.brand.colors.primary + '60' }}>
            <CheckCircle className="summary-icon"
              style={{ color: brandData.brand.colors.primary }} />
            <p className="summary-text">
              <strong>{selectedAudiences.length} audience{selectedAudiences.length > 1 ? 's' : ''} selected</strong>
              {' '}— These will influence creative recommendations in Act 2
            </p>
          </div>
        )}
      </div>

      {/* Social Agents Insight */}
      <div className="card social-agents-card">
        <button
          className="social-agents-toggle"
          onClick={() => setShowSocialAgents(!showSocialAgents)}
        >
          <div className="social-agents-left">
            <div className="social-agents-icon">
              <Brain className="icon" />
            </div>
            <div>
              <h3 className="card-title">Social Agents Analysis</h3>
              <p className="card-subtitle">
                AI personas predict how audiences will respond
              </p>
            </div>
          </div>
          {showSocialAgents
            ? <ChevronUp className="toggle-icon" />
            : <ChevronDown className="toggle-icon" />
          }
        </button>

        {showSocialAgents && (
          <div className="social-agents-content fade-in">
            <div className="insight-bubble">
              <AlertTriangle className="insight-icon" />
              <p className="insight-text">"{act1Data.social_agents_insight}"</p>
            </div>
          </div>
        )}
      </div>

      {/* Strategy Selection */}
      <div className="card strategy-card">
        <div className="card-header-row">
          <div className="card-icon-wrap"
            style={{ background: brandData.brand.colors.primary }}>
            <TrendingUp className="icon" />
          </div>
          <div>
            <h3 className="card-title">Choose Your Strategy</h3>
            <p className="card-subtitle">
              This decision will cascade through Acts 2, 3, and 4
            </p>
          </div>
        </div>

        <div className="strategy-grid">
          {act1Data.strategies.map((strategy) => {
            const isSelected = strategySelected === strategy.id;
            return (
              <button
                key={strategy.id}
                className={`strategy-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleStrategySelect(strategy.id)}
                style={isSelected ? {
                  borderColor: brandData.brand.colors.primary,
                  background: brandData.brand.colors.light
                } : {}}
              >
                <div className="strategy-header">
                  <span className="strategy-emoji">{strategy.emoji}</span>
                  <h4 className="strategy-label">{strategy.label}</h4>
                  {isSelected && (
                    <CheckCircle className="strategy-check"
                      style={{ color: brandData.brand.colors.primary }} />
                  )}
                </div>
                <p className="strategy-desc">{strategy.description}</p>
                <div className="strategy-target">
                  <Target className="target-icon" />
                  <span>{strategy.target}</span>
                </div>
                <div className="strategy-pitch">
                  <span className="pitch-label">Pitch:</span>
                  <span className="pitch-value">"{strategy.pitch}"</span>
                </div>
                <div className="strategy-risk">
                  <AlertTriangle className="risk-icon" />
                  <span>{strategy.risks}</span>
                </div>

                {isSelected && (
                  <div className="strategy-impacts fade-in">
                    <p className="impacts-title">
                      Impact on next acts:
                    </p>
                    <div className="impact-chips">
                      <span className="impact-chip">
                        Act 2: {strategy.impacts.act2_creative_filter} creatives recommended
                      </span>
                      <span className="impact-chip">
                        Act 3: ~{strategy.impacts.act3_cpa || strategy.impacts.act3_cpa_jumprope} CPA expected
                      </span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Proceed Button */}
      <button
        className={`proceed-btn ${!strategySelected ? 'disabled' : ''}`}
        onClick={handleProceedToAct2}
        disabled={!strategySelected}
        style={strategySelected ? {
          background: `linear-gradient(135deg, ${brandData.brand.colors.primary}, ${brandData.brand.colors.secondary})`
        } : {}}
      >
        {strategySelected ? (
          <>
            <CheckCircle className="proceed-icon" />
            Proceed to Act 2: Creative Bake-off
            <ArrowRight className="proceed-icon" />
          </>
        ) : (
          <>Select a strategy to continue</>
        )}
      </button>
    </div>
  );
}

export default Act1;