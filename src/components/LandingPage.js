import React from 'react';
import { Brain, Sparkles, ArrowRight, Target, TrendingUp, MapPin } from 'lucide-react';
import '../styles/LandingPage.css';

function LandingPage({ onStart }) {
  const handleFlowSelect = (flow) => {
    onStart(flow); // Pass which flow was selected
  };

  return (
    <div className="landing-page-clean">
      {/* Header */}
      <div className="landing-header-clean">
        <div className="header-logo">
          <div className="logo-icon-clean">
            <Brain className="icon" />
          </div>
          <div>
            <h1 className="logo-title-clean">BehaviourStack Intelligence</h1>
            <p className="logo-subtitle-clean">AI-Powered Campaign Strategy Platform</p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="landing-hero-clean">
        <div className="hero-content-clean">
          {/* Badge */}
          <div className="hero-badge-clean">
            <Sparkles className="badge-icon-clean" />
            <span>Powered by LCBM · Social Agents · Transsuasion AI</span>
          </div>

          {/* Title */}
          <h2 className="hero-title-clean">
            AI-Powered Campaign Intelligence
          </h2>
          <p className="hero-description-clean">
            Choose your intelligence workflow below
          </p>

          {/* 3 Flow Cards */}
          <div className="flows-grid">
            {/* Flow 1: Start New Campaign */}
            <button 
              className="flow-card"
              onClick={() => handleFlowSelect('new-campaign')}
            >
              <div className="flow-icon-wrap new-campaign">
                <Target className="flow-icon" />
              </div>
              <h3 className="flow-title">Start New Campaign</h3>
              <p className="flow-desc">
                Complete campaign strategy from product input to creative generation
              </p>
              <ul className="flow-steps">
                <li>1. Product Input</li>
                <li>2. Audience Discovery</li>
                <li>3. Creative Intelligence</li>
              </ul>
              <div className="flow-cta">
                Start Campaign
                <ArrowRight className="cta-arrow" />
              </div>
            </button>

            {/* Flow 2: Performance Debugging */}
            <button 
              className="flow-card"
              onClick={() => handleFlowSelect('performance-debug')}
            >
              <div className="flow-icon-wrap performance-debug">
                <TrendingUp className="flow-icon" />
              </div>
              <h3 className="flow-title">Performance Debugging</h3>
              <p className="flow-desc">
                Upload running campaigns for LCBM diagnosis and optimization recommendations
              </p>
              <ul className="flow-steps">
                <li>• Connect live campaigns</li>
                <li>• AI performance diagnosis</li>
                <li>• Recovery strategies</li>
              </ul>
              <div className="flow-cta">
                Debug Campaign
                <ArrowRight className="cta-arrow" />
              </div>
            </button>

            {/* Flow 3: Regional Expansion */}
            <button 
              className="flow-card"
              onClick={() => handleFlowSelect('regional-expansion')}
            >
              <div className="flow-icon-wrap regional-expansion">
                <MapPin className="flow-icon" />
              </div>
              <h3 className="flow-title">Regional Expansion</h3>
              <p className="flow-desc">
                Get market-specific recommendations for geographic expansion
              </p>
              <ul className="flow-steps">
                <li>• Company overview input</li>
                <li>• Market analysis</li>
                <li>• Regional playbooks</li>
              </ul>
              <div className="flow-cta">
                Explore Markets
                <ArrowRight className="cta-arrow" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="landing-footer-clean">
        <div className="footer-models-clean">
          <div className="footer-model-clean">
            <Brain className="model-icon-clean" />
            <span>LCBM</span>
          </div>
          <div className="footer-divider-clean" />
          <div className="footer-model-clean">
            <Sparkles className="model-icon-clean" />
            <span>Social Agents</span>
          </div>
          <div className="footer-divider-clean" />
          <div className="footer-model-clean">
            <Target className="model-icon-clean" />
            <span>Transsuasion AI</span>
          </div>
        </div>
        <p className="footer-copy-clean">© 2025 BehaviourStack Intelligence</p>
      </div>
    </div>
  );
}

export default LandingPage;