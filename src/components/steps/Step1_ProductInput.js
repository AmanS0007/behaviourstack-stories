import React, { useState } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import { ArrowRight, Package, DollarSign, Users, TrendingUp, Lightbulb, MapPin } from 'lucide-react';
import '../../styles/Steps.css';

// Example templates for quick-fill
const TARGET_REGION_OPTIONS = [
  { value: '', label: 'Select target geography...' },
  { value: 'US only', label: 'US only' },
  { value: 'US & Canada', label: 'US & Canada' },
  { value: 'North America', label: 'North America' },
  { value: 'UK & Ireland', label: 'UK & Ireland' },
  { value: 'Europe', label: 'Europe' },
  { value: 'APAC', label: 'APAC' },
  { value: 'Global / International', label: 'Global / International' }
];

const exampleProducts = [
  {
    productName: 'Ember Roasts Cold Brew',
    description: 'Ready-to-drink cold brew coffee in convenient cans',
    price: '5.99',
    existingCustomers: '40000',
    monthlySpend: '120000',
    category: 'Beverage',
    newProduct: 'RTD Cold Brew Cans',
    targetRegions: 'US & Canada'
  },
  {
    productName: 'Vela Body Care Line',
    description: 'Organic body lotion and oil for clean beauty enthusiasts',
    price: '34',
    existingCustomers: '35000',
    monthlySpend: '90000',
    category: 'Beauty',
    newProduct: 'Body Care Collection',
    targetRegions: 'North America'
  },
  {
    productName: 'Peak Form Smart Rope',
    description: 'Connected jump rope with companion app for fitness tracking',
    price: '129',
    existingCustomers: '60000',
    monthlySpend: '100000',
    category: 'Fitness',
    newProduct: 'Smart Jump Rope',
    targetRegions: 'US only'
  }
];

function Step1_ProductInput({ nextStep: propNextStep }) {  // ADD THIS PARAM
  const { productData, setProductData, nextStep: contextNextStep } = usePresentation();
  const nextStep = propNextStep || contextNextStep;

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setProductData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleUseTemplate = (template) => {
    setProductData(template);
    setErrors({});
  };

  const validateAndProceed = () => {
    const newErrors = {};
    
    if (!productData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }
    if (!productData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!productData.price || parseFloat(productData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!productData.existingCustomers || parseInt(productData.existingCustomers) < 0) {
      newErrors.existingCustomers = 'Customer count is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    nextStep();
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-badge">Step 1 of 5</div>
        <h1 className="step-title">Product Information</h1>
        <p className="step-description">
          Enter your product details or select an example template to get started quickly
        </p>
      </div>

      {/* Quick Templates */}
      <div className="templates-section">
        <p className="templates-label">
          <Lightbulb className="label-icon" />
          Quick start with an example:
        </p>
        <div className="templates-grid">
          {exampleProducts.map((template, idx) => (
            <button
              key={idx}
              className="template-card"
              onClick={() => handleUseTemplate(template)}
            >
              <div className="template-icon">
                {idx === 0 && '☕'}
                {idx === 1 && '✨'}
                {idx === 2 && '💪'}
              </div>
              <div className="template-content">
                <h4 className="template-name">{template.productName}</h4>
                <p className="template-desc">{template.description}</p>
              </div>
              <ArrowRight className="template-arrow" />
            </button>
          ))}
        </div>
        <div className="or-divider">
          <span>or enter your own product details</span>
        </div>
      </div>

      {/* Form */}
      <div className="form-card">
        <div className="form-section">
          <div className="form-section-header">
            <Package className="section-icon" />
            <h3 className="section-title">Product Details</h3>
          </div>

          <div className="form-grid">
            {/* Product Name */}
            <div className="form-group full">
              <label className="form-label">
                Product Name <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.productName ? 'error' : ''}`}
                placeholder="e.g., Smart Jump Rope, Organic Face Serum"
                value={productData.productName}
                onChange={e => handleChange('productName', e.target.value)}
              />
              {errors.productName && (
                <span className="error-message">{errors.productName}</span>
              )}
            </div>

            {/* Description */}
            <div className="form-group full">
              <label className="form-label">
                Product Description <span className="required">*</span>
              </label>
              <textarea
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Brief description of your product and what makes it unique"
                rows={3}
                value={productData.description}
                onChange={e => handleChange('description', e.target.value)}
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Fitness, Beauty, Food"
                value={productData.category}
                onChange={e => handleChange('category', e.target.value)}
              />
            </div>

            {/* New Product */}
            <div className="form-group">
              <label className="form-label">New Product Launch</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., RTD Cans, Body Care Line"
                value={productData.newProduct}
                onChange={e => handleChange('newProduct', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-header">
            <DollarSign className="section-icon" />
            <h3 className="section-title">Pricing & Scale</h3>
          </div>

          <div className="form-grid">
            {/* Price */}
            <div className="form-group">
              <label className="form-label">
                Price Point <span className="required">*</span>
              </label>
              <div className="input-with-prefix">
                <span className="input-prefix">$</span>
                <input
                  type="number"
                  className={`form-input with-prefix ${errors.price ? 'error' : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  value={productData.price}
                  onChange={e => handleChange('price', e.target.value)}
                />
              </div>
              {errors.price && (
                <span className="error-message">{errors.price}</span>
              )}
            </div>

            {/* Existing Customers */}
            <div className="form-group">
              <label className="form-label">
                Existing Customers <span className="required">*</span>
              </label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  className={`form-input with-suffix ${errors.existingCustomers ? 'error' : ''}`}
                  placeholder="0"
                  value={productData.existingCustomers}
                  onChange={e => handleChange('existingCustomers', e.target.value)}
                />
                <span className="input-suffix">
                  <Users className="suffix-icon" />
                </span>
              </div>
              {errors.existingCustomers && (
                <span className="error-message">{errors.existingCustomers}</span>
              )}
            </div>

            {/* Monthly Spend */}
            <div className="form-group">
              <label className="form-label">Monthly Ad Spend (Optional)</label>
              <div className="input-with-prefix">
                <span className="input-prefix">$</span>
                <input
                  type="number"
                  className="form-input with-prefix"
                  placeholder="0"
                  value={productData.monthlySpend}
                  onChange={e => handleChange('monthlySpend', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-header">
            <MapPin className="section-icon" />
            <h3 className="section-title">Target Geography</h3>
          </div>
          <div className="form-grid">
            <div className="form-group full">
              <label className="form-label">Where do you sell or deliver?</label>
              <p className="form-hint">
                Audience recommendations will be scoped to regions where you can actually reach customers.
              </p>
              <select
                className="form-input"
                value={productData.targetRegions || ''}
                onChange={e => handleChange('targetRegions', e.target.value)}
              >
                {TARGET_REGION_OPTIONS.map((opt) => (
                  <option key={opt.value || 'empty'} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="info-box">
          <TrendingUp className="info-icon" />
          <div>
            <p className="info-title">What happens next?</p>
            <p className="info-text">
              Our LCBM model will analyze your product and discover high-fit audience
              segments based on behavioral signals and content affinities.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            className="btn-primary"
            onClick={validateAndProceed}
          >
            Continue to Audience Intelligence
            <ArrowRight className="btn-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step1_ProductInput;