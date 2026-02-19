import React from 'react';
import { usePresentation } from '../../context/PresentationContext';
import { Trophy, Download, RotateCcw, CheckCircle, Users, Lightbulb, TrendingUp, MapPin } from 'lucide-react';
import '../../styles/Steps.css';

function Step6_FinalReport() {
  const {
    productData,
    selectedAudiences,
    selectedCreative,
    performancePrediction,
    recoveryStrategy,
    selectedMarkets,
    resetPresentation
  } = usePresentation();

  const handleStartNew = () => {
    resetPresentation();
  };

  const handleDownloadReport = () => {
    alert('Download functionality would be implemented here - exports to PDF/DOCX');
  };

  return (
    <div className="step-container">
      {/* Success Header */}
      <div className="success-header">
        <div className="success-icon-wrap">
          <Trophy className="success-icon" />
        </div>
        <h1 className="success-title">Campaign Blueprint Complete! 🎉</h1>
        <p className="success-subtitle">
          Your AI-powered campaign strategy is ready
        </p>
      </div>

      {/* Report Summary */}
      <div className="report-summary-card">
        <h2 className="report-title">Campaign Intelligence Report</h2>
        <p className="report-subtitle">For: {productData.productName}</p>

        <div className="report-sections">
          {/* Section 1: Product */}
          <div className="report-section">
            <div className="section-number">1</div>
            <div className="section-content">
              <h3 className="section-title-report">Product Overview</h3>
              <div className="section-details">
                <p><strong>Product:</strong> {productData.productName}</p>
                <p><strong>Category:</strong> {productData.category}</p>
                <p><strong>Price:</strong> ${productData.price}</p>
                <p><strong>Existing Customers:</strong> {parseInt(productData.existingCustomers || 0).toLocaleString()}</p>
              </div>
            </div>
            <CheckCircle className="section-check" />
          </div>

          {/* Section 2: Audiences */}
          <div className="report-section">
            <div className="section-number">2</div>
            <div className="section-content">
              <h3 className="section-title-report">
                <Users className="section-icon-report" />
                Audience Intelligence
              </h3>
              <div className="section-details">
                <p><strong>{selectedAudiences.length} audiences selected</strong> from LCBM discovery</p>
                <div className="audience-tags">
                  {selectedAudiences.slice(0, 4).map((aud, idx) => (
                    <span key={idx} className="audience-tag">
                      {aud.replace(/_/g, ' ')}
                    </span>
                  ))}
                  {selectedAudiences.length > 4 && (
                    <span className="audience-tag">+{selectedAudiences.length - 4} more</span>
                  )}
                </div>
              </div>
            </div>
            <CheckCircle className="section-check" />
          </div>

          {/* Section 3: Creative */}
          <div className="report-section">
            <div className="section-number">3</div>
            <div className="section-content">
              <h3 className="section-title-report">
                <Lightbulb className="section-icon-report" />
                Creative Strategy
              </h3>
              <div className="section-details">
                <p><strong>Selected Creative:</strong> {selectedCreative || 'AI-Generated Variant'}</p>
                <p>LCBM-scored and optimized for selected audiences</p>
              </div>
            </div>
            <CheckCircle className="section-check" />
          </div>

          {/* Section 4: Performance */}
          <div className="report-section">
            <div className="section-number">4</div>
            <div className="section-content">
              <h3 className="section-title-report">
                <TrendingUp className="section-icon-report" />
                Performance Prediction
              </h3>
              <div className="section-details">
                {performancePrediction && (
                  <>
                    <p><strong>Winning Track ROAS:</strong> {performancePrediction.tracks[0].roas}x</p>
                    <p><strong>Predicted CPA:</strong> ${performancePrediction.tracks[0].cpa}</p>
                    <p><strong>Recovery Strategy:</strong> {
                      performancePrediction.recoveryStrategies.find(r => r.id === recoveryStrategy)?.label
                    }</p>
                  </>
                )}
              </div>
            </div>
            <CheckCircle className="section-check" />
          </div>

          {/* Section 5: Markets */}
          <div className="report-section">
            <div className="section-number">5</div>
            <div className="section-content">
              <h3 className="section-title-report">
                <MapPin className="section-icon-report" />
                Market Expansion
              </h3>
              <div className="section-details">
                <p><strong>{selectedMarkets.length} markets selected</strong> for launch</p>
                <div className="market-tags">
                  {selectedMarkets.map((marketId, idx) => (
                    <span key={idx} className="market-tag">
                      {marketId.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <CheckCircle className="section-check" />
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="next-steps-card">
        <h3 className="next-steps-title">Recommended Next Steps</h3>
        <div className="next-steps-list">
          <div className="next-step-item">
            <div className="step-number-small">1</div>
            <p>Implement creative variants in your ad platform</p>
          </div>
          <div className="next-step-item">
            <div className="step-number-small">2</div>
            <p>Set up audience targeting based on LCBM recommendations</p>
          </div>
          <div className="next-step-item">
            <div className="step-number-small">3</div>
            <p>Deploy recovery strategy across underperforming tracks</p>
          </div>
          <div className="next-step-item">
            <div className="step-number-small">4</div>
            <p>Launch regional campaigns with market-specific playbooks</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="final-actions">
        <button className="btn-secondary" onClick={handleDownloadReport}>
          <Download className="btn-icon" />
          Download Report (PDF)
        </button>
        <button className="btn-primary" onClick={handleStartNew}>
          <RotateCcw className="btn-icon" />
          Start New Campaign Analysis
        </button>
      </div>
    </div>
  );
}

export default Step6_FinalReport;