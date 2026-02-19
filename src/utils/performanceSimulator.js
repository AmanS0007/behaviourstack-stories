// Simulate performance predictions based on previous choices
export const simulatePerformance = (productData, audiences, creative) => {
    const baseMetrics = {
      cpa: 12 + Math.random() * 8, // $12-20
      roas: 2.5 + Math.random() * 1.5, // 2.5x - 4x
      ctr: 2.8 + Math.random() * 1.2, // 2.8% - 4%
      engagement: 5.0 + Math.random() * 2.5 // 5% - 7.5%
    };
  
    // Simulate 2 tracks
    const tracks = [
      {
        name: 'New Audiences',
        cpa: Math.round(baseMetrics.cpa * 10) / 10,
        roas: Math.round(baseMetrics.roas * 10) / 10,
        ctr: `${Math.round(baseMetrics.ctr * 10) / 10}%`,
        engagement: `${Math.round(baseMetrics.engagement * 10) / 10}%`,
        status: 'WINNING',
        insight: 'Strong performance across all metrics. This audience is responding well to the creative.'
      },
      {
        name: 'Existing Customers',
        cpa: Math.round((baseMetrics.cpa * 1.4) * 10) / 10,
        roas: Math.round((baseMetrics.roas * 0.65) * 10) / 10,
        ctr: `${Math.round((baseMetrics.ctr * 0.85) * 10) / 10}%`,
        engagement: `${Math.round((baseMetrics.engagement * 0.7) * 10) / 10}%`,
        status: 'UNDERPERFORMING',
        insight: 'Lower engagement suggests messaging mismatch with existing customer expectations.'
      }
    ];
  
    // Diagnosis
    const diagnosis = {
      type: 'AUDIENCE_MISMATCH',
      title: 'Creative-Audience Alignment Issue',
      not_the_problem: 'Ad delivery and targeting are working correctly',
      root_cause: 'The creative messaging resonates strongly with new audiences but creates friction with existing customers who have different expectations from the brand.',
      recommendation: 'Consider segmented messaging or focus budget on the high-performing new audience track.'
    };
  
    // Recovery strategies
    const recoveryStrategies = [
      {
        id: 'segment_messaging',
        label: 'Segment Messaging by Audience',
        emoji: '🎯',
        description: 'Create separate creative variants - one optimized for new audiences (current winner), another tailored for existing customers with brand-consistent messaging.',
        expected_lift: 'Existing customer ROAS: +45-60%',
        impact: 'Maintains new audience performance while fixing existing customer track'
      },
      {
        id: 'double_down',
        label: 'Double Down on Winners',
        emoji: '🚀',
        description: 'Reallocate 80% of budget to the high-performing new audience track. Accept lower performance on existing customers for now.',
        expected_lift: 'Overall ROAS: +25-35%',
        impact: 'Maximizes short-term returns, builds new customer base'
      },
      {
        id: 'gradual_shift',
        label: 'Gradual Transition Strategy',
        emoji: '📊',
        description: 'Slowly introduce new messaging to existing customers through email/owned channels first, then shift paid creative once they\'re primed.',
        expected_lift: 'Existing customer ROAS: +30-40% over 4 weeks',
        impact: 'Lower risk, longer timeline to full optimization'
      }
    ];
  
    return {
      tracks,
      diagnosis,
      recoveryStrategies,
      weeks_analyzed: 6
    };
  };
  
  // Generate market recommendations
  export const generateMarketRecommendations = (productData, audiences, creative, recovery) => {
    const category = productData.category?.toLowerCase() || '';
    
    let markets = [];
    
    // Different markets based on category
    if (category.includes('fitness') || category.includes('health')) {
      markets = [
        {
          id: 'austin',
          name: 'Austin, TX',
          emoji: '🤠',
          population: '1.0M',
          fit_score: 91,
          reason: 'High fitness culture density, strong health & wellness community',
          predicted_cpa: 14.20,
          predicted_roas: 3.4,
          budget_recommendation: 18000,
          key_advantage: 'CrossFit and outdoor fitness communities are 2x national average'
        },
        {
          id: 'denver',
          name: 'Denver, CO',
          emoji: '🏔️',
          population: '2.9M',
          fit_score: 89,
          reason: 'Active lifestyle culture, high disposable income, outdoor-focused',
          predicted_cpa: 12.80,
          predicted_roas: 3.6,
          budget_recommendation: 22000,
          key_advantage: 'Highest per-capita gym membership rate in US'
        },
        {
          id: 'portland',
          name: 'Portland, OR',
          emoji: '🌲',
          population: '2.5M',
          fit_score: 87,
          reason: 'Strong wellness culture, early adopter market, eco-conscious',
          predicted_cpa: 15.50,
          predicted_roas: 3.1,
          budget_recommendation: 16000,
          key_advantage: 'Early adopter market - trends start here then spread nationally'
        }
      ];
    } else if (category.includes('beauty') || category.includes('skincare')) {
      markets = [
        {
          id: 'la',
          name: 'Los Angeles, CA',
          emoji: '🌴',
          population: '3.9M',
          fit_score: 93,
          reason: 'Beauty capital, influencer hub, premium beauty spend',
          predicted_cpa: 16.20,
          predicted_roas: 3.2,
          budget_recommendation: 25000,
          key_advantage: 'Influencer density creates organic amplification'
        },
        {
          id: 'nyc',
          name: 'New York, NY',
          emoji: '🗽',
          population: '8.3M',
          fit_score: 91,
          reason: 'Premium market, high beauty spend, trend-forward',
          predicted_cpa: 18.50,
          predicted_roas: 2.9,
          budget_recommendation: 28000,
          key_advantage: 'Highest willingness to pay for premium beauty products'
        },
        {
          id: 'miami',
          name: 'Miami, FL',
          emoji: '🌊',
          population: '470K',
          fit_score: 88,
          reason: 'Beauty-conscious culture, Latin American influence, year-round focus',
          predicted_cpa: 14.80,
          predicted_roas: 3.3,
          budget_recommendation: 18000,
          key_advantage: 'Gateway to Latin American market expansion'
        }
      ];
    } else {
      // Generic markets
      markets = [
        {
          id: 'seattle',
          name: 'Seattle, WA',
          emoji: '☕',
          population: '3.4M',
          fit_score: 90,
          reason: 'Tech-savvy, high income, early adopter mindset',
          predicted_cpa: 15.20,
          predicted_roas: 3.3,
          budget_recommendation: 20000,
          key_advantage: 'Tech worker demographic aligns with innovation-seeking behavior'
        },
        {
          id: 'chicago',
          name: 'Chicago, IL',
          emoji: '🌬️',
          population: '2.7M',
          fit_score: 88,
          reason: 'Diverse demographics, strong middle market, test market proxy',
          predicted_cpa: 13.50,
          predicted_roas: 3.4,
          budget_recommendation: 19000,
          key_advantage: 'Representative of broader US market - test results scale well'
        },
        {
          id: 'atlanta',
          name: 'Atlanta, GA',
          emoji: '🍑',
          population: '5.9M',
          fit_score: 86,
          reason: 'Growing market, strong purchasing power, cultural influence',
          predicted_cpa: 12.80,
          predicted_roas: 3.5,
          budget_recommendation: 17000,
          key_advantage: 'Fastest growing major metro - early entry advantage'
        }
      ];
    }
  
    return markets;
  };