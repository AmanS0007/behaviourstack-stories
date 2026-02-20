import React, { useState } from 'react';
import { Home, Brain, ArrowRight, ArrowLeft, MapPin, TrendingUp, Target, DollarSign, Lightbulb, Star, AlertCircle } from 'lucide-react';
import '../../styles/PresentationFlow.css';
import '../../styles/Steps.css';

// Example company templates
const exampleCompanies = [
  {
    companyName: 'Peak Fitness Co.',
    industry: 'Fitness & Wellness',
    currentMarkets: 'California, New York',
    revenue: '12000000',
    targetExpansion: 'Looking to expand our connected fitness equipment to health-conscious metros with strong gym culture and disposable income',
    preferenceState: ''
  },
  {
    companyName: 'Vela Beauty Labs',
    industry: 'Clean Beauty & Skincare',
    currentMarkets: 'Los Angeles, Miami',
    revenue: '8500000',
    targetExpansion: 'Expanding our clean beauty line to markets with high luxury spending and ingredient-conscious consumers',
    preferenceState: ''
  },
  {
    companyName: 'Ember Roasts Coffee',
    industry: 'Specialty Coffee & Beverages',
    currentMarkets: 'Seattle, Portland, San Francisco',
    revenue: '15000000',
    targetExpansion: 'Seeking to bring our craft coffee to emerging coffee culture markets with young professional demographics',
    preferenceState: ''
  }
];

// Industry helpers for preference rating copy
function isBeauty(industryLower) {
  return industryLower.includes('beauty') || industryLower.includes('skincare') || industryLower.includes('cosmetic');
}
function isFitness(industryLower) {
  return industryLower.includes('fitness') || industryLower.includes('health') || industryLower.includes('wellness');
}
function isCoffee(industryLower) {
  return industryLower.includes('coffee') || industryLower.includes('beverage') || industryLower.includes('food');
}
function industryLabel(industryLower) {
  if (isBeauty(industryLower)) return 'beauty and lifestyle';
  if (isFitness(industryLower)) return 'fitness and wellness';
  if (isCoffee(industryLower)) return 'coffee and beverage';
  return 'your industry';
}

// Rate user's preferred state/region against company profile
function ratePreferenceState(preferenceState, industry, targetExpansion) {
  if (!preferenceState || !preferenceState.trim()) return null;
  const state = preferenceState.trim();
  const industryLower = (industry || '').toLowerCase();
  const category = industryLabel(industryLower);

  const stateLower = state.toLowerCase();
  let fitScore = 78;
  let verdict = 'Moderate fit';
  let pros = [];
  let cons = [];
  let summary = '';

  if (stateLower.includes('texas') || stateLower.includes('tx') || stateLower.includes('austin')) {
    fitScore = isFitness(industryLower) || isCoffee(industryLower) ? 89 : isBeauty(industryLower) ? 82 : 86;
    verdict = fitScore >= 88 ? 'Strong fit' : 'Good fit';
    pros = ['No state income tax', 'Fast-growing population', 'Strong tech and creative workforce'];
    cons = isBeauty(industryLower) ? ['Less established beauty hub vs. coastal markets'] : isCoffee(industryLower) ? ['Growing but competitive coffee scene'] : ['Competition in major metros'];
    summary = fitScore >= 88 ? `Texas aligns well with your expansion profile; Austin in particular is a top-tier market for ${category}.` : 'Texas offers solid growth potential with lower entry costs than coastal markets.';
  } else if (stateLower.includes('colorado') || stateLower.includes('co') || stateLower.includes('denver')) {
    fitScore = isFitness(industryLower) ? 91 : isCoffee(industryLower) ? 90 : isBeauty(industryLower) ? 85 : 85;
    verdict = fitScore >= 88 ? 'Strong fit' : 'Good fit';
    pros = ['High disposable income', 'Active lifestyle culture', 'Educated demographic'];
    cons = ['Higher cost of entry in Denver metro'];
    if (isFitness(industryLower)) summary = 'Colorado is an excellent match for fitness and health brands; Denver commands premium positioning.';
    else if (isCoffee(industryLower)) summary = 'Colorado is a strong market for coffee and beverage expansion with an active, on-the-go demographic.';
    else if (isBeauty(industryLower)) summary = 'Colorado offers a solid niche for premium and wellness-focused beauty with affluent demographics.';
    else summary = 'Colorado is an excellent match for your category; Denver commands premium positioning.';
  } else if (stateLower.includes('florida') || stateLower.includes('fl') || stateLower.includes('miami')) {
    fitScore = isBeauty(industryLower) ? 92 : isCoffee(industryLower) ? 86 : isFitness(industryLower) ? 85 : 84;
    verdict = fitScore >= 88 ? 'Strong fit' : 'Good fit';
    pros = ['Gateway to Latin American expansion', 'No state income tax', 'Year-round consumer activity'];
    cons = ['Seasonal tourism impact in some segments'];
    summary = `Florida, especially Miami, is a strong fit for ${category} expansion with international upside.`;
  } else if (stateLower.includes('california') || stateLower.includes('ca') || stateLower.includes('los angeles') || stateLower.includes('la')) {
    fitScore = isBeauty(industryLower) ? 96 : isFitness(industryLower) ? 90 : isCoffee(industryLower) ? 89 : 88;
    verdict = 'Strong fit';
    pros = ['Largest consumer market', 'Trend-setting demographics', 'Premium pricing power'];
    cons = ['Higher entry cost and competition'];
    summary = `California remains a flagship market for ${category}; entry cost is offset by scale and willingness to pay.`;
  } else if (stateLower.includes('arizona') || stateLower.includes('az') || stateLower.includes('scottsdale')) {
    fitScore = isBeauty(industryLower) ? 89 : isFitness(industryLower) ? 85 : isCoffee(industryLower) ? 84 : 83;
    verdict = 'Good fit';
    pros = ['Affluent demographics', 'Growing metro population', 'Strong spa and wellness culture'];
    cons = ['Smaller than coastal metros'];
    if (isBeauty(industryLower)) summary = 'Arizona offers a strong niche for premium beauty and wellness with lower competition.';
    else if (isFitness(industryLower) || isCoffee(industryLower)) summary = 'Arizona offers solid growth potential for your category with affluent demographics.';
    else summary = 'Arizona offers a strong niche for premium and wellness-focused brands with lower competition.';
  } else if (stateLower.includes('tennessee') || stateLower.includes('tn') || stateLower.includes('nashville')) {
    fitScore = isFitness(industryLower) || isCoffee(industryLower) ? 87 : isBeauty(industryLower) ? 82 : 81;
    verdict = 'Good fit';
    pros = ['Fastest-growing metro', 'Lower entry costs', 'Young professional influx'];
    cons = ['Emerging market; less established than coastal hubs'];
    if (isCoffee(industryLower)) summary = 'Tennessee is an attractive growth market for coffee and beverage with a fast-growing, young demographic.';
    else if (isFitness(industryLower)) summary = 'Tennessee offers strong fitness and wellness potential with lower barriers to entry.';
    else if (isBeauty(industryLower)) summary = 'Tennessee is an emerging market for beauty with rising disposable income and population growth.';
    else summary = 'Tennessee is an attractive growth market with lower barriers to entry and strong demographic trends.';
  } else {
    pros = ['Market size and growth potential evaluated', 'Entry costs typically moderate outside top-tier metros'];
    cons = ['Consider validating with local demand data'];
    summary = `We've scored ${state} against your ${industry ? 'industry profile' : 'profile'}. Review our top recommendations below for comparison.`;
  }

  return { stateOrRegion: state, fitScore, verdict, pros, cons, summary };
}

function RegionalExpansionFlow({ onExit }) {
  const [step, setStep] = useState('input'); // 'input', 'analyzing', 'results'
  const [companyData, setCompanyData] = useState({
    companyName: '',
    industry: '',
    currentMarkets: '',
    revenue: '',
    targetExpansion: '',
    preferenceState: ''
  });
  const [markets, setMarkets] = useState([]);
  const [preferenceRating, setPreferenceRating] = useState(null);

  const handleInputChange = (field, value) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  const handleUseTemplate = (template) => {
    setCompanyData({ ...template, preferenceState: template.preferenceState ?? '' });
  };

  const handleAnalyze = () => {
    if (!companyData.companyName || !companyData.industry) {
      alert('Please fill in at least company name and industry');
      return;
    }

    setStep('analyzing');

    // Simulate analysis
    setTimeout(() => {
      const generatedMarkets = generateMarketsForIndustry(companyData.industry);
      setMarkets(generatedMarkets);
      const rating = ratePreferenceState(companyData.preferenceState, companyData.industry, companyData.targetExpansion);
      setPreferenceRating(rating);
      setStep('results');
    }, 2000);
  };

  const generateMarketsForIndustry = (industry) => {
    const industryLower = industry.toLowerCase();

    // Fitness markets
    if (industryLower.includes('fitness') || industryLower.includes('health') || industryLower.includes('wellness')) {
      return [
        {
          id: 'austin',
          name: 'Austin, TX',
          emoji: '🤠',
          fit_score: 94,
          population: '2.3M',
          reason: 'Highest fitness culture density in US, strong outdoor lifestyle, and tech-savvy health-conscious demographic',
          predicted_roi: '3.6x',
          entry_cost: '$165K',
          timeline: '4-6 months',
          key_advantages: [
            'CrossFit participation 3x national average',
            'Fastest growing fitness market',
            'Strong influencer & creator economy'
          ]
        },
        {
          id: 'denver',
          name: 'Denver, CO',
          emoji: '🏔️',
          fit_score: 91,
          population: '2.9M',
          reason: 'Active outdoor lifestyle, highest gym membership rates, premium fitness market with high disposable income',
          predicted_roi: '3.4x',
          entry_cost: '$195K',
          timeline: '5-7 months',
          key_advantages: [
            '#1 healthiest metro in US',
            'Premium pricing power',
            'Year-round outdoor activity culture'
          ]
        },
        {
          id: 'nashville',
          name: 'Nashville, TN',
          emoji: '🎸',
          fit_score: 88,
          population: '1.9M',
          reason: 'Rapidly growing market, strong millennial fitness adoption, and emerging wellness scene',
          predicted_roi: '3.1x',
          entry_cost: '$140K',
          timeline: '4-5 months',
          key_advantages: [
            'Fastest population growth',
            'Lower entry costs vs coastal markets',
            'Rising fitness studio density'
          ]
        }
      ];
    }

    // Beauty markets
    if (industryLower.includes('beauty') || industryLower.includes('skincare') || industryLower.includes('cosmetic')) {
      return [
        {
          id: 'la',
          name: 'Los Angeles, CA',
          emoji: '🌴',
          fit_score: 96,
          population: '13.2M',
          reason: 'Beauty capital of US, highest clean beauty penetration, influencer hub with premium spending power',
          predicted_roi: '3.8x',
          entry_cost: '$280K',
          timeline: '6-8 months',
          key_advantages: [
            'Beauty influencer density 10x national average',
            'Early adopter of clean beauty trends',
            'Premium pricing market'
          ]
        },
        {
          id: 'miami',
          name: 'Miami, FL',
          emoji: '🌊',
          fit_score: 92,
          population: '6.1M',
          reason: 'Year-round beauty focus, Latin American influence, luxury skincare market with international reach',
          predicted_roi: '3.5x',
          entry_cost: '$220K',
          timeline: '5-7 months',
          key_advantages: [
            'Gateway to Latin American expansion',
            'Premium beauty spending culture',
            'Climate drives skincare awareness'
          ]
        },
        {
          id: 'scottsdale',
          name: 'Scottsdale, AZ',
          emoji: '🌵',
          fit_score: 89,
          population: '5.0M',
          reason: 'Highest luxury beauty spend per capita, spa culture, affluent demographic focused on anti-aging',
          predicted_roi: '3.3x',
          entry_cost: '$190K',
          timeline: '4-6 months',
          key_advantages: [
            'Highest household income for beauty',
            'Strong spa & wellness integration',
            'Desert climate = skincare priority'
          ]
        }
      ];
    }

    // Coffee/Beverage markets
    if (industryLower.includes('coffee') || industryLower.includes('beverage') || industryLower.includes('food')) {
      return [
        {
          id: 'austin',
          name: 'Austin, TX',
          emoji: '🤠',
          fit_score: 93,
          population: '2.3M',
          reason: 'Emerging coffee culture, tech worker concentration, high cafe spending with craft coffee adoption',
          predicted_roi: '3.5x',
          entry_cost: '$145K',
          timeline: '4-5 months',
          key_advantages: [
            'Tech worker cafe culture',
            'Growing specialty coffee scene',
            'Third-wave coffee adoption accelerating'
          ]
        },
        {
          id: 'denver',
          name: 'Denver, CO',
          emoji: '🏔️',
          fit_score: 90,
          population: '2.9M',
          reason: 'Strong coffee culture, outdoor lifestyle pairs with convenience, mobile professional demographic',
          predicted_roi: '3.2x',
          entry_cost: '$175K',
          timeline: '5-6 months',
          key_advantages: [
            'On-the-go consumption culture',
            'Premium coffee market',
            'Active lifestyle integration'
          ]
        },
        {
          id: 'nashville',
          name: 'Nashville, TN',
          emoji: '🎸',
          fit_score: 87,
          population: '1.9M',
          reason: 'Rapidly growing coffee scene, young professional influx, emerging foodie culture',
          predicted_roi: '2.9x',
          entry_cost: '$130K',
          timeline: '4-5 months',
          key_advantages: [
            'Fastest growing coffee market',
            'Lower entry costs',
            'Creative class concentration'
          ]
        }
      ];
    }

    // Generic markets for other industries
    return [
      {
        id: 'austin',
        name: 'Austin, TX',
        emoji: '🤠',
        fit_score: 91,
        population: '2.3M',
        reason: 'High growth market with strong tech sector presence and young professional demographic',
        predicted_roi: '3.4x',
        entry_cost: '$180K',
        timeline: '4-6 months',
        key_advantages: [
          'No state income tax',
          'Strong startup ecosystem',
          'Growing population (+2.5% YoY)'
        ]
      },
      {
        id: 'denver',
        name: 'Denver, CO',
        emoji: '🏔️',
        fit_score: 88,
        population: '2.9M',
        reason: 'Educated workforce, high disposable income, and strong economic growth',
        predicted_roi: '3.1x',
        entry_cost: '$220K',
        timeline: '5-7 months',
        key_advantages: [
          'Highly educated workforce',
          'Strong economic growth',
          'Central US location'
        ]
      },
      {
        id: 'miami',
        name: 'Miami, FL',
        emoji: '🌴',
        fit_score: 86,
        population: '6.1M',
        reason: 'Gateway to Latin America, diverse market, and growing business hub',
        predicted_roi: '2.9x',
        entry_cost: '$250K',
        timeline: '6-8 months',
        key_advantages: [
          'Latin American gateway',
          'No state income tax',
          'International business hub'
        ]
      }
    ];
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
          <h2 className="flow-title">Regional Expansion Intelligence</h2>
        </div>
      </div>

      {/* Content */}
      <div className="presentation-content">
        <div className="step-container">
          {/* Input Step */}
          {step === 'input' && (
            <>
              <div className="step-header">
                <h1 className="step-title">Company Overview</h1>
                <p className="step-description">
                  Select an example or enter your company details for market recommendations
                </p>
              </div>

              {/* Example Templates */}
              <div className="templates-section">
                <p className="templates-label">
                  <Lightbulb className="label-icon" />
                  Quick start with an example:
                </p>
                <div className="templates-grid">
                  {exampleCompanies.map((template, idx) => (
                    <button
                      key={idx}
                      className="template-card"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <div className="template-icon">
                        {idx === 0 && '💪'}
                        {idx === 1 && '✨'}
                        {idx === 2 && '☕'}
                      </div>
                      <div className="template-content">
                        <h4 className="template-name">{template.companyName}</h4>
                        <p className="template-desc">{template.industry}</p>
                      </div>
                      <ArrowRight className="template-arrow" />
                    </button>
                  ))}
                </div>
                <div className="or-divider">
                  <span>or enter your own company details</span>
                </div>
              </div>

              <div className="form-card">
                <div className="form-section">
                  <div className="form-grid">
                    <div className="form-group full">
                      <label className="form-label">
                        Company Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., Peak Fitness Co."
                        value={companyData.companyName}
                        onChange={e => handleInputChange('companyName', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Industry <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., Fitness, SaaS, Beauty"
                        value={companyData.industry}
                        onChange={e => handleInputChange('industry', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Annual Revenue</label>
                      <div className="input-with-prefix">
                        <span className="input-prefix">$</span>
                        <input
                          type="text"
                          className="form-input with-prefix"
                          placeholder="0"
                          value={companyData.revenue}
                          onChange={e => handleInputChange('revenue', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group full">
                      <label className="form-label">Current Markets</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., California, New York, Texas"
                        value={companyData.currentMarkets}
                        onChange={e => handleInputChange('currentMarkets', e.target.value)}
                      />
                    </div>

                    <div className="form-group full">
                      <label className="form-label">Expansion Goals</label>
                      <textarea
                        className="form-textarea"
                        rows={3}
                        placeholder="What are you looking to achieve with regional expansion?"
                        value={companyData.targetExpansion}
                        onChange={e => handleInputChange('targetExpansion', e.target.value)}
                      />
                    </div>

                    <div className="form-group full">
                      <label className="form-label">Preferred state(s) or region(s)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., Texas, Colorado, Florida (where you're planning to expand)"
                        value={companyData.preferenceState}
                        onChange={e => handleInputChange('preferenceState', e.target.value)}
                      />
                      <p className="form-hint">We’ll rate your preference and compare it with our top recommendations.</p>
                    </div>
                  </div>
                </div>

                <div className="info-box">
                  <Brain className="info-icon" />
                  <div>
                    <p className="info-title">What happens next?</p>
                    <p className="info-text">
                      LCBM will analyze your company profile and identify the top 3 markets
                      for expansion based on growth potential, competitive landscape, and
                      entry costs.
                    </p>
                  </div>
                </div>

                <button className="btn-primary" onClick={handleAnalyze}>
                  <Brain className="btn-icon" />
                  Analyze Market Opportunities
                  <ArrowRight className="btn-icon" />
                </button>
              </div>
            </>
          )}

          {/* Analyzing Step */}
          {step === 'analyzing' && (
            <div className="analyzing-state">
              <div className="analyzing-icon">
                <Brain className="icon spinning" />
              </div>
              <h2 className="analyzing-title">LCBM Analyzing Market Opportunities...</h2>
              <p className="analyzing-desc">
                Evaluating demographics, competition, growth rates, and entry barriers
                across 50+ US markets for {companyData.industry}
              </p>
              <div className="progress-bar-anim">
                <div className="progress-fill" />
              </div>
            </div>
          )}

          {/* Results Step */}
          {step === 'results' && markets.length > 0 && (
            <>
              <div className="step-header">
                <h1 className="step-title">Market Recommendations</h1>
                <p className="step-description">
                  Your preference rating and top 3 markets for {companyData.companyName}
                </p>
              </div>

              {/* Block 1: Rating of their preference */}
              {preferenceRating && (
                <div className="expansion-preference-rating">
                  <h2 className="expansion-preference-title">
                    <Target className="expansion-preference-title-icon" />
                    Your preferred region: {preferenceRating.stateOrRegion}
                  </h2>
                  <p className="expansion-preference-intro">
                    Based on your company profile and expansion goals, here’s how this region stacks up.
                  </p>
                  <div className="expansion-preference-card">
                    <div className="expansion-preference-score-row">
                      <div className="expansion-preference-fit">
                        <span className="expansion-preference-fit-value">{preferenceRating.fitScore}</span>
                        <span className="expansion-preference-fit-label">Fit score</span>
                      </div>
                      <span className={`expansion-preference-verdict ${preferenceRating.verdict.replace(/\s+/g, '-').toLowerCase()}`}>
                        {preferenceRating.verdict}
                      </span>
                    </div>
                    <p className="expansion-preference-summary">{preferenceRating.summary}</p>
                    <div className="expansion-preference-pros-cons">
                      <div className="expansion-preference-list">
                        <h4 className="expansion-preference-list-title">
                          <Star className="expansion-list-icon" /> Pros
                        </h4>
                        <ul>
                          {preferenceRating.pros.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="expansion-preference-list">
                        <h4 className="expansion-preference-list-title">
                          <AlertCircle className="expansion-list-icon" /> Considerations
                        </h4>
                        <ul>
                          {preferenceRating.cons.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Block 2: Our top recommendations */}
              <div className="expansion-our-recommendations">
                <h2 className="expansion-our-rec-title">
                  <Brain className="expansion-our-rec-icon" />
                  Our top market recommendations
                </h2>
                {preferenceRating && (
                  <p className="expansion-our-rec-compare">
                    Compared to your preference, we recommend prioritizing these markets for best fit with your industry and goals.
                  </p>
                )}
              </div>

              <div className="model-output-box">
                <div className="model-header">
                  <Brain className="model-icon" />
                  <div>
                    <h3 className="model-title">🤖 LCBM Regional Analysis Complete</h3>
                    <p className="model-subtitle">
                      Based on: {companyData.industry} industry profile
                    </p>
                  </div>
                </div>
              </div>

              <div className="markets-grid-expansion">
                {markets.map((market, idx) => (
                  <div key={market.id} className="expansion-market-card">
                    <div className="expansion-market-header">
                      <div className="expansion-rank">#{idx + 1}</div>
                      <div className="expansion-market-info">
                        <h3 className="expansion-market-name">{market.name}</h3>
                        <p className="expansion-population">{market.population} metro area</p>
                      </div>
                      <div className="expansion-fit-score">
                        <span className="fit-score-large">{market.fit_score}</span>
                        <span className="fit-label-small">Fit</span>
                      </div>
                    </div>

                    <div className="expansion-reason">
                      <Target className="reason-icon-expansion" />
                      <p>{market.reason}</p>
                    </div>

                    <div className="expansion-metrics">
                      <div className="expansion-metric">
                        <TrendingUp className="metric-icon-expansion" />
                        <div>
                          <span className="metric-label-expansion">Predicted ROI</span>
                          <span className="metric-value-expansion green">{market.predicted_roi}</span>
                        </div>
                      </div>
                      <div className="expansion-metric">
                        <DollarSign className="metric-icon-expansion" />
                        <div>
                          <span className="metric-label-expansion">Entry Cost</span>
                          <span className="metric-value-expansion">{market.entry_cost}</span>
                        </div>
                      </div>
                      <div className="expansion-metric">
                        <MapPin className="metric-icon-expansion" />
                        <div>
                          <span className="metric-label-expansion">Timeline</span>
                          <span className="metric-value-expansion">{market.timeline}</span>
                        </div>
                      </div>
                    </div>

                    <div className="expansion-advantages">
                      <h4 className="advantages-title">Key Advantages:</h4>
                      <ul className="advantages-list">
                        {market.key_advantages.map((adv, i) => (
                          <li key={i}>{adv}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="expansion-results-actions">
                <button className="btn-secondary" onClick={() => setStep('input')}>
                  <ArrowLeft className="btn-icon" />
                  Back to Company Overview
                </button>
                <button className="btn-primary" onClick={() => alert('Export functionality coming soon')}>
                  <ArrowRight className="btn-icon" />
                  Download Full Market Analysis Report
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegionalExpansionFlow;