import React, { useState } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import {
  ArrowRight, ArrowLeft, Brain, Upload, Sparkles,
  CheckCircle, Image, Play, Layout, Zap, Star, Download
} from 'lucide-react';
import { generateCreativeVariants, scoreUploadedCreatives } from '../../utils/creativeGenerator';
import '../../styles/Steps.css';

const typeIcons = {
  VIDEO: Play,
  CAROUSEL: Layout,
  STATIC: Image,
  UGC: Zap
};

function Step3_CreativeIntelligence({ nextStep: propNextStep, prevStep: propPrevStep, totalSteps = 5, stepNumber = 3 }) {
  const {
    productData,
    selectedAudiences,
    creativeMode,
    setCreativeMode,
    uploadedCreatives,
    setUploadedCreatives,
    generatedCreatives,
    setGeneratedCreatives,
    selectedCreative,
    setSelectedCreative,
    nextStep: contextNextStep,
    prevStep: contextPrevStep
  } = usePresentation();

  const nextStep = propNextStep || contextNextStep;  // ADD THIS
  const prevStep = propPrevStep || contextPrevStep;  // ADD THIS

  // ... rest of the component

  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showAudiencePreview, setShowAudiencePreview] = useState(false);
  const [comparisonVariants, setComparisonVariants] = useState([]);
  const [showComparisonVariants, setShowComparisonVariants] = useState(false);

  // Handle mode selection
  const handleSelectMode = (mode) => {
    setCreativeMode(mode);
    
    if (mode === 'create') {
      setShowAudiencePreview(true);
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    // Simulate upload and scoring
    setTimeout(() => {
      const newCreatives = files.map((file, idx) => ({
        id: `uploaded_${idx}`,
        name: file.name,
        type: file.type.includes('video') ? 'VIDEO' : 'STATIC',
        file: file,
        preview: URL.createObjectURL(file)
      }));

      // Score them with LCBM
      const scoredCreatives = scoreUploadedCreatives(newCreatives, selectedAudiences);
      setUploadedCreatives(scoredCreatives);
      setUploading(false);
    }, 1500);
  };

  // Generate AI variants
  const handleGenerateVariants = () => {
    setGenerating(true);
    setShowAudiencePreview(false);

    setTimeout(() => {
      const variants = generateCreativeVariants(selectedAudiences, productData);
      setGeneratedCreatives(variants);
      setGenerating(false);
    }, 2000);
  };

  // Generate AI variants for comparison (from Upload flow)
  const handleGenerateForComparison = () => {
    setGenerating(true);
    setTimeout(() => {
      const variants = generateCreativeVariants(selectedAudiences, productData);
      setComparisonVariants(variants);
      setGenerating(false);
      setShowComparisonVariants(true);
    }, 2000);
  };

  const handleSelectCreative = (creativeId) => {
    setSelectedCreative(creativeId);
  };

  const handleContinue = () => {
    if (selectedCreative) {
      nextStep();
    }
  };

  // Download all assets
  const handleDownloadAll = (variant = null) => {
    if (variant) {
      alert(`Download functionality: Would download assets for "${variant.name}".\n\nIn production, this would download this variant's images, video, and ad copy.`);
    } else {
      alert('Download functionality: Would download all images, videos, and Google Ads copy as a ZIP file.\n\nIn production, this would:\n1. Collect all asset URLs\n2. Create a ZIP file with all images, videos, and ad copy\n3. Trigger download');
    }
  };

  // Mode selection screen
  if (!creativeMode) {
    return (
      <div className="step-container">
        <div className="step-header">
          <div className="step-badge">Step {stepNumber} of {totalSteps}</div>
          <h1 className="step-title">Creative Intelligence</h1>
          <p className="step-description">
            Upload existing ads for LCBM scoring, or let AI generate high-performing variants
          </p>
        </div>

        {/* Selected Audiences Context */}
        <div className="model-output-box">
          <div className="model-header">
            <Brain className="model-icon" />
            <div>
              <h3 className="model-title">Context from Step 2</h3>
              <p className="model-subtitle">Selected Audiences</p>
            </div>
          </div>
          <div className="selected-audiences-preview">
            <p className="preview-label">{selectedAudiences.length} audiences selected:</p>
            <div className="audience-chips">
              {selectedAudiences.slice(0, 4).map((audId, idx) => (
                <div key={idx} className="audience-chip">
                  {audId.replace(/_/g, ' ')}
                </div>
              ))}
              {selectedAudiences.length > 4 && (
                <div className="audience-chip">+{selectedAudiences.length - 4} more</div>
              )}
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="mode-selection-grid">
          <button
            className="mode-card"
            onClick={() => handleSelectMode('upload')}
          >
            <div className="mode-icon-wrap upload">
              <Upload className="mode-icon" />
            </div>
            <h3 className="mode-title">Upload Existing Ads</h3>
            <p className="mode-desc">
              Upload your creative assets and LCBM will score them against your
              selected audiences
            </p>
            <ul className="mode-benefits">
              <li>✓ Score existing creatives</li>
              <li>✓ Prioritize based on fit</li>
              <li>✓ Get improvement recommendations</li>
            </ul>
            <div className="mode-cta">
              Upload & Score
              <ArrowRight className="cta-icon" />
            </div>
          </button>

          <button
            className="mode-card"
            onClick={() => handleSelectMode('create')}
          >
            <div className="mode-icon-wrap create">
              <Sparkles className="mode-icon" />
            </div>
            <h3 className="mode-title">Generate AI Variants</h3>
            <p className="mode-desc">
              AI will create 4 high-performing creative variants based on your
              audience preferences
            </p>
            <ul className="mode-benefits">
              <li>✓ 4 AI-generated variants</li>
              <li>✓ Optimized for your audiences</li>
              <li>✓ Complete creative briefs</li>
            </ul>
            <div className="mode-cta">
              Generate Variants
              <Sparkles className="cta-icon" />
            </div>
          </button>
        </div>

        {/* Back Button */}
        <div className="form-actions">
          <button className="btn-secondary" onClick={prevStep}>
            <ArrowLeft className="btn-icon" />
            Back to Audiences
          </button>
        </div>
      </div>
    );
  }

  // Upload Mode
  if (creativeMode === 'upload') {
    return (
      <div className="step-container">
        <div className="step-header">
          <div className="step-badge">Step {stepNumber} of {totalSteps}</div>
          <h1 className="step-title">Upload & Score Creatives</h1>
          <p className="step-description">
            LCBM will score your creatives against selected audiences
          </p>
        </div>

        {/* Upload Zone */}
        {uploadedCreatives.length === 0 && !uploading && (
          <div className="upload-zone">
            <Upload className="upload-icon" />
            <h3 className="upload-title">Upload Your Creative Assets</h3>
            <p className="upload-desc">
              Images, videos, or ad mockups (PNG, JPG, MP4)
            </p>
            <label className="upload-btn">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              Choose Files
            </label>
            <button
              className="change-mode-btn"
              onClick={() => setCreativeMode(null)}
            >
              ← Or generate AI variants instead
            </button>
          </div>
        )}

        {/* Uploading State */}
        {uploading && (
          <div className="analyzing-state">
            <div className="analyzing-icon">
              <Brain className="icon spinning" />
            </div>
            <h2 className="analyzing-title">LCBM Scoring Your Creatives...</h2>
            <p className="analyzing-desc">Analyzing fit against selected audiences</p>
            <div className="progress-bar-anim">
              <div className="progress-fill" />
            </div>
          </div>
        )}

        {/* Scored Creatives */}
        {uploadedCreatives.length > 0 && (
          <>
            <div className="model-output-box">
              <div className="model-header">
                <Brain className="model-icon" />
                <div>
                  <h3 className="model-title">🤖 LCBM Scoring Complete</h3>
                  <p className="model-subtitle">Creatives ranked by audience fit</p>
                </div>
              </div>
            </div>

            <div className="creatives-grid-step3">
              {uploadedCreatives
                .sort((a, b) => b.lcbm_score - a.lcbm_score)
                .map((creative) => {
                  const isSelected = selectedCreative === creative.id;
                  const TypeIcon = typeIcons[creative.type] || Image;

                  return (
                    <div
                      key={creative.id}
                      className={`creative-card-step3 ${isSelected ? 'selected' : ''}`}
                    >
                      {/* Preview */}
                      <div className="creative-preview">
                        {creative.preview && (
                          <img
                            src={creative.preview}
                            alt={creative.name}
                            className="preview-img"
                          />
                        )}
                        <div className="creative-type-badge">
                          <TypeIcon className="type-icon" />
                          {creative.type}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="lcbm-score-display">
                        <div className="score-value">
                          {creative.lcbm_score}
                        </div>
                        <div className="score-label">LCBM Score</div>
                      </div>

                      {/* Name */}
                      <h4 className="creative-name-step3">{creative.name}</h4>

                      {/* Recommendation */}
                      <div className="recommendation-box">
                        <Star className="rec-icon" />
                        <p className="rec-text">{creative.recommendations}</p>
                      </div>

                      {/* Predicted Performance */}
                      <div className="performance-metrics">
                        <div className="perf-metric">
                          <span className="perf-label">CTR</span>
                          <span className="perf-value">{creative.predicted_performance.ctr}</span>
                        </div>
                        <div className="perf-metric">
                          <span className="perf-label">Engagement</span>
                          <span className="perf-value">{creative.predicted_performance.engagement}</span>
                        </div>
                        <div className="perf-metric">
                          <span className="perf-label">Conv. Lift</span>
                          <span className="perf-value green">{creative.predicted_performance.conversion_lift}</span>
                        </div>
                      </div>

                      {/* Select Button */}
                      <button
                        className={`select-creative-btn-step3 ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectCreative(creative.id)}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle className="btn-icon" /> Selected
                          </>
                        ) : (
                          'Select as Winner'
                        )}
                      </button>
                    </div>
                  );
                })}
            </div>

            <button
              className="upload-more-btn"
              onClick={() => {
                setUploadedCreatives([]);
                setComparisonVariants([]);
                setShowComparisonVariants(false);
                setSelectedCreative(null);
              }}
            >
              <Upload className="btn-icon" /> Upload Different Creatives
            </button>

            {/* Recommendation: Compare with AI-generated variants */}
            {uploadedCreatives.length > 0 && !showComparisonVariants && !generating && (
              <div className="compare-recommendation-card">
                <Sparkles className="compare-rec-icon" />
                <div className="compare-rec-content">
                  <h3 className="compare-rec-title">Optimized variants available!</h3>
                  <p className="compare-rec-desc">
                    See how Transsuasion AI variants perform against your selected audiences.
                    We&apos;ll generate 4 variants and score them the same way, with full preview
                    and creative briefs.
                  </p>
                  <button
                    type="button"
                    className="compare-rec-cta"
                    onClick={handleGenerateForComparison}
                  >
                    <Sparkles className="btn-icon" />
                    Generate Variants
                  </button>
                </div>
              </div>
            )}

            {/* AI variants (scored for your audiences) - full breakdown same as Generate section */}
            {showComparisonVariants && comparisonVariants.length > 0 && (
              <div className="comparison-variants-section">
                <h3 className="comparison-section-title">
                  <Sparkles className="inline-icon" />
                  AI variants (scored for your audiences)
                </h3>
                <div className="variants-grid">
                  {comparisonVariants.map((variant) => {
                    const isSelected = selectedCreative === variant.id;
                    const TypeIcon = typeIcons[variant.type] || Image;

                    return (
                      <div
                        key={variant.id}
                        className={`variant-card ${isSelected ? 'selected' : ''}`}
                      >
                        <div className="variant-header">
                          <TypeIcon className="variant-type-icon" />
                          <h4 className="variant-name">{variant.name}</h4>
                          <div className="variant-score">{variant.lcbm_score}</div>
                        </div>

                        {variant.assets && (
                          <div className="variant-assets">
                            <h5 className="assets-title">
                              <Image className="assets-title-icon" />
                              Generated Visual Assets
                            </h5>
                            <div className="assets-images">
                              {variant.assets.images.map((img) => (
                                <div key={img.id} className="asset-img-wrap">
                                  <img src={img.url} alt={img.type} className="asset-img" />
                                  <span className="asset-label">{img.type}</span>
                                </div>
                              ))}
                            </div>
                            <div className="asset-video-wrap">
                              <div className="video-thumbnail">
                                <img src={variant.assets.video.url} alt="video" className="asset-img" />
                                <div className="play-overlay">
                                  <Play className="play-icon" />
                                </div>
                                <span className="video-duration">{variant.assets.video.duration}</span>
                              </div>
                              <span className="asset-label">Video Ad</span>
                            </div>
                            <div className="google-ads-section">
                              <h6 className="google-ads-title">
                                <Layout className="google-ads-icon" />
                                Google Ads Copy
                              </h6>
                              {variant.assets.googleAds.map((ad) => (
                                <div key={ad.id} className="google-ad-preview">
                                  <div className="ad-headline">{ad.headline}</div>
                                  <div className="ad-url">{ad.displayUrl}</div>
                                  <div className="ad-description">{ad.description}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="variant-hook">
                          <span className="hook-label">Hook:</span>
                          <p className="hook-text">&quot;{variant.hook}&quot;</p>
                        </div>

                        <div className="variant-section">
                          <h5 className="section-title-small">Visual Direction</h5>
                          <p className="section-text">{variant.visual_direction}</p>
                        </div>

                        <div className="variant-section">
                          <h5 className="section-title-small">Copy Angle</h5>
                          <p className="section-text">{variant.copy_angle}</p>
                        </div>

                        <div className="variant-cta-display">
                          <span className="cta-label">CTA:</span>
                          <span className="cta-text">{variant.cta}</span>
                        </div>

                        <div className="why-high-performing">
                          <Star className="why-icon" />
                          <p className="why-text">{variant.why_high_performing}</p>
                        </div>

                        <div className="performance-metrics">
                          <div className="perf-metric">
                            <span className="perf-label">CTR</span>
                            <span className="perf-value">{variant.predicted_performance.ctr}</span>
                          </div>
                          <div className="perf-metric">
                            <span className="perf-label">Engagement</span>
                            <span className="perf-value">{variant.predicted_performance.engagement}</span>
                          </div>
                          <div className="perf-metric">
                            <span className="perf-label">Conv. Lift</span>
                            <span className="perf-value green">{variant.predicted_performance.conversion_lift}</span>
                          </div>
                        </div>

                        <div className="variant-actions-row">
                          <button
                            type="button"
                            className={`select-variant-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleSelectCreative(variant.id)}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle className="btn-icon" /> Selected
                              </>
                            ) : (
                              'Select This Variant'
                            )}
                          </button>
                          <button
                            type="button"
                            className="download-variant-btn"
                            onClick={() => handleDownloadAll(variant)}
                            title={`Download ${variant.name} assets`}
                          >
                            <Download className="btn-icon" />
                            Download
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Actions */}
        {uploadedCreatives.length > 0 && (
          <div className="form-actions">
            <button className="btn-secondary" onClick={() => setCreativeMode(null)}>
              <ArrowLeft className="btn-icon" />
              Change Mode
            </button>
            <button
              className="btn-primary"
              onClick={handleContinue}
              disabled={!selectedCreative}
            >
              Continue to Performance Intelligence
              <ArrowRight className="btn-icon" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Create Mode - Show audience preview first
  if (creativeMode === 'create' && showAudiencePreview) {
    return (
      <div className="step-container">
        <div className="step-header">
          <div className="step-badge">Step {stepNumber} of {totalSteps}</div>
          <h1 className="step-title">Audience Preferences</h1>
          <p className="step-description">
            Based on your selected audiences, here's what resonates with them
          </p>
        </div>

        {/* Audience Insights */}
        <div className="audience-insights-card">
          <h3 className="insights-title">
            <Brain className="insights-icon" />
            Key Insights from Your Audiences
          </h3>

          <div className="insights-grid">
            <div className="insight-item">
              <div className="insight-label">Top Content Affinity</div>
              <div className="insight-value">Performance & Results Content</div>
              <div className="insight-reason">
                87% of your audiences engage heavily with achievement-oriented content
              </div>
            </div>

            <div className="insight-item">
              <div className="insight-label">Preferred Messaging Tone</div>
              <div className="insight-value">Direct, Data-Driven</div>
              <div className="insight-reason">
                Your audiences value quantifiable outcomes and clear value propositions
              </div>
            </div>

            <div className="insight-item">
              <div className="insight-label">Decision Triggers</div>
              <div className="insight-value">Social Proof + Time Efficiency</div>
              <div className="insight-reason">
                Community validation combined with convenience drives conversions
              </div>
            </div>

            <div className="insight-item">
              <div className="insight-label">Format Preference</div>
              <div className="insight-value">Short-Form Video & UGC</div>
              <div className="insight-reason">
                Higher engagement with authentic, bite-sized content (15-30s)
              </div>
            </div>
          </div>
        </div>

        <div className="info-box">
          <Sparkles className="info-icon" />
          <div>
            <p className="info-title">What happens next?</p>
            <p className="info-text">
              Transsuasion AI will generate 4 creative variants optimized for these
              preferences, each with complete creative briefs and predicted performance.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button className="btn-secondary" onClick={() => setCreativeMode(null)}>
            <ArrowLeft className="btn-icon" />
            Change Mode
          </button>
          <button className="btn-primary" onClick={handleGenerateVariants}>
            Generate 4 AI Variants
            <Sparkles className="btn-icon" />
          </button>
        </div>
      </div>
    );
  }

  // Create Mode - Generating
  if (generating) {
    return (
      <div className="step-container">
        <div className="analyzing-state">
          <div className="analyzing-icon">
            <Sparkles className="icon spinning" />
          </div>
          <h2 className="analyzing-title">Transsuasion AI Generating Variants...</h2>
          <p className="analyzing-desc">
            Creating 4 high-performing creative concepts with visual assets
          </p>
          <div className="progress-bar-anim">
            <div className="progress-fill" />
          </div>
        </div>
      </div>
    );
  }

  // Create Mode - Generated Variants
  if (creativeMode === 'create' && generatedCreatives.length > 0) {
    return (
      <div className="step-container">
        <div className="step-header">
          <div className="step-badge">Step {stepNumber} of {totalSteps}</div>
          <h1 className="step-title">AI-Generated Creative Variants</h1>
          <p className="step-description">
            4 high-performing variants with complete visual assets
          </p>
        </div>

        <div className="model-output-box">
          <div className="model-header">
            <Sparkles className="model-icon" />
            <div>
              <h3 className="model-title">🤖 Transsuasion AI Generation Complete</h3>
              <p className="model-subtitle">
                All variants scored 8.5+ by LCBM with complete asset packages
              </p>
            </div>
          </div>
        </div>

        <div className="variants-grid">
          {generatedCreatives.map((variant) => {
            const isSelected = selectedCreative === variant.id;
            const TypeIcon = typeIcons[variant.type] || Image;

            return (
              <div
                key={variant.id}
                className={`variant-card ${isSelected ? 'selected' : ''}`}
              >
                {/* Header */}
                <div className="variant-header">
                  <TypeIcon className="variant-type-icon" />
                  <h4 className="variant-name">{variant.name}</h4>
                  <div className="variant-score">{variant.lcbm_score}</div>
                </div>

                {/* NEW: Visual Assets Section */}
                {variant.assets && (
                  <div className="variant-assets">
                    <h5 className="assets-title">
                      <Image className="assets-title-icon" />
                      Generated Visual Assets
                    </h5>
                    
                    {/* Images */}
                    <div className="assets-images">
                      {variant.assets.images.map((img) => (
                        <div key={img.id} className="asset-img-wrap">
                          <img src={img.url} alt={img.type} className="asset-img" />
                          <span className="asset-label">{img.type}</span>
                        </div>
                      ))}
                    </div>

                    {/* Video */}
                    <div className="asset-video-wrap">
                      <div className="video-thumbnail">
                        <img src={variant.assets.video.url} alt="video" className="asset-img" />
                        <div className="play-overlay">
                          <Play className="play-icon" />
                        </div>
                        <span className="video-duration">{variant.assets.video.duration}</span>
                      </div>
                      <span className="asset-label">Video Ad</span>
                    </div>

                    {/* Google Ads */}
                    <div className="google-ads-section">
                      <h6 className="google-ads-title">
                        <Layout className="google-ads-icon" />
                        Google Ads Copy
                      </h6>
                      {variant.assets.googleAds.map((ad) => (
                        <div key={ad.id} className="google-ad-preview">
                          <div className="ad-headline">{ad.headline}</div>
                          <div className="ad-url">{ad.displayUrl}</div>
                          <div className="ad-description">{ad.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hook */}
                <div className="variant-hook">
                  <span className="hook-label">Hook:</span>
                  <p className="hook-text">"{variant.hook}"</p>
                </div>

                {/* Visual Direction */}
                <div className="variant-section">
                  <h5 className="section-title-small">Visual Direction</h5>
                  <p className="section-text">{variant.visual_direction}</p>
                </div>

                {/* Copy Angle */}
                <div className="variant-section">
                  <h5 className="section-title-small">Copy Angle</h5>
                  <p className="section-text">{variant.copy_angle}</p>
                </div>

                {/* CTA */}
                <div className="variant-cta-display">
                  <span className="cta-label">CTA:</span>
                  <span className="cta-text">{variant.cta}</span>
                </div>

                {/* Why High Performing */}
                <div className="why-high-performing">
                  <Star className="why-icon" />
                  <p className="why-text">{variant.why_high_performing}</p>
                </div>

                {/* Predicted Performance */}
                <div className="performance-metrics">
                  <div className="perf-metric">
                    <span className="perf-label">CTR</span>
                    <span className="perf-value">{variant.predicted_performance.ctr}</span>
                  </div>
                  <div className="perf-metric">
                    <span className="perf-label">Engagement</span>
                    <span className="perf-value">{variant.predicted_performance.engagement}</span>
                  </div>
                  <div className="perf-metric">
                    <span className="perf-label">Conv. Lift</span>
                    <span className="perf-value green">{variant.predicted_performance.conversion_lift}</span>
                  </div>
                </div>

                {/* Actions: Select + Download side by side */}
                <div className="variant-actions-row">
                  <button
                    className={`select-variant-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectCreative(variant.id)}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle className="btn-icon" /> Selected
                      </>
                    ) : (
                      'Select This Variant'
                    )}
                  </button>
                  <button
                    type="button"
                    className="download-variant-btn"
                    onClick={() => handleDownloadAll(variant)}
                    title={`Download ${variant.name} assets`}
                  >
                    <Download className="btn-icon" />
                    Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Download All Button
        <button className="download-all-btn" onClick={() => handleDownloadAll()}>
          <Download className="btn-icon" />
          Download All Generated Assets (ZIP)
        </button> */}

        {/* Actions */}
        <div className="form-actions">
          <button className="btn-secondary" onClick={() => {
            setGeneratedCreatives([]);
            setShowAudiencePreview(true);
          }}>
            <ArrowLeft className="btn-icon" />
            Regenerate
          </button>
          <button
  className="btn-primary"
  onClick={handleContinue}
  disabled={!selectedCreative}
>
  Complete Campaign Strategy
  <ArrowRight className="btn-icon" />
</button>
        </div>
      </div>
    );
  }

  return null;
}

export default Step3_CreativeIntelligence;