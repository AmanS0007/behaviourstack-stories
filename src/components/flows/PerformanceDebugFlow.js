import React, { useState, useEffect } from 'react';
import { Home, Upload, Brain, ArrowRight, CheckCircle, TrendingUp, AlertTriangle, FileText, Sparkles, Image, Play, Layout, Star, Download } from 'lucide-react';
import { generateCreativeVariants } from '../../utils/creativeGenerator';
import '../../styles/PresentationFlow.css';
import '../../styles/Steps.css';

const typeIcons = { VIDEO: Play, CAROUSEL: Layout, STATIC: Image, UGC: Image };

function formatCompact(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toLocaleString();
}
function formatCurrency(n, decimals = 0) {
  return '$' + n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function formatPct(n) {
  return n.toFixed(2) + '%';
}

function PerformanceDebugFlow({ onExit }) {
  const [step, setStep] = useState('upload'); // 'upload', 'analyzing', 'results', 'creative'
  const [campaignData, setCampaignData] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generatedVariants, setGeneratedVariants] = useState([]);

  useEffect(() => {
    return () => {
      if (uploadedPreviewUrl) URL.revokeObjectURL(uploadedPreviewUrl);
    };
  }, [uploadedPreviewUrl]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (uploadedPreviewUrl) URL.revokeObjectURL(uploadedPreviewUrl);
    const isPreviewable = file.type.startsWith('image/') || file.type.startsWith('video/');
    setUploadedFile(file);
    setUploadedPreviewUrl(isPreviewable ? URL.createObjectURL(file) : null);

    setStep('analyzing');

    // Single source of truth: raw metrics (realistic, non-round numbers)
    const curr = {
      impressions: 2287491,
      clicks: 68402,
      conversions: 3241,
      spend: 45187
    };
    const prev = {
      impressions: 2098122,
      clicks: 71988,
      conversions: 4102,
      spend: 42103
    };
    const ctrCurr = (curr.clicks / curr.impressions) * 100;
    const ctrPrev = (prev.clicks / prev.impressions) * 100;
    const cpaCurr = curr.spend / curr.conversions;
    const cpaPrev = prev.spend / prev.conversions;

    // Underperforming audiences: raw spend & conversions, derive CPA
    const aud1 = { name: 'Lookalike 1%', spend: 18207, conversions: 1123 };
    const aud2 = { name: 'Interest: Fitness', spend: 12394, conversions: 785 };
    const aud3 = { name: 'Retargeting 30d', spend: 8098, conversions: 571 };
    const campaignCpaAvg = cpaCurr;
    const pct = (val, prevVal) => (prevVal === 0 ? 0 : ((val - prevVal) / prevVal) * 100);

    setTimeout(() => {
      setCampaignData({
        name: file.name,
        spend: formatCurrency(curr.spend),
        impressions: formatCompact(curr.impressions),
        clicks: formatCompact(curr.clicks),
        conversions: formatCompact(curr.conversions),
        ctr: formatPct(ctrCurr),
        cpa: formatCurrency(cpaCurr, 2),
        previousPeriod: {
          spend: formatCurrency(prev.spend),
          impressions: formatCompact(prev.impressions),
          clicks: formatCompact(prev.clicks),
          conversions: formatCompact(prev.conversions),
          ctr: formatPct(ctrPrev),
          cpa: formatCurrency(cpaPrev, 2)
        }
      });

      setDiagnosis({
        issue: 'Creative Fatigue Detected',
        severity: 'High',
        root_cause: 'Ad creative has been running for 47 days with declining CTR (-32% in last 14 days). Audience is experiencing banner blindness.',
        recommendation: 'Rotate in 2-3 new creative variants immediately. Test different hooks and visual styles.',
        expected_improvement: '+45-60% CTR recovery within 7 days',
        recovery_actions: [
          'Pause current creative immediately',
          'Deploy new creative variants (upload or generate)',
          'Implement A/B testing framework',
          'Set up automated creative rotation schedule'
        ],
        underperforming_audiences: [
          { name: aud1.name, spend: formatCurrency(aud1.spend), cpa: formatCurrency(aud1.spend / aud1.conversions, 2), ctr: '2.12%', conversions: aud1.conversions, delta_vs_avg: (() => { const d = pct(aud1.spend / aud1.conversions, campaignCpaAvg); return (d > 0 ? '-' : '') + Math.abs(d).toFixed(0) + '%'; })() },
          { name: aud2.name, spend: formatCurrency(aud2.spend), cpa: formatCurrency(aud2.spend / aud2.conversions, 2), ctr: '2.81%', conversions: aud2.conversions, delta_vs_avg: (() => { const d = pct(aud2.spend / aud2.conversions, campaignCpaAvg); return (d > 0 ? '-' : '') + Math.abs(d).toFixed(0) + '%'; })() },
          { name: aud3.name, spend: formatCurrency(aud3.spend), cpa: formatCurrency(aud3.spend / aud3.conversions, 2), ctr: '3.07%', conversions: aud3.conversions, delta_vs_avg: (() => { const d = pct(aud3.spend / aud3.conversions, campaignCpaAvg); return (d > 0 ? '-' : '') + Math.abs(d).toFixed(0) + '%'; })() }
        ],
        kpi_deltas: [
          { metric: 'CTR', current: formatPct(ctrCurr), previous: formatPct(ctrPrev), change_pct: `${pct(ctrCurr, ctrPrev).toFixed(1)}%`, trend: 'down' },
          { metric: 'Conversions', current: curr.conversions.toLocaleString(), previous: prev.conversions.toLocaleString(), change_pct: `${pct(curr.conversions, prev.conversions).toFixed(1)}%`, trend: 'down' },
          { metric: 'CPA', current: formatCurrency(cpaCurr, 2), previous: formatCurrency(cpaPrev, 2), change_pct: `${pct(cpaCurr, cpaPrev).toFixed(1)}%`, trend: 'down' },
          { metric: 'Clicks', current: formatCompact(curr.clicks), previous: formatCompact(prev.clicks), change_pct: `${pct(curr.clicks, prev.clicks).toFixed(1)}%`, trend: 'down' }
        ],
        funnel: {
          steps: ['Impressions', 'Clicks', 'Conversions'],
          current: [curr.impressions, curr.clicks, curr.conversions],
          previous: [prev.impressions, prev.clicks, prev.conversions]
        }
      });

      setStep('results');
    }, 2500);
  };

  return (
    <div className="presentation-flow">
      {/* Header */}
      <div className="presentation-header">
        <button className="home-button" onClick={onExit}>
          <Home className="icon" />
          <span>Exit</span>
        </button>
        <div className="flow-title-wrapper">
          <h2 className="flow-title">Performance Debugging</h2>
        </div>
      </div>

      {/* Content */}
      <div className="presentation-content">
        <div className="step-container">
          {/* Upload Step */}
          {step === 'upload' && (
            <>
              <div className="step-header">
                <h1 className="step-title">Connect Your Campaign</h1>
                <p className="step-description">
                  Upload campaign data or connect your ad platform for AI-powered diagnosis
                </p>
              </div>

              <div className="upload-zone">
                <Upload className="upload-icon" />
                <h3 className="upload-title">Upload Campaign Data</h3>
                <p className="upload-desc">
                  CSV, Excel, creative assets (images/video), or direct platform export (Google Ads, Meta, TikTok)
                </p>
                <label className="upload-btn">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls,image/*,video/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  Choose File
                </label>
                
                <div className="or-divider">
                  <span>or connect directly</span>
                </div>

                <div className="platform-buttons">
                  <button className="platform-btn" onClick={() => alert('Google Ads integration coming soon')}>
                    <img src="https://www.google.com/favicon.ico" alt="Google" />
                    Google Ads
                  </button>
                  <button className="platform-btn" onClick={() => alert('Meta Ads integration coming soon')}>
                    <img src="https://www.facebook.com/favicon.ico" alt="Meta" />
                    Meta Ads
                  </button>
                  <button className="platform-btn" onClick={() => alert('TikTok Ads integration coming soon')}>
                    <img src="https://www.tiktok.com/favicon.ico" alt="TikTok" />
                    TikTok Ads
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Analyzing Step */}
          {step === 'analyzing' && (
            <div className="analyzing-state">
              <div className="analyzing-icon">
                <Brain className="icon spinning" />
              </div>
              <h2 className="analyzing-title">LCBM Analyzing Campaign Performance...</h2>
              <p className="analyzing-desc">
                Running AI diagnosis on creative performance, audience behavior, and funnel metrics
              </p>
              <div className="progress-bar-anim">
                <div className="progress-fill" />
              </div>
            </div>
          )}

          {/* Results Step */}
          {step === 'results' && diagnosis && (
            <>
              <div className="step-header">
                <h1 className="step-title">Performance Diagnosis Complete</h1>
                <p className="step-description">
                  Campaign: {campaignData?.name}
                </p>
              </div>

              {/* Campaign Overview */}
              <div className="model-output-box">
                <div className="model-header">
                  <Brain className="model-icon" />
                  <div>
                    <h3 className="model-title">Campaign Overview</h3>
                    <p className="model-subtitle">Current Performance Snapshot</p>
                  </div>
                </div>
                <div className="campaign-stats-grid">
                  <div className="stat-item-debug">
                    <span className="stat-label-debug">Total Spend</span>
                    <span className="stat-value-debug">{campaignData.spend}</span>
                  </div>
                  <div className="stat-item-debug">
                    <span className="stat-label-debug">Impressions</span>
                    <span className="stat-value-debug">{campaignData.impressions}</span>
                  </div>
                  <div className="stat-item-debug">
                    <span className="stat-label-debug">Clicks</span>
                    <span className="stat-value-debug">{campaignData.clicks}</span>
                  </div>
                  <div className="stat-item-debug">
                    <span className="stat-label-debug">Conversions</span>
                    <span className="stat-value-debug">{campaignData.conversions}</span>
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="diagnosis-card-debug">
                <div className="diagnosis-header-debug">
                  <AlertTriangle className="diag-icon-debug" />
                  <div>
                    <h3 className="diag-title-debug">{diagnosis.issue}</h3>
                    <span className="diag-severity high">Severity: {diagnosis.severity}</span>
                  </div>
                </div>

                <div className="diagnosis-sections-debug">
                  <div className="diag-section-debug">
                    <h4 className="diag-section-title">Root Cause</h4>
                    <p className="diag-section-text">{diagnosis.root_cause}</p>
                  </div>

                  <div className="diag-section-debug">
                    <h4 className="diag-section-title">Recommendation</h4>
                    <p className="diag-section-text">{diagnosis.recommendation}</p>
                  </div>

                  <div className="expected-improvement-debug">
                    <TrendingUp className="improvement-icon" />
                    <span>{diagnosis.expected_improvement}</span>
                  </div>
                </div>
              </div>

              {/* Underperforming Audiences */}
              {diagnosis.underperforming_audiences && diagnosis.underperforming_audiences.length > 0 && (
                <div className="debug-section-card">
                  <h3 className="debug-section-title">Underperforming Audiences</h3>
                  <p className="debug-section-desc">Segments below campaign average — consider pausing or refreshing creative</p>
                  <div className="underperforming-table-wrap">
                    <table className="underperforming-table">
                      <thead>
                        <tr>
                          <th>Audience</th>
                          <th>Spend</th>
                          <th>CPA</th>
                          <th>CTR</th>
                          <th>Conversions</th>
                          <th>Vs Avg</th>
                        </tr>
                      </thead>
                      <tbody>
                        {diagnosis.underperforming_audiences.map((aud, idx) => (
                          <tr key={idx}>
                            <td className="aud-name">{aud.name}</td>
                            <td>{aud.spend}</td>
                            <td>{aud.cpa}</td>
                            <td>{aud.ctr}</td>
                            <td>{aud.conversions.toLocaleString?.() ?? aud.conversions}</td>
                            <td className="delta-negative">{aud.delta_vs_avg}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* KPI Delta */}
              {diagnosis.kpi_deltas && diagnosis.kpi_deltas.length > 0 && (
                <div className="debug-section-card">
                  <h3 className="debug-section-title">KPI Delta (Current vs Previous Period)</h3>
                  <div className="kpi-delta-grid">
                    {diagnosis.kpi_deltas.map((kpi, idx) => (
                      <div key={idx} className="kpi-delta-item">
                        <span className="kpi-delta-metric">{kpi.metric}</span>
                        <span className="kpi-delta-current">{kpi.current}</span>
                        <span className="kpi-delta-prev">Prev: {kpi.previous}</span>
                        <span className={`kpi-delta-change ${kpi.trend === 'down' ? 'negative' : 'positive'}`}>
                          {kpi.change_pct}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Funnel Compare */}
              {diagnosis.funnel && diagnosis.funnel.steps && (
                <div className="debug-section-card">
                  <h3 className="debug-section-title">Funnel Comparison</h3>
                  <p className="debug-section-desc">This period vs previous period</p>
                  <div className="funnel-compare">
                    <div className="funnel-step-header">
                      <span className="funnel-step-name">Metric</span>
                      <span className="funnel-step-current">Current period</span>
                      <span className="funnel-step-prev">Previous period</span>
                      <span className="funnel-step-delta-label">Change</span>
                    </div>
                    {diagnosis.funnel.steps.map((stepName, idx) => {
                      const curr = diagnosis.funnel.current[idx];
                      const prev = diagnosis.funnel.previous[idx];
                      const currFormatted = curr >= 1e6 ? (curr / 1e6).toFixed(2) + 'M' : curr >= 1e3 ? (curr / 1e3).toFixed(1) + 'K' : curr.toLocaleString();
                      const prevFormatted = prev >= 1e6 ? (prev / 1e6).toFixed(2) + 'M' : prev >= 1e3 ? (prev / 1e3).toFixed(1) + 'K' : prev.toLocaleString();
                      const pct = prev > 0 ? (((curr - prev) / prev) * 100).toFixed(1) : 0;
                      return (
                        <div key={idx} className="funnel-step-row">
                          <span className="funnel-step-name">{stepName}</span>
                          <span className="funnel-step-current">{currFormatted}</span>
                          <span className="funnel-step-prev">{prevFormatted}</span>
                          <span className={`funnel-step-delta ${pct >= 0 ? 'positive' : 'negative'}`}>
                            {pct >= 0 ? '+' : ''}{pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recovery Actions */}
              <div className="recovery-actions-debug">
                <h3 className="recovery-title-debug">
                  <CheckCircle className="recovery-icon-debug" />
                  Recommended Actions
                </h3>
                <div className="actions-list-debug">
                  {diagnosis.recovery_actions.map((action, idx) => (
                    <div key={idx} className="action-item-debug">
                      <div className="action-number">{idx + 1}</div>
                      <span className="action-text">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export CTAs */}
              <div className="debug-export-actions">
                {uploadedFile && (
                  <button className="btn-secondary" onClick={() => setStep('creative')}>
                    <FileText className="btn-icon" />
                    View Creative Page
                  </button>
                )}
                <button className="btn-primary" onClick={() => alert('Export functionality coming soon - full diagnosis report')}>
                  <ArrowRight className="btn-icon" />
                  Export Full Diagnosis Report
                </button>
              </div>
            </>
          )}

          {/* Creative Page (replicated in-flow) */}
          {step === 'creative' && uploadedFile && diagnosis && (
            <div className="debug-creative-page-wrap">
              <div className="step-header">
                <h1 className="step-title">Your Creative</h1>
                <p className="step-description">
                  Uploaded asset and AI-generated alternatives. Use options below when done.
                </p>
              </div>

              {/* Uploaded creative card */}
              <div className="debug-creative-upload-section">
                <h3 className="debug-creative-block-title">Uploaded campaign / creative</h3>
                <div className="debug-creative-single">
                  <div className="debug-creative-preview-wrap">
                    {uploadedPreviewUrl ? (
                      uploadedFile.type.startsWith('video/') ? (
                        <video src={uploadedPreviewUrl} controls className="debug-creative-preview-media" />
                      ) : (
                        <img src={uploadedPreviewUrl} alt={uploadedFile.name} className="debug-creative-preview-img" />
                      )
                    ) : (
                      <div className="debug-creative-file-placeholder">
                        <FileText className="debug-creative-file-icon" />
                        <span className="debug-creative-file-label">Campaign data file</span>
                      </div>
                    )}
                  </div>
                  <div className="debug-creative-meta">
                    <span className="debug-creative-name">{uploadedFile.name}</span>
                    <span className="debug-creative-type">{uploadedFile.type || 'File'}</span>
                  </div>
                </div>
              </div>

              {/* Why it's not working (from diagnosis) */}
              <div className="debug-creative-diagnosis-box">
                <h3 className="debug-creative-block-title">
                  <AlertTriangle className="debug-creative-block-icon" />
                  Why it&apos;s not working
                </h3>
                <p className="debug-creative-diagnosis-text">{diagnosis.root_cause}</p>
                <p className="debug-creative-diagnosis-rec">{diagnosis.recommendation}</p>
              </div>

              {/* Generate AI variants */}
              {!generatedVariants.length && !generating && (
                <div className="compare-recommendation-card">
                  <Sparkles className="compare-rec-icon" />
                  <div className="compare-rec-content">
                    <h3 className="compare-rec-title">Generate new variants with our model</h3>
                    <p className="compare-rec-desc">
                      Get AI-generated creative variants scored for performance. We&apos;ll suggest hooks, visual direction, and copy angles.
                    </p>
                    <button type="button" className="compare-rec-cta" onClick={() => { setGenerating(true); setTimeout(() => { setGeneratedVariants(generateCreativeVariants([], { productName: campaignData?.name || 'Campaign', category: '' })); setGenerating(false); }, 2000); }}>
                      <Sparkles className="btn-icon" />
                      Generate AI variants
                    </button>
                  </div>
                </div>
              )}
              {generating && (
                <div className="analyzing-state" style={{ marginTop: 24 }}>
                  <div className="analyzing-icon"><Brain className="icon spinning" /></div>
                  <h2 className="analyzing-title">Generating variants...</h2>
                </div>
              )}
              {generatedVariants.length > 0 && (
                <div className="comparison-variants-section">
                  <h3 className="comparison-section-title">
                    <Sparkles className="inline-icon" />
                    AI-generated variants
                  </h3>
                  <div className="variants-grid">
                    {generatedVariants.map((variant) => {
                      const TypeIcon = typeIcons[variant.type] || Image;
                      return (
                        <div key={variant.id} className="variant-card">
                          <div className="variant-header">
                            <TypeIcon className="variant-type-icon" />
                            <h4 className="variant-name">{variant.name}</h4>
                            <div className="variant-score">{variant.lcbm_score}</div>
                          </div>
                          {variant.assets?.images?.length > 0 && (
                            <div className="assets-images">
                              {variant.assets.images.slice(0, 2).map((img) => (
                                <div key={img.id} className="asset-img-wrap">
                                  <img src={img.url} alt={img.type} className="asset-img" />
                                  <span className="asset-label">{img.type}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="variant-hook">
                            <span className="hook-label">Hook:</span>
                            <p className="hook-text">&quot;{variant.hook}&quot;</p>
                          </div>
                          <div className="why-high-performing">
                            <Star className="why-icon" />
                            <p className="why-text">{variant.why_high_performing}</p>
                          </div>
                          <div className="performance-metrics">
                            <div className="perf-metric">
                              <span className="perf-label">CTR</span>
                              <span className="perf-value">{variant.predicted_performance?.ctr}</span>
                            </div>
                            <div className="perf-metric">
                              <span className="perf-label">Engagement</span>
                              <span className="perf-value">{variant.predicted_performance?.engagement}</span>
                            </div>
                          </div>
                          <button type="button" className="download-variant-btn" onClick={() => alert(`Download ${variant.name} – coming soon`)}>
                            <Download className="btn-icon" /> Download
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom actions: Back to results, Download report */}
              <div className="debug-creative-page-actions">
                <button className="btn-secondary" onClick={() => setStep('results')}>
                  <ArrowRight className="btn-icon" style={{ transform: 'rotate(180deg)' }} />
                  Back to Performance Results
                </button>
                <button className="btn-secondary" onClick={() => alert('Download report – coming soon')}>
                  <FileText className="btn-icon" />
                  Download Report
                </button>
                <button className="btn-primary" onClick={() => alert('Export full diagnosis report – coming soon')}>
                  <ArrowRight className="btn-icon" />
                  Export Full Diagnosis Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PerformanceDebugFlow;