import React, { useState, useEffect } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import {
  ArrowRight, ArrowLeft, Brain, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Zap, Target
} from 'lucide-react';
import { simulatePerformance } from '../../utils/performanceSimulator';
import '../../styles/Steps.css';

function Step4_PerformanceIntelligence() {
  const {
    productData,
    selectedAudiences,
    selectedCreative,
    performancePrediction,
    setPerformancePrediction,
    recoveryStrategy,
    setRecoveryStrategy,
    nextStep,
    prevStep
  } = usePresentation();

  const [simulating, setSimulating] = useState(true);
  const [showDiagnosis, setShowDiagnosis] = useState(false);

  useEffect(() => {
    // Simulate LCBM performance prediction
    setSimulating(true);
    setTimeout(() => {
      const prediction = simulatePerformance(
        productData,
        selectedAudiences,
        selectedCreative
      );
      setPerformancePrediction(prediction);
      setSimulating(false);
    }, 2000);
  }, [productData, selectedAudiences, selectedCreative, setPerformancePrediction]);

  const handleRevealDiagnosis = () => {
    setShowDiagnosis(true);
  };

  const handleSelectRecovery = (strategyId) => {
    setRecoveryStrategy(strategyId);
  };

  const handleContinue = () => {
    if (recoveryStrategy) {
      nextStep();
    }
  };

  if (simulating) {
    return (
      <div className="step-container">
        <div className="analyzing-state">
          <div className="analyzing-icon">
            <Brain className="icon spinning" />
          </div>
          <h2 className="analyzing-title">LCBM Simulating Performance...</h2>
          <p className="analyzing-desc">
            Predicting 6-week campaign metrics based on your choices
          </p>
          <div className="progress-bar-anim">
            <div className="progress-fill" />
          </div>
        </div>
      </div>
    );
  }

  if (!performancePrediction) return null;

  const getStatusColor = (status) => {
    if (status === 'WINNING') return '#4caf50';
    if (status === 'UNDERPERFORMING') return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-badge">Step 4 of 5</div>
        <h1 className="step-title">Performance Intelligence</h1>
        <p className="step-description">
          LCBM has simulated {performancePrediction.weeks_analyzed}-week performance
          based on your campaign setup
        </p>
      </div>

      {/* Context Summary */}
      <div className="model-output-box">
        <div className="model-header">
          <Brain className="model-icon" />
          <div>
            <h3 className="model-title">🤖 LCBM Performance Simulation</h3>
            <p className="model-subtitle">
              {performancePrediction.weeks_analyzed}-week prediction
            </p>
          </div>
        </div>
        <div className="context-summary-grid">
          <div className="context-item-step4">
            <span className="context-label-step4">Product:</span>
            <span className="context-value-step4">{productData.productName}</span>
          </div>
          <div className="context-item-step4">
            <span className="context-label-step4">Audiences:</span>
            <span className="context-value-step4">
              {selectedAudiences.length} selected
            </span>
          </div>
          <div className="context-item-step4">
            <span className="context-label-step4">Creative:</span>
            <span className="context-value-step4">
              {selectedCreative?.split('_')[0] || 'Selected'}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Tracks */}
      <div className="performance-section">
        <h3 className="section-title-inline">
          <TrendingUp className="inline-icon" />
          Predicted Performance by Track
        </h3>

        <div className="tracks-grid-step4">
          {performancePrediction.tracks.map((track, idx) => (
            <div key={idx} className="track-card-step4">
              <div className="track-header-step4">
                <h4 className="track-name-step4">{track.name}</h4>
                <div
                  className="track-status-step4"
                  style={{
                    background: `${getStatusColor(track.status)}20`,
                    color: getStatusColor(track.status)
                  }}
                >
                  {track.status === 'WINNING' ? (
                    <TrendingUp className="status-icon-step4" />
                  ) : (
                    <TrendingDown className="status-icon-step4" />
                  )}
                  {track.status}
                </div>
              </div>

              {/* Metrics */}
              <div className="metrics-grid-step4">
                <div className="metric-box">
                  <span className="metric-label-step4">CPA</span>
                  <span
                    className="metric-value-step4"
                    style={{
                      color: track.cpa < 15 ? '#4caf50' : track.cpa < 20 ? '#ff9800' : '#f44336'
                    }}
                  >
                    ${track.cpa}
                  </span>
                </div>
                <div className="metric-box">
                  <span className="metric-label-step4">ROAS</span>
                  <span
                    className="metric-value-step4"
                    style={{
                      color: track.roas >= 3 ? '#4caf50' : track.roas >= 2 ? '#ff9800' : '#f44336'
                    }}
                  >
                    {track.roas}x
                  </span>
                </div>
                <div className="metric-box">
                  <span className="metric-label-step4">CTR</span>
                  <span className="metric-value-step4">{track.ctr}</span>
                </div>
                <div className="metric-box">
                  <span className="metric-label-step4">Engagement</span>
                  <span className="metric-value-step4">{track.engagement}</span>
                </div>
              </div>

              {/* Insight */}
              <div className="track-insight-step4">
                <p>{track.insight}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diagnosis Section */}
      <div className="diagnosis-section-step4">
        {!showDiagnosis ? (
          <button className="reveal-diagnosis-btn" onClick={handleRevealDiagnosis}>
            <Brain className="btn-icon" />
            Run LCBM Diagnosis
          </button>
        ) : (
          <div className="diagnosis-revealed fade-in">
            <div className="diagnosis-header-step4">
              <AlertTriangle className="diag-icon" />
              <div>
                <h3 className="diag-title">{performancePrediction.diagnosis.title}</h3>
                <p className="diag-type">{performancePrediction.diagnosis.type}</p>
              </div>
            </div>

            <div className="diagnosis-body-step4">
              <div className="diag-section-step4 not-problem">
                <CheckCircle className="section-icon-step4" />
                <div>
                  <p className="section-label-step4">Not the problem:</p>
                  <p className="section-text-step4">
                    {performancePrediction.diagnosis.not_the_problem}
                  </p>
                </div>
              </div>

              <div className="diag-section-step4 root-cause">
                <AlertTriangle className="section-icon-step4" />
                <div>
                  <p className="section-label-step4">Root Cause:</p>
                  <p className="section-text-step4">
                    {performancePrediction.diagnosis.root_cause}
                  </p>
                </div>
              </div>

              <div className="diag-section-step4 recommendation">
                <Target className="section-icon-step4" />
                <div>
                  <p className="section-label-step4">Recommendation:</p>
                  <p className="section-text-step4">
                    {performancePrediction.diagnosis.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recovery Strategies */}
      {showDiagnosis && (
        <div className="recovery-section-step4 fade-in">
          <h3 className="section-title-inline">
            <Zap className="inline-icon" />
            Recovery Strategy Options
          </h3>

          <div className="recovery-grid-step4">
            {performancePrediction.recoveryStrategies.map((strategy) => {
              const isSelected = recoveryStrategy === strategy.id;

              return (
                <button
                  key={strategy.id}
                  className={`recovery-card-step4 ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectRecovery(strategy.id)}
                >
                  <div className="recovery-header-step4">
                    <span className="recovery-emoji">{strategy.emoji}</span>
                    <h4 className="recovery-label">{strategy.label}</h4>
                    {isSelected && (
                      <CheckCircle className="recovery-check" />
                    )}
                  </div>

                  <p className="recovery-desc">{strategy.description}</p>

                  <div className="recovery-lift">
                    <TrendingUp className="lift-icon" />
                    <span>{strategy.expected_lift}</span>
                  </div>

                  <div className="recovery-impact">
                    <span className="impact-label">Impact:</span>
                    <span className="impact-text">{strategy.impact}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Impact Preview */}
      {recoveryStrategy && (
        <div className="impact-preview fade-in">
          <div className="impact-header">
            <Target className="impact-icon" />
            <h3 className="impact-title">What Happens Next</h3>
          </div>
          <p className="impact-text">
            In Step 5, LCBM will generate market-specific playbooks for regional
            expansion, incorporating your recovery strategy into the recommendations.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="form-actions">
        <button className="btn-secondary" onClick={prevStep}>
          <ArrowLeft className="btn-icon" />
          Back to Creative
        </button>
        <button
          className="btn-primary"
          onClick={handleContinue}
          disabled={!recoveryStrategy}
        >
          Continue to Market Intelligence
          <ArrowRight className="btn-icon" />
        </button>
      </div>
    </div>
  );
}

export default Step4_PerformanceIntelligence;