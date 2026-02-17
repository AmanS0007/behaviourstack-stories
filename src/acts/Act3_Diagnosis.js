import React, { useState } from 'react';
import { useStory } from '../context/StoryContext';
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  ArrowRight, Brain, Zap, Target, Info, Activity, BarChart2, RefreshCw
} from 'lucide-react';
import '../styles/Act3.css';

function Act3({ brandData, addChatMessage }) {
  const { storyState, updateActState, completeAct, setCurrentAct } = useStory();
  const [selectedRecovery, setSelectedRecovery] = useState(
    storyState.act3.recoveryStrategy || null
  );

  const [diagnosisRevealed, setDiagnosisRevealed] = useState(false);

  const act3Data = brandData.act3;
  const brandColors = brandData.brand.colors;
  const selectedStrategy = storyState.act1.selectedStrategy;
  const winningCreative = storyState.act2.winningCreative;

  // Get correct scenario based on Act 1 strategy
  const getScenario = () => {
    if (!selectedStrategy) {
      return Object.values(act3Data.scenarios)[0];
    }
    return act3Data.scenarios[selectedStrategy] ||
      Object.values(act3Data.scenarios)[0];
  };

  const scenario = getScenario();

  const getTrackStatus = (status) => {
    switch (status) {
      case 'WINNING': return { color: '#4caf50', bg: '#e8f5e9', icon: TrendingUp };
      case 'GOOD': return { color: '#2196f3', bg: '#e3f2fd', icon: TrendingUp };
      case 'PROFITABLE': return { color: '#ff9800', bg: '#fff3e0', icon: Activity };
      case 'STRUGGLING': return { color: '#ff9800', bg: '#fff3e0', icon: TrendingDown };
      case 'UNDERPERFORMING': return { color: '#f44336', bg: '#ffebee', icon: TrendingDown };
      case 'FAILING': return { color: '#f44336', bg: '#ffebee', icon: TrendingDown };
      default: return { color: '#888', bg: '#f5f5f5', icon: Activity };
    }
  };

  const getRoasColor = (roas) => {
    if (roas >= 3) return '#4caf50';
    if (roas >= 2) return '#ff9800';
    return '#f44336';
  };

  const getCpaColor = (cpa) => {
    if (cpa <= 15) return '#4caf50';
    if (cpa <= 30) return '#ff9800';
    return '#f44336';
  };

  const handleRevealDiagnosis = () => {
    setDiagnosisRevealed(true);
    addChatMessage({
      type: 'user',
      content: 'What does the data tell us? Run the diagnosis.'
    });
    addChatMessage({
      type: 'assistant',
      content: `LCBM diagnosis complete. Issue identified: ${scenario.diagnosis.type}. ${scenario.diagnosis.root_cause}`
    });
  };

  const handleSelectRecovery = (strategyId) => {
    const recovery = scenario.recovery_strategies.find(
      r => r.id === strategyId
    );
    setSelectedRecovery(strategyId);
    updateActState('act3', {
      recoveryStrategy: strategyId,
      diagnosisPath: scenario.diagnosis.type,
      selectedMetrics: scenario.tracks
    });
    addChatMessage({
      type: 'user',
      content: `Let's go with "${recovery.label}" as our recovery strategy`
    });
    addChatMessage({
      type: 'assistant',
      content: `Recovery plan activated! "${recovery.label}" — ${recovery.description} Expected lift: ${recovery.expected_lift}`
    });
  };

  const handleProceedToAct4 = () => {
    if (!selectedRecovery) return;
    completeAct(3);
    setCurrentAct(4);
    addChatMessage({
      type: 'assistant',
      content: `Act 3 complete! Recovery strategy locked in. Now let's take ${brandData.brand.name} to new regional markets in Act 4.`
    });
  };

  return (
    <div className="act3">
      {/* Context from Previous Acts */}
      <div className="previous-acts-context">
        <div className="prev-act-pill">
          <span className="prev-act-num">Act 1</span>
          <span className="prev-act-value">
            {selectedStrategy
              ? brandData.act1.strategies.find(
                  s => s.id === selectedStrategy
                )?.label
              : 'No strategy selected'}
          </span>
        </div>
        <ArrowRight className="prev-act-arrow" />
        <div className="prev-act-pill">
          <span className="prev-act-num">Act 2</span>
          <span className="prev-act-value">
            {winningCreative || 'No winner selected'}
          </span>
        </div>
        <ArrowRight className="prev-act-arrow" />
        <div className="prev-act-pill active"
          style={{
            background: brandColors.light,
            borderColor: brandColors.primary + '60'
          }}>
          <span className="prev-act-num"
            style={{ color: brandColors.primary }}>
            Act 3
          </span>
          <span className="prev-act-value">Performance Results</span>
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
        <p className="context-text">
          {act3Data.context} —{' '}
          <strong>{act3Data.weeks_running} weeks of data</strong> are in.
        </p>
      </div>

      {/* Performance Tracks */}
      <div className="card">
        <div className="card-header-row">
          <div className="card-icon-wrap"
            style={{ background: brandColors.primary }}>
            <BarChart2 className="icon" />
          </div>
          <div>
            <h3 className="card-title">Campaign Performance</h3>
            <p className="card-subtitle">
              {act3Data.weeks_running}-week results across all tracks
              {selectedStrategy && (
                <span> · Based on your "{
                  brandData.act1.strategies.find(
                    s => s.id === selectedStrategy
                  )?.label
                }" strategy</span>
              )}
            </p>
          </div>
        </div>

        {/* Track Cards */}
        <div className="tracks-grid">
          {scenario.tracks.map((track, idx) => {
            const statusConfig = getTrackStatus(track.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={idx} className="track-card"
                style={{ borderColor: statusConfig.color + '40' }}>
                {/* Track Header */}
                <div className="track-header">
                  <h4 className="track-name">{track.name}</h4>
                  <div className="track-status-badge"
                    style={{
                      background: statusConfig.bg,
                      color: statusConfig.color
                    }}>
                    <StatusIcon className="status-icon" />
                    {track.status}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="metrics-grid">
                  <div className="metric-item">
                    <p className="metric-label">CPA</p>
                    <p className="metric-value"
                      style={{ color: getCpaColor(track.cpa) }}>
                      ${track.cpa}
                    </p>
                  </div>

                  <div className="metric-item">
                    <p className="metric-label">ROAS</p>
                    <p className="metric-value"
                      style={{ color: getRoasColor(track.roas) }}>
                      {track.roas}x
                    </p>
                  </div>

                  {track.ctr && (
                    <div className="metric-item">
                      <p className="metric-label">CTR</p>
                      <p className="metric-value">{track.ctr}</p>
                    </div>
                  )}

                  {track.repeat_rate && (
                    <div className="metric-item">
                      <p className="metric-label">Repeat Rate</p>
                      <p className="metric-value">{track.repeat_rate}</p>
                    </div>
                  )}

                  {track.aov && (
                    <div className="metric-item">
                      <p className="metric-label">AOV</p>
                      <p className="metric-value">${track.aov}</p>
                    </div>
                  )}

                  {track.upsell_rate && (
                    <div className="metric-item">
                      <p className="metric-label">Upsell Rate</p>
                      <p className="metric-value">{track.upsell_rate}</p>
                    </div>
                  )}

                  {track.app_retention_30d && (
                    <div className="metric-item">
                      <p className="metric-label">30d Retention</p>
                      <p className="metric-value"
                        style={{
                          color: parseInt(track.app_retention_30d) >= 50
                            ? '#4caf50'
                            : parseInt(track.app_retention_30d) >= 30
                            ? '#ff9800'
                            : '#f44336'
                        }}>
                        {track.app_retention_30d}
                      </p>
                    </div>
                  )}
                </div>

                {/* Metric Bars */}
                <div className="metric-bars">
                  <div className="metric-bar-row">
                    <span className="bar-label">ROAS</span>
                    <div className="bar-bg">
                      <div className="bar-fill"
                        style={{
                          width: `${Math.min((track.roas / 5) * 100, 100)}%`,
                          background: getRoasColor(track.roas)
                        }}
                      />
                    </div>
                    <span className="bar-value"
                      style={{ color: getRoasColor(track.roas) }}>
                      {track.roas}x
                    </span>
                  </div>

                  <div className="metric-bar-row">
                    <span className="bar-label">CPA</span>
                    <div className="bar-bg">
                      <div className="bar-fill"
                        style={{
                          width: `${Math.min((track.cpa / 60) * 100, 100)}%`,
                          background: getCpaColor(track.cpa)
                        }}
                      />
                    </div>
                    <span className="bar-value"
                      style={{ color: getCpaColor(track.cpa) }}>
                      ${track.cpa}
                    </span>
                  </div>
                </div>

                {/* Insight */}
                <div className="track-insight"
                  style={{ background: statusConfig.bg }}>
                  <p className="insight-text">{track.insight}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnosis Section */}
      <div className="card diagnosis-card">
        <div className="card-header-row">
          <div className="card-icon-wrap"
            style={{ background: '#6366f1' }}>
            <Brain className="icon" />
          </div>
          <div className="card-header-flex">
            <div>
              <h3 className="card-title">LCBM Diagnosis Engine</h3>
              <p className="card-subtitle">
                AI analysis of what's really happening beneath the metrics
              </p>
            </div>
            {!diagnosisRevealed && (
              <button
                className="reveal-btn"
                onClick={handleRevealDiagnosis}
                style={{ background: brandColors.primary }}
              >
                <Brain className="btn-icon" />
                Run Diagnosis
              </button>
            )}
          </div>
        </div>

        {!diagnosisRevealed && (
          <div className="diagnosis-placeholder">
            <Brain className="placeholder-icon" />
            <p className="placeholder-text">
              Click "Run Diagnosis" to reveal what LCBM found
            </p>
            <p className="placeholder-hint">
              The AI will analyze patterns across creative performance,
              audience behavior, and funnel data
            </p>
          </div>
        )}

        {diagnosisRevealed && (
          <div className="diagnosis-content fade-in">
            {/* Diagnosis Type */}
            <div className="diagnosis-type-banner">
              <AlertTriangle className="diag-type-icon" />
              <div>
                <p className="diag-type-label">Issue Identified</p>
                <p className="diag-type-value">
                  {scenario.diagnosis.title}
                </p>
              </div>
            </div>

            {/* What's NOT the problem */}
            <div className="diag-section not-problem">
              <CheckCircle className="diag-section-icon green" />
              <div>
                <p className="diag-section-label">
                  ✓ Not the problem
                </p>
                <p className="diag-section-text">
                  {scenario.diagnosis.not_the_problem}
                </p>
              </div>
            </div>

            {/* Root Cause */}
            <div className="diag-section root-cause">
              <AlertTriangle className="diag-section-icon amber" />
              <div>
                <p className="diag-section-label">
                  Root Cause
                </p>
                <p className="diag-section-text">
                  {scenario.diagnosis.root_cause}
                </p>
              </div>
            </div>

            {/* Funnel Insight */}
            <div className="diag-section funnel">
              <Activity className="diag-section-icon blue" />
              <div>
                <p className="diag-section-label">
                  Funnel Analysis
                </p>
                <p className="diag-section-text">
                  {scenario.diagnosis.funnel_insight}
                </p>
              </div>
            </div>

            {/* Social Agents */}
            <div className="social-agents-bubble">
              <div className="social-agents-header">
                <Brain className="sa-icon" />
                <span>Social Agents Verdict</span>
              </div>
              <p className="sa-text">
                "{scenario.diagnosis.social_agents}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recovery Strategies */}
      {diagnosisRevealed && (
        <div className="card fade-in">
          <div className="card-header-row">
            <div className="card-icon-wrap"
              style={{ background: '#e63946' }}>
              <RefreshCw className="icon" />
            </div>
            <div>
              <h3 className="card-title">Recovery Strategy</h3>
              <p className="card-subtitle">
                Transsuasion AI has generated recovery options —
                choose your path forward
              </p>
            </div>
          </div>

          <div className="recovery-grid">
            {scenario.recovery_strategies.map((recovery) => {
              const isSelected = selectedRecovery === recovery.id;

              return (
                <button
                  key={recovery.id}
                  className={`recovery-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectRecovery(recovery.id)}
                  style={isSelected ? {
                    borderColor: brandColors.primary,
                    background: brandColors.light
                  } : {}}
                >
                  {/* Recovery Header */}
                  <div className="recovery-header">
                    <span className="recovery-emoji">{recovery.emoji}</span>
                    <h4 className="recovery-label">{recovery.label}</h4>
                    {isSelected && (
                      <CheckCircle className="recovery-check"
                        style={{ color: brandColors.primary }} />
                    )}
                  </div>

                  {/* Description */}
                  <p className="recovery-desc">{recovery.description}</p>

                  {/* Transsuasion Copy */}
                  <div className="transsuasion-copy"
                    style={{
                      background: isSelected
                        ? brandColors.light
                        : '#f5f5f5',
                      borderColor: isSelected
                        ? brandColors.primary + '40'
                        : '#e0e0e0'
                    }}>
                    <Zap className="copy-icon"
                      style={{ color: brandColors.primary }} />
                    <div>
                      <p className="copy-label">
                        Transsuasion Copy
                      </p>
                      <p className="copy-text">
                        "{recovery.transsuasion_copy}"
                      </p>
                    </div>
                  </div>

                  {/* Bundle / Email / App changes */}
                  {recovery.bundle_idea && (
                    <div className="recovery-extra">
                      <Target className="extra-icon" />
                      <span>{recovery.bundle_idea}</span>
                    </div>
                  )}
                  {recovery.email_sequence && (
                    <div className="recovery-extra">
                      <Target className="extra-icon" />
                      <span>{recovery.email_sequence}</span>
                    </div>
                  )}
                  {recovery.app_change && (
                    <div className="recovery-extra">
                      <Target className="extra-icon" />
                      <span>{recovery.app_change}</span>
                    </div>
                  )}

                  {/* Expected Lift */}
                  <div className="expected-lift"
                    style={{
                      background: '#e8f5e9',
                      borderColor: '#a5d6a7'
                    }}>
                    <TrendingUp className="lift-icon" />
                    <span className="lift-text">
                      {recovery.expected_lift}
                    </span>
                  </div>

                  {/* Act 4 Impact */}
                  {isSelected && (
                    <div className="act4-impact fade-in"
                      style={{
                        background: brandColors.light,
                        borderColor: brandColors.primary + '40'
                      }}>
                      <p className="impact-label">
                        → Impact on Act 4
                      </p>
                      <p className="impact-value">
                        {recovery.impact_act4.replace(/_/g, ' ')}
                        {' '}positioning activated
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Proceed Button */}
      <button
        className={`proceed-btn ${!selectedRecovery ? 'disabled' : ''}`}
        onClick={handleProceedToAct4}
        disabled={!selectedRecovery}
        style={selectedRecovery ? {
          background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})`
        } : {}}
      >
        {selectedRecovery ? (
          <>
            <CheckCircle className="proceed-icon" />
            Proceed to Act 4: Regional Expansion
            <ArrowRight className="proceed-icon" />
          </>
        ) : (
          diagnosisRevealed
            ? 'Select a recovery strategy to continue'
            : 'Run diagnosis first to unlock recovery strategies'
        )}
      </button>
    </div>
  );
}

export default Act3;