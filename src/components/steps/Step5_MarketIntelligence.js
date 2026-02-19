import React, { useState, useEffect } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import {
  ArrowRight, ArrowLeft, Brain, MapPin, CheckCircle,
  TrendingUp, DollarSign, Target, Trophy
} from 'lucide-react';
import { generateMarketRecommendations } from '../../utils/performanceSimulator';
import '../../styles/Steps.css';

function Step5_MarketIntelligence() {
  const {
    productData,
    selectedAudiences,
    selectedCreative,
    recoveryStrategy,
    selectedMarkets,
    setSelectedMarkets,
    prevStep,
    setCurrentStep
  } = usePresentation();

  const [markets, setMarkets] = useState([]);
  const [analyzing, setAnalyzing] = useState(true);
  const [expandedMarket, setExpandedMarket] = useState(null);
  const [showFinalReport, setShowFinalReport] = useState(false);

  useEffect(() => {
    // Generate market recommendations
    setAnalyzing(true);
    setTimeout(() => {
      const marketData = generateMarketRecommendations(
        productData,
        selectedAudiences,
        selectedCreative,
        recoveryStrategy
      );
      setMarkets(marketData);
      setAnalyzing(false);
    }, 1500);
  }, [productData, selectedAudiences, selectedCreative, recoveryStrategy]);

  const handleToggleMarket = (marketId) => {
    if (selectedMarkets.includes(marketId)) {
      setSelectedMarkets(selectedMarkets.filter(id => id !== marketId));
    } else {
      setSelectedMarkets([...selectedMarkets, marketId]);
    }
  };

  const handleGenerateReport = () => {
    setShowFinalReport(true);
    setCurrentStep(6);
  };

  const getTotalBudget = () => {
    return selectedMarkets.reduce((sum, id) => {
      const market = markets.find(m => m.id === id);
      return sum + (market?.budget_recommendation || 0);
    }, 0);
  };

  const getAvgRoas = () => {
    if (selectedMarkets.length === 0) return 0;
    const avg = selectedMarkets.reduce((sum, id) => {
      const market = markets.find(m => m.id === id);
      return sum + (market?.predicted_roas || 0);
    }, 0) / selectedMarkets.length;
    return avg.toFixed(1);
  };

  if (analyzing) {
    return (
      <div className="step-container">
        <div className="analyzing-state">
          <div className="analyzing-icon">
            <Brain className="icon spinning" />
          </div>
          <h2 className="analyzing-title">LCBM Analyzing Regional Markets...</h2>
          <p className="analyzing-desc">
            Generating market-specific playbooks based on your campaign strategy
          </p>
          <div className="progress-bar-anim">
            <div className="progress-fill" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-badge">Step 5 of 5</div>
        <h1 className="step-title">Market Intelligence</h1>
        <p className="step-description">
          LCBM has identified {markets.length} high-potential markets with
          tailored expansion strategies
        </p>
      </div>

      {/* Campaign Context */}
      <div className="model-output-box">
        <div className="model-header">
          <Brain className="model-icon" />
          <div>
            <h3 className="model-title">🤖 LCBM Regional Analysis</h3>
            <p className="model-subtitle">Market recommendations based on full campaign context</p>
          </div>
        </div>
        <div className="campaign-context-step5">
          <div className="context-flow-step5">
            <div className="flow-item">
              <span className="flow-label">Product</span>
              <span className="flow-value">{productData.productName}</span>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-item">
              <span className="flow-label">Audiences</span>
              <span className="flow-value">{selectedAudiences.length} selected</span>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-item">
              <span className="flow-label">Creative</span>
              <span className="flow-value">AI-optimized</span>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-item">
              <span className="flow-label">Recovery</span>
              <span className="flow-value">Strategy set</span>
            </div>
          </div>
        </div>
      </div>

      {/* Markets Grid */}
      <div className="markets-section-step5">
        <div className="section-header-inline">
          <h3 className="section-title-inline">
            <MapPin className="inline-icon" />
            Market Recommendations
          </h3>
          <span className="selection-count">
            {selectedMarkets.length} selected
          </span>
        </div>

        <div className="markets-grid-step5">
          {markets.map((market) => {
            const isSelected = selectedMarkets.includes(market.id);
            const isExpanded = expandedMarket === market.id;

            return (
              <div
                key={market.id}
                className={`market-card-step5 ${isSelected ? 'selected' : ''}`}
              >
                {/* Market Header */}
                <div className="market-header-step5">
                  <div className="market-left-step5">
                    <span className="market-emoji-step5">{market.emoji}</span>
                    <div>
                      <h4 className="market-name-step5">{market.name}</h4>
                      <p className="market-pop">Pop: {market.population}</p>
                    </div>
                  </div>
                  <div className="market-fit-score">
                    <div className="fit-score-value">{market.fit_score}</div>
                    <span className="fit-score-label">Fit</span>
                  </div>
                </div>

                {/* Why This Market */}
                <div className="market-reason-step5">
                  <Target className="reason-icon" />
                  <p className="reason-text">{market.reason}</p>
                </div>

                {/* Predicted Metrics */}
                <div className="predicted-metrics-step5">
                  <div className="pred-metric-step5">
                    <DollarSign className="pred-icon-step5" />
                    <div>
                      <span className="pred-label-step5">Predicted CPA</span>
                      <span className="pred-value-step5">${market.predicted_cpa}</span>
                    </div>
                  </div>
                  <div className="pred-metric-step5">
                    <TrendingUp className="pred-icon-step5" />
                    <div>
                      <span className="pred-label-step5">Predicted ROAS</span>
                      <span className="pred-value-step5 green">{market.predicted_roas}x</span>
                    </div>
                  </div>
                </div>

                {/* Budget Recommendation */}
                <div className="budget-rec-step5">
                  <span className="budget-label">Recommended Budget:</span>
                  <span className="budget-value">
                    ${market.budget_recommendation.toLocaleString()}
                  </span>
                </div>

                {/* Key Advantage */}
                {isExpanded && (
                  <div className="market-expanded-step5 fade-in">
                    <div className="advantage-box">
                      <Trophy className="advantage-icon" />
                      <div>
                        <p className="advantage-label">Key Competitive Advantage:</p>
                        <p className="advantage-text">{market.key_advantage}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="market-actions-step5">
                  <button
                    className="expand-market-btn-step5"
                    onClick={() => setExpandedMarket(isExpanded ? null : market.id)}
                  >
                    {isExpanded ? '▲ Less' : '▼ Details'}
                  </button>
                  <button
                    className={`select-market-btn-step5 ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleToggleMarket(market.id)}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle className="btn-icon" /> Selected
                      </>
                    ) : (
                      '+ Select Market'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      {selectedMarkets.length > 0 && (
        <div className="market-summary-step5 fade-in">
          <h3 className="summary-title-step5">
            <TrendingUp className="summary-icon" />
            Expansion Summary
          </h3>
          <div className="summary-stats-step5">
            <div className="summary-stat-step5">
              <span className="stat-value-step5">{selectedMarkets.length}</span>
              <span className="stat-label-step5">Markets</span>
            </div>
            <div className="summary-stat-step5">
              <span className="stat-value-step5">
                ${getTotalBudget().toLocaleString()}
              </span>
              <span className="stat-label-step5">Total Budget</span>
            </div>
            <div className="summary-stat-step5">
              <span className="stat-value-step5 green">{getAvgRoas()}x</span>
              <span className="stat-label-step5">Avg ROAS</span>
            </div>
          </div>

          <div className="selected-markets-list">
            <p className="list-title">Selected Markets:</p>
            <div className="markets-chips">
              {selectedMarkets.map(id => {
                const market = markets.find(m => m.id === id);
                return market ? (
                  <div key={id} className="market-chip">
                    {market.emoji} {market.name}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      {/* Final CTA */}
      {selectedMarkets.length > 0 && (
        <div className="final-cta-step5 fade-in">
          <div className="cta-content-step5">
            <Trophy className="cta-trophy" />
            <div>
              <h3 className="cta-title-step5">Ready to Generate Your Campaign Blueprint?</h3>
              <p className="cta-desc-step5">
                Complete 5-step intelligence report with audience insights, creative
                recommendations, performance predictions, and market playbooks
              </p>
            </div>
          </div>
          <button className="generate-report-btn" onClick={handleGenerateReport}>
            <Trophy className="btn-icon" />
            Generate Complete Campaign Blueprint
            <ArrowRight className="btn-icon" />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="form-actions">
        <button className="btn-secondary" onClick={prevStep}>
          <ArrowLeft className="btn-icon" />
          Back to Performance
        </button>
        {!showFinalReport && selectedMarkets.length > 0 && (
          <button
            className="btn-primary"
            onClick={handleGenerateReport}
          >
            Generate Campaign Blueprint
            <Trophy className="btn-icon" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Step5_MarketIntelligence;