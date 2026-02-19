import React from 'react';
import { usePresentation } from '../context/PresentationContext';
import { Home } from 'lucide-react';
import Step1_ProductInput from './steps/Step1_ProductInput';
import Step2_AudienceIntelligence from './steps/Step2_AudienceIntelligence';
import Step3_CreativeIntelligence from './steps/Step3_CreativeIntelligence';
import Step4_PerformanceIntelligence from './steps/Step4_PerformanceIntelligence';
import Step5_MarketIntelligence from './steps/Step5_MarketIntelligence';
import Step6_FinalReport from './steps/Step6_FinalReport';
import '../styles/PresentationFlow.css';

// ESLint-friendly aliases for components with underscores
const Step1ProductInput = Step1_ProductInput;
const Step2AudienceIntelligence = Step2_AudienceIntelligence;
const Step3CreativeIntelligence = Step3_CreativeIntelligence;
const Step4PerformanceIntelligence = Step4_PerformanceIntelligence;
const Step5MarketIntelligence = Step5_MarketIntelligence;
const Step6FinalReport = Step6_FinalReport;

function PresentationFlow({ onExit }) {
  const { currentStep } = usePresentation();

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1ProductInput />;
      case 2: return <Step2AudienceIntelligence />;
      case 3: return <Step3CreativeIntelligence />;
      case 4: return <Step4PerformanceIntelligence />;
      case 5: return <Step5MarketIntelligence />;
      case 6: return <Step6FinalReport />;
      default: return <Step1ProductInput />;
    }
  };

  return (
    <div className="presentation-flow">
      {/* Header */}
      <div className="presentation-header">
        <button className="home-button" onClick={onExit}>
          <Home className="icon" />
          <span>Exit</span>
        </button>

        {/* Progress Bar */}
        <div className="progress-bar">
          {[1, 2, 3, 4, 5].map(step => (
            <div
              key={step}
              className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
            >
              <div className="progress-dot">{step}</div>
              <span className="progress-label">
                {step === 1 && 'Product'}
                {step === 2 && 'Audience'}
                {step === 3 && 'Creative'}
                {step === 4 && 'Performance'}
                {step === 5 && 'Markets'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="presentation-content">
        {renderStep()}
      </div>
    </div>
  );
}

export default PresentationFlow;