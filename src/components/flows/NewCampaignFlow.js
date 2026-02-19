import React, { useState } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import { Home, CheckCircle, Trophy } from 'lucide-react';
import Step1_ProductInput from '../steps/Step1_ProductInput';
import Step2_AudienceIntelligence from '../steps/Step2_AudienceIntelligence';
import Step3_CreativeIntelligence from '../steps/Step3_CreativeIntelligence';
import '../../styles/PresentationFlow.css';

// ESLint-friendly aliases for components with underscores
const Step1ProductInput = Step1_ProductInput;
const Step2AudienceIntelligence = Step2_AudienceIntelligence;
const Step3CreativeIntelligence = Step3_CreativeIntelligence;

function NewCampaignFlow({ onExit }) {
  const { productData, selectedAudiences, selectedCreative } = usePresentation();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCompletion, setShowCompletion] = useState(false);

  const steps = [
    { num: 1, label: 'Product', completed: !!productData.productName },
    { num: 2, label: 'Audience', completed: selectedAudiences.length > 0 },
    { num: 3, label: 'Creative', completed: !!selectedCreative }
  ];

  const handleStep3Complete = () => {
    setShowCompletion(true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1ProductInput nextStep={() => setCurrentStep(2)} />;
      case 2: return <Step2AudienceIntelligence 
        nextStep={() => setCurrentStep(3)} 
        prevStep={() => setCurrentStep(1)} 
      />;
      case 3: return <Step3CreativeIntelligence 
        prevStep={() => setCurrentStep(2)}
        nextStep={handleStep3Complete}
      />;
      default: return <Step1ProductInput />;
    }
  };

  // Completion Screen
  if (showCompletion) {
    return (
      <div className="presentation-flow">
        <div className="presentation-header">
          <button className="home-button" onClick={onExit}>
            <Home className="icon" />
            <span>Exit</span>
          </button>
          <div className="flow-title-wrapper">
            <h2 className="flow-title">Campaign Complete!</h2>
          </div>
        </div>

        <div className="presentation-content">
          <div className="step-container">
            <div className="completion-screen">
              <div className="completion-icon-wrap">
                <Trophy className="completion-icon" />
              </div>
              <h1 className="completion-title">Campaign Strategy Complete! 🎉</h1>
              <p className="completion-subtitle">
                Your campaign blueprint is ready
              </p>

              <div className="completion-summary">
                <h3 className="summary-title">Campaign Summary</h3>
                <div className="summary-items">
                  <div className="summary-item">
                    <span className="summary-label">Product:</span>
                    <span className="summary-value">{productData.productName}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Category:</span>
                    <span className="summary-value">{productData.category || 'Not specified'}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Price:</span>
                    <span className="summary-value">${productData.price}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Audiences Selected:</span>
                    <span className="summary-value">{selectedAudiences.length}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Creative Strategy:</span>
                    <span className="summary-value">
                      {selectedCreative ? 'AI-Generated Variant' : 'Selected'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="completion-actions">
                <button className="btn-secondary" onClick={() => setShowCompletion(false)}>
                  ← Review Choices
                </button>
                <button className="btn-primary" onClick={onExit}>
                  <Home className="btn-icon" />
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="presentation-flow">
      {/* Header */}
      <div className="presentation-header">
        <button className="home-button" onClick={onExit}>
          <Home className="icon" />
          <span>Exit</span>
        </button>

        {/* Progress Bar - MOVED TO CENTER */}
        <div className="progress-bar-wrapper">
          <div className="flow-title-wrapper">
            <h2 className="flow-title">New Campaign Strategy</h2>
          </div>

          <div className="progress-bar">
            {steps.map(step => (
              <div
                key={step.num}
                className={`progress-step ${currentStep >= step.num ? 'active' : ''} ${currentStep === step.num ? 'current' : ''}`}
                onClick={() => step.completed && setCurrentStep(step.num)}
              >
                <div className="progress-dot">
                  {step.completed ? <CheckCircle className="check-icon" /> : step.num}
                </div>
                <span className="progress-label">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="presentation-content">
        {renderStep()}
      </div>
    </div>
  );
}

export default NewCampaignFlow;