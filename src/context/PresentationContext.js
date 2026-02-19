import React, { createContext, useContext, useState } from 'react';

const PresentationContext = createContext();

export function PresentationProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Product Input (Step 1)
  const [productData, setProductData] = useState({
    productName: '',
    description: '',
    price: '',
    existingCustomers: '',
    monthlySpend: '',
    category: '',
    newProduct: ''
  });

  // Audience Selection (Step 2)
  // Around line 20, add this with the other creative state:
  const [creativeMode, setCreativeMode] = useState(null); // 'upload' or 'create'
  const [uploadedCreatives, setUploadedCreatives] = useState([]);
  const [generatedCreatives, setGeneratedCreatives] = useState([]);
  const [selectedAudiences, setSelectedAudiences] = useState([]);
  const [audienceStrategy, setAudienceStrategy] = useState(null);

  // Creative Selection (Step 3)
  const [selectedCreative, setSelectedCreative] = useState(null);
  const [creativeScores, setCreativeScores] = useState({});

  // Performance Data (Step 4)
  const [performancePrediction, setPerformancePrediction] = useState(null);
  const [recoveryStrategy, setRecoveryStrategy] = useState(null);

  // Market Selection (Step 5)
  const [selectedMarkets, setSelectedMarkets] = useState([]);

  // Navigation
  const goToStep = (step) => {
    if (step >= 1 && step <= 6) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return productData.productName && productData.price;
      case 2: return selectedAudiences.length > 0;
      case 3: return selectedCreative !== null;
      case 4: return recoveryStrategy !== null;
      case 5: return selectedMarkets.length > 0;
      default: return true;
    }
  };

  const resetPresentation = () => {
    setCurrentStep(1);
    setProductData({
      productName: '', description: '', price: '',
      existingCustomers: '', monthlySpend: '', category: '', newProduct: ''
    });
    setSelectedAudiences([]);
    setAudienceStrategy(null);
    setSelectedCreative(null);
    setCreativeScores({});
    setCreativeMode(null);              // ADD
    setUploadedCreatives([]);           // ADD
    setGeneratedCreatives([]);          // ADD
    setPerformancePrediction(null);
    setRecoveryStrategy(null);
    setSelectedMarkets([]);
  };

  return (
    <PresentationContext.Provider value={{
      currentStep, setCurrentStep, goToStep, nextStep, prevStep, canProceed,
      productData, setProductData,
      selectedAudiences, setSelectedAudiences,
      audienceStrategy, setAudienceStrategy,
      selectedCreative, setSelectedCreative,
      creativeScores, setCreativeScores,
      creativeMode, setCreativeMode,              // ADD THIS
      uploadedCreatives, setUploadedCreatives,    // ADD THIS
      generatedCreatives, setGeneratedCreatives,  // ADD THIS
      performancePrediction, setPerformancePrediction,
      recoveryStrategy, setRecoveryStrategy,
      selectedMarkets, setSelectedMarkets,
      resetPresentation
    }}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentation must be used within PresentationProvider');
  }
  return context;
}