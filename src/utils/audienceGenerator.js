// Generate audiences based on product category; scope with target geography when provided
export const generateAudiences = (productData) => {
  const category = productData.category?.toLowerCase() || '';
  const productName = productData.productName || 'Product';
  const price = parseFloat(productData.price) || 50;
  const targetRegions = productData.targetRegions?.trim() || null;

  let list;
  if (category.includes('fitness') || category.includes('health') || category.includes('sport')) {
    list = getFitnessAudiences(productName, price);
  } else if (category.includes('beauty') || category.includes('skincare') || category.includes('cosmetic')) {
    list = getBeautyAudiences(productName, price);
  } else if (category.includes('food') || category.includes('beverage') || category.includes('drink')) {
    list = getBeverageAudiences(productName, price);
  } else {
    list = getGenericAudiences(productName, price);
  }

  return list.map((aud) => ({
    ...aud,
    region: targetRegions || 'Not specified'
  }));
};

const getFitnessAudiences = (productName, price) => [
  {
    id: 'fitness_enthusiasts',
    name: 'Fitness Enthusiasts',
    size: '2.4M',
    fit_score: 92,
    icon: '💪',
    demographics: 'Adults 25-42, active lifestyle',
    psychographics: 'Goal-oriented, tracks progress, values performance data',
    why_fit: `High affinity for ${productName}. This audience actively seeks fitness tools and tracks their progress.`,
    content_affinities: [
      { name: 'Workout Videos', strength: 94, reason: 'Core content consumption habit' },
      { name: 'Fitness App Reviews', strength: 88, reason: 'Research before purchase' },
      { name: 'Performance Tracking', strength: 91, reason: 'Data-driven mindset' }
    ],
    behavioral_signals: ['Engages with fitness content daily', 'Owns 3+ fitness apps', 'Shares workout achievements'],
    recommended_messaging: 'Performance-focused, data-driven, achievement-oriented'
  },
  {
    id: 'home_gym_builders',
    name: 'Home Gym Builders',
    size: '1.8M',
    fit_score: 89,
    icon: '🏠',
    demographics: 'Homeowners 28-50, invested in home fitness',
    psychographics: 'Quality-focused, long-term mindset, willing to invest',
    why_fit: `Perfect for ${productName}. Already invested heavily in home gym equipment.`,
    content_affinities: [
      { name: 'Home Gym Setup', strength: 96, reason: 'Primary interest area' },
      { name: 'Equipment Reviews', strength: 90, reason: 'Research-heavy buyers' },
      { name: 'Fitness Tech', strength: 85, reason: 'Early adopters of connected fitness' }
    ],
    behavioral_signals: ['Purchased gym equipment in last 6 months', 'Follows home gym influencers', 'Premium buyer profile'],
    recommended_messaging: 'Quality investment, complete setup, professional-grade'
  },
  {
    id: 'crossfit_community',
    name: 'CrossFit Community',
    size: '1.2M',
    fit_score: 87,
    icon: '🏋️',
    demographics: 'Mixed gender 22-40, competitive mindset',
    psychographics: 'Community-driven, skill-focused, embraces challenges',
    why_fit: `${productName} aligns with CrossFit training methodologies and community values.`,
    content_affinities: [
      { name: 'CrossFit Content', strength: 97, reason: 'Identity and lifestyle' },
      { name: 'Skill Tutorials', strength: 92, reason: 'Always leveling up' },
      { name: 'Competition Prep', strength: 88, reason: 'Performance-oriented' }
    ],
    behavioral_signals: ['Member of CrossFit box', 'Attends competitions', 'Vocal brand advocates'],
    recommended_messaging: 'Community-approved, competition-ready, skill progression'
  },
  {
    id: 'busy_professionals',
    name: 'Busy Professionals',
    size: '3.2M',
    fit_score: 84,
    icon: '💼',
    demographics: 'Working professionals 28-45',
    psychographics: 'Time-constrained, efficiency-focused, health-conscious',
    why_fit: `${productName} offers time-efficient solution for busy schedules.`,
    content_affinities: [
      { name: 'Quick Workout Content', strength: 90, reason: 'Time is the constraint' },
      { name: 'Productivity Hacks', strength: 85, reason: 'Optimization mindset' },
      { name: 'Morning Routine', strength: 82, reason: 'Structure-oriented' }
    ],
    behavioral_signals: ['Works 50+ hours/week', 'Prioritizes efficiency', 'Early morning exerciser'],
    recommended_messaging: 'Time-efficient, effective, fits your schedule'
  }
];

const getBeautyAudiences = (productName, price) => [
  {
    id: 'clean_beauty_advocates',
    name: 'Clean Beauty Advocates',
    size: '2.1M',
    fit_score: 94,
    icon: '🌿',
    demographics: 'Women 25-45, ingredient-conscious',
    psychographics: 'Ingredient-obsessed, reads labels, values transparency',
    why_fit: `${productName} meets the ingredient standards this audience demands.`,
    content_affinities: [
      { name: 'Ingredient Education', strength: 96, reason: 'Primary research method' },
      { name: 'Clean Beauty Reviews', strength: 92, reason: 'Trusted validation source' },
      { name: 'Dermatologist Content', strength: 88, reason: 'Clinical authority matters' }
    ],
    behavioral_signals: ['Checks EWG database', 'Reads full ingredient lists', 'Follows clean beauty influencers'],
    recommended_messaging: 'Transparent ingredients, clinically backed, clean formulation'
  },
  {
    id: 'luxury_self_care',
    name: 'Luxury Self-Care Ritualists',
    size: '1.9M',
    fit_score: 91,
    icon: '✨',
    demographics: 'Women 28-50, HHI $75K+',
    psychographics: 'Self-care as lifestyle, premium buyer, sensory-driven',
    why_fit: `${productName} fits the premium self-care routine this audience invests in.`,
    content_affinities: [
      { name: 'Luxury Beauty Content', strength: 94, reason: 'Aspirational consumption' },
      { name: 'Self-Care Routines', strength: 90, reason: 'Ritual is identity' },
      { name: 'Spa & Wellness', strength: 87, reason: 'Experience-oriented' }
    ],
    behavioral_signals: ['Spends $200+/month on beauty', 'Premium product preference', 'Ritual-driven behavior'],
    recommended_messaging: 'Luxurious experience, elevated ritual, premium quality'
  },
  {
    id: 'skincare_enthusiasts',
    name: 'Skincare Enthusiasts',
    size: '2.8M',
    fit_score: 89,
    icon: '💆',
    demographics: 'Mixed gender 22-40, skincare-focused',
    psychographics: 'Multi-step routines, researches actives, follows trends',
    why_fit: `${productName} complements the extensive routines this audience maintains.`,
    content_affinities: [
      { name: 'Skincare Science', strength: 93, reason: 'Education-driven purchase' },
      { name: 'Product Reviews', strength: 91, reason: 'Research before trying' },
      { name: 'Routine Videos', strength: 88, reason: 'Community validation' }
    ],
    behavioral_signals: ['Owns 15+ skincare products', 'Follows skincare Reddit', 'Early adopter of new actives'],
    recommended_messaging: 'Science-backed, fits your routine, proven actives'
  },
  {
    id: 'new_moms',
    name: 'New Mothers',
    size: '1.5M',
    fit_score: 86,
    icon: '👶',
    demographics: 'Mothers 25-38, first 2 years postpartum',
    psychographics: 'Safety-conscious, time-poor, gentle formulation focus',
    why_fit: `${productName} offers safe, gentle solution for postpartum skin changes.`,
    content_affinities: [
      { name: 'Postpartum Content', strength: 92, reason: 'Life stage identity' },
      { name: 'Safe Products', strength: 95, reason: 'Safety is non-negotiable' },
      { name: 'Quick Routines', strength: 88, reason: 'Time constraint' }
    ],
    behavioral_signals: ['Researches safety obsessively', 'Values multitasking products', 'Community recommendations'],
    recommended_messaging: 'Safe for nursing, gentle formula, time-efficient'
  }
];

const getBeverageAudiences = (productName, price) => [
  {
    id: 'coffee_enthusiasts',
    name: 'Coffee Enthusiasts',
    size: '2.6M',
    fit_score: 93,
    icon: '☕',
    demographics: 'Adults 25-45, daily coffee drinkers',
    psychographics: 'Quality-focused, ritual-driven, brand loyal',
    why_fit: `${productName} meets the quality standards this audience expects from their coffee.`,
    content_affinities: [
      { name: 'Coffee Culture', strength: 96, reason: 'Identity and lifestyle' },
      { name: 'Brewing Methods', strength: 90, reason: 'Process appreciation' },
      { name: 'Origin Stories', strength: 87, reason: 'Values provenance' }
    ],
    behavioral_signals: ['Drinks coffee daily', 'Owns brewing equipment', 'Follows coffee influencers'],
    recommended_messaging: 'Quality beans, craft approach, origin story'
  },
  {
    id: 'busy_commuters',
    name: 'Busy Commuters',
    size: '3.4M',
    fit_score: 88,
    icon: '🚗',
    demographics: 'Working adults 25-50, long commutes',
    psychographics: 'Convenience-focused, time-constrained, quality matters',
    why_fit: `${productName} provides convenient solution for on-the-go consumption.`,
    content_affinities: [
      { name: 'Productivity Hacks', strength: 89, reason: 'Optimization mindset' },
      { name: 'Convenience Products', strength: 92, reason: 'Time-saving priority' },
      { name: 'Morning Routines', strength: 85, reason: 'Structure-oriented' }
    ],
    behavioral_signals: ['Commutes 45+ min daily', 'Buys convenience items', 'Morning coffee essential'],
    recommended_messaging: 'Convenient, quality on-the-go, no compromise'
  },
  {
    id: 'health_conscious',
    name: 'Health-Conscious Consumers',
    size: '2.2M',
    fit_score: 85,
    icon: '🥗',
    demographics: 'Adults 28-50, wellness-focused',
    psychographics: 'Ingredient-aware, functional benefits, clean label',
    why_fit: `${productName} aligns with clean ingredient and functional benefit priorities.`,
    content_affinities: [
      { name: 'Wellness Content', strength: 93, reason: 'Lifestyle identity' },
      { name: 'Nutrition Labels', strength: 90, reason: 'Reads everything' },
      { name: 'Functional Foods', strength: 87, reason: 'Benefits-driven' }
    ],
    behavioral_signals: ['Checks ingredients', 'Premium for quality', 'Wellness community member'],
    recommended_messaging: 'Clean ingredients, functional benefits, transparent sourcing'
  },
  {
    id: 'social_sharers',
    name: 'Social Experience Seekers',
    size: '2.9M',
    fit_score: 82,
    icon: '📸',
    demographics: 'Adults 22-35, socially active',
    psychographics: 'Experience-driven, shareable moments, brand discovery',
    why_fit: `${productName} offers shareable, Instagram-worthy experience.`,
    content_affinities: [
      { name: 'Instagram Content', strength: 95, reason: 'Primary platform' },
      { name: 'Brand Discovery', strength: 88, reason: 'Early adopter' },
      { name: 'Aesthetic Products', strength: 91, reason: 'Visual appeal matters' }
    ],
    behavioral_signals: ['Posts food/drink content', 'Follows lifestyle brands', 'Tries new products first'],
    recommended_messaging: 'Instagram-worthy, unique experience, share-worthy'
  }
];

const getGenericAudiences = (productName, price) => [
  {
    id: 'early_adopters',
    name: 'Early Adopters',
    size: '2.1M',
    fit_score: 90,
    icon: '🚀',
    demographics: 'Adults 25-42, tech-forward',
    psychographics: 'Innovation-seeking, willing to try new, influence others',
    why_fit: `${productName} appeals to this audience's desire for new and innovative products.`,
    content_affinities: [
      { name: 'Product Launches', strength: 94, reason: 'First to know' },
      { name: 'Innovation Content', strength: 91, reason: 'Novelty-driven' },
      { name: 'Review Content', strength: 88, reason: 'Research but adopt early' }
    ],
    behavioral_signals: ['Early product adopter', 'Shares discoveries', 'Influences peer purchases'],
    recommended_messaging: 'New innovation, first access, cutting-edge'
  },
  {
    id: 'quality_seekers',
    name: 'Quality-Focused Buyers',
    size: '2.8M',
    fit_score: 88,
    icon: '⭐',
    demographics: 'Adults 30-55, established professionals',
    psychographics: 'Value quality over price, research-heavy, brand loyal',
    why_fit: `${productName} meets the quality standards this audience demands.`,
    content_affinities: [
      { name: 'Product Reviews', strength: 93, reason: 'Thorough research' },
      { name: 'Quality Comparisons', strength: 90, reason: 'Evaluates options' },
      { name: 'Expert Opinions', strength: 87, reason: 'Authority validation' }
    ],
    behavioral_signals: ['Reads multiple reviews', 'Premium buyer', 'Brand loyalty'],
    recommended_messaging: 'Superior quality, proven performance, worth the investment'
  },
  {
    id: 'value_conscious',
    name: 'Value-Conscious Shoppers',
    size: '3.5M',
    fit_score: 84,
    icon: '💰',
    demographics: 'Adults 25-50, budget-aware',
    psychographics: 'Seeks value, compares options, practical mindset',
    why_fit: `${productName} offers strong value proposition for price point.`,
    content_affinities: [
      { name: 'Price Comparisons', strength: 92, reason: 'Budget-driven' },
      { name: 'Value Content', strength: 89, reason: 'ROI focused' },
      { name: 'Deals & Discounts', strength: 86, reason: 'Savings-oriented' }
    ],
    behavioral_signals: ['Compares prices', 'Uses coupon codes', 'Waits for sales'],
    recommended_messaging: 'Best value, competitive pricing, smart investment'
  },
  {
    id: 'brand_loyalists',
    name: 'Brand Loyalists',
    size: '1.9M',
    fit_score: 86,
    icon: '💙',
    demographics: 'Adults 28-55, established preferences',
    psychographics: 'Loyal to trusted brands, repeat purchase, advocates',
    why_fit: `${productName} can build long-term loyalty with this audience.`,
    content_affinities: [
      { name: 'Brand Content', strength: 94, reason: 'Following favorites' },
      { name: 'Community Content', strength: 88, reason: 'Brand community member' },
      { name: 'Behind-the-Scenes', strength: 85, reason: 'Connection to brand' }
    ],
    behavioral_signals: ['Repeat purchaser', 'Recommends to others', 'Engages with brand'],
    recommended_messaging: 'Join our community, trusted quality, built to last'
  }
];

// Generate audiences from existing customer data
export const generateExistingAudiences = (productData) => {
  const existingCustomers = parseInt(productData.existingCustomers) || 0;
  
  const segments = [
    {
      id: 'high_value_customers',
      name: 'High-Value Customers',
      size: Math.round(existingCustomers * 0.15).toLocaleString(),
      fit_score: 96,
      icon: '💎',
      demographics: 'Top 15% by lifetime value',
      psychographics: 'Repeat purchasers, high AOV, brand advocates',
      why_fit: 'Your most loyal customers with highest propensity to buy new products',
      content_affinities: [
        { name: 'Your Brand Content', strength: 98, reason: 'Highly engaged with your brand' },
        { name: 'Premium Products', strength: 91, reason: 'Spend above average' },
        { name: 'Loyalty Programs', strength: 88, reason: 'Enrolled and active' }
      ],
      behavioral_signals: ['3+ purchases in last year', 'High email engagement', 'Refers others'],
      recommended_messaging: 'Exclusive first access, trusted quality, valued customer',
      data_source: 'Existing customer data'
    },
    {
      id: 'frequent_buyers',
      name: 'Frequent Buyers',
      size: Math.round(existingCustomers * 0.25).toLocaleString(),
      fit_score: 92,
      icon: '🔄',
      demographics: 'Regular purchasers, 2-3x per year',
      psychographics: 'Established routine, predictable patterns, satisfied',
      why_fit: 'Regular purchase cadence indicates high satisfaction and trust',
      content_affinities: [
        { name: 'Repeat Purchase Content', strength: 94, reason: 'Habitual behavior' },
        { name: 'Your Category Content', strength: 89, reason: 'Category enthusiast' },
        { name: 'How-To Content', strength: 84, reason: 'Wants to maximize value' }
      ],
      behavioral_signals: ['2-3 purchases per year', 'Opens most emails', 'Reviews products'],
      recommended_messaging: 'Complete your collection, perfect addition, you already know',
      data_source: 'Existing customer data'
    },
    {
      id: 'recent_converts',
      name: 'Recent Converters',
      size: Math.round(existingCustomers * 0.30).toLocaleString(),
      fit_score: 88,
      icon: '🆕',
      demographics: 'Purchased in last 3-6 months',
      psychographics: 'New to brand, evaluating, discovery phase',
      why_fit: 'Recently engaged with your brand, in consideration window',
      content_affinities: [
        { name: 'New Customer Content', strength: 91, reason: 'Still learning about brand' },
        { name: 'Product Guides', strength: 87, reason: 'Education-seeking' },
        { name: 'Reviews & Testimonials', strength: 85, reason: 'Social proof matters' }
      ],
      behavioral_signals: ['First purchase in last 6 months', 'Browsing behavior', 'Engaged with onboarding'],
      recommended_messaging: 'Next step in your journey, discover more, complete experience',
      data_source: 'Existing customer data'
    },
    {
      id: 'dormant_customers',
      name: 'Dormant Customers',
      size: Math.round(existingCustomers * 0.20).toLocaleString(),
      fit_score: 79,
      icon: '😴',
      demographics: 'No purchase in 12+ months',
      psychographics: 'Lapsed, potentially churned, needs re-engagement',
      why_fit: 'Previous customers who may return with the right offer',
      content_affinities: [
        { name: 'Win-Back Content', strength: 86, reason: 'Reactivation opportunity' },
        { name: "What's New Content", strength: 82, reason: 'Show what they missed' },
        { name: 'Special Offers', strength: 89, reason: 'Incentive-responsive' }
      ],
      behavioral_signals: ['12+ months since purchase', 'Low email engagement', 'Still subscribed'],
      recommended_messaging: "We miss you, see what's new, special comeback offer",
      data_source: 'Existing customer data'
    }
  ];

  return segments;
};

// Calculate crossover metrics
export const calculateCrossover = (productData) => {
  const existingCustomers = parseInt(productData.existingCustomers) || 0;
  const price = parseFloat(productData.price) || 50;
  
  // Higher price = lower crossover rate
  let crossoverRate = 0.35;
  if (price > 100) crossoverRate = 0.15;
  else if (price > 50) crossoverRate = 0.25;
  
  const crossoverCount = Math.round(existingCustomers * crossoverRate);
  
  return {
    rate: crossoverRate,
    count: crossoverCount,
    fitScore: 87 + Math.floor(Math.random() * 6)
  };
};