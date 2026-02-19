export const generateCreativeVariants = (audiences, productData) => {
    const topPreferences = extractTopPreferences(audiences);
    
    const variants = [
      {
        id: 'variant_1',
        name: 'Variant 1: Audience-First',
        type: 'VIDEO',
        hook: generateHook(topPreferences[0], productData),
        visual_direction: 'Dynamic lifestyle shots showing product in use',
        copy_angle: topPreferences[0].messaging,
        cta: 'Get Started Today',
        why_high_performing: `Directly addresses the primary motivation of your top audience: ${topPreferences[0].reason}`,
        lcbm_score: 9.2,
        predicted_performance: {
          ctr: '3.8%',
          engagement: '6.2%',
          conversion_lift: '+42%'
        },
        assets: generateCreativeAssets('variant_1', productData.category) // ADD THIS
      },
      {
        id: 'variant_2',
        name: 'Variant 2: Problem-Solution',
        type: 'CAROUSEL',
        hook: generateProblemSolutionHook(productData),
        visual_direction: 'Before/after or problem/solution visual sequence',
        copy_angle: 'Identify pain point, show transformation',
        cta: 'See How It Works',
        why_high_performing: 'Problem-solution framework has 38% higher engagement for new product launches',
        lcbm_score: 8.9,
        predicted_performance: {
          ctr: '3.5%',
          engagement: '5.8%',
          conversion_lift: '+38%'
        },
        assets: generateCreativeAssets('variant_2', productData.category) // ADD THIS
      },
      {
        id: 'variant_3',
        name: 'Variant 3: Social Proof',
        type: 'UGC',
        hook: 'Real people, real results',
        visual_direction: 'Authentic customer testimonials and usage footage',
        copy_angle: 'Community validation, peer recommendation',
        cta: 'Join Thousands of Users',
        why_high_performing: `Your audiences show ${topPreferences[0].social_proof_affinity}% affinity for community content`,
        lcbm_score: 8.7,
        predicted_performance: {
          ctr: '3.4%',
          engagement: '7.1%',
          conversion_lift: '+35%'
        },
        assets: generateCreativeAssets('variant_3', productData.category) // ADD THIS
      },
      {
        id: 'variant_4',
        name: 'Variant 4: Benefit-Stack',
        type: 'STATIC',
        hook: generateBenefitHook(productData),
        visual_direction: 'Clean product shot with benefit callouts',
        copy_angle: 'Stack multiple benefits, create comprehensive value prop',
        cta: 'Discover All Benefits',
        why_high_performing: 'Multi-benefit messaging increases perceived value by 31% on average',
        lcbm_score: 8.5,
        predicted_performance: {
          ctr: '3.2%',
          engagement: '5.4%',
          conversion_lift: '+29%'
        },
        assets: generateCreativeAssets('variant_4', productData.category) // ADD THIS
      }
    ];
  
    return variants;
  };
  
  // Extract top preferences from selected audiences
  const extractTopPreferences = (audiences) => {
    // For now, return generic preferences
    // In production, this would analyze the actual selected audiences
    return [
      {
        messaging: 'Performance-focused, data-driven results',
        reason: 'achievement orientation and quantifiable outcomes',
        social_proof_affinity: 87
      },
      {
        messaging: 'Time-efficient, fits busy lifestyle',
        reason: 'convenience and productivity mindset',
        social_proof_affinity: 82
      },
      {
        messaging: 'Quality-first, premium experience',
        reason: 'discerning taste and willingness to invest',
        social_proof_affinity: 79
      }
    ];
  };
  
  const generateHook = (preference, productData) => {
    const productName = productData.productName || 'this product';
    const hooks = [
      `The ${productName} your schedule has been waiting for`,
      `Finally, ${productName} that actually delivers results`,
      `What if ${productName} could save you 30 minutes every day?`,
      `The ${productName} that fits your life, not the other way around`
    ];
    return hooks[Math.floor(Math.random() * hooks.length)];
  };
  
  const generateProblemSolutionHook = (productData) => {
    const productName = productData.productName || 'this';
    return `Tired of products that don't work? ${productName} is different.`;
  };
  
  const generateBenefitHook = (productData) => {
    const productName = productData.productName || 'this product';
    return `Everything you need in ${productName}. Nothing you don't.`;
  };
  
  // Score uploaded creatives
  export const scoreUploadedCreatives = (creatives, audiences) => {
    return creatives.map(creative => {
      // Simulate LCBM scoring based on creative attributes
      const baseScore = 7.0 + Math.random() * 2; // 7.0 - 9.0
      
      return {
        ...creative,
        lcbm_score: Math.round(baseScore * 10) / 10,
        audience_fit: generateAudienceFit(audiences),
        recommendations: generateRecommendations(creative, baseScore),
        predicted_performance: {
          ctr: `${(2.5 + Math.random() * 1.5).toFixed(1)}%`,
          engagement: `${(4.0 + Math.random() * 3).toFixed(1)}%`,
          conversion_lift: `+${Math.round(20 + Math.random() * 25)}%`
        }
      };
    });
  };
  
  const generateAudienceFit = (audiences) => {
    return audiences.map(aud => ({
      audience: aud,
      fit: Math.round(75 + Math.random() * 20) // 75-95
    }));
  };
  
  const generateRecommendations = (creative, score) => {
    if (score >= 8.5) {
      return 'Strong performer. Prioritize this creative in your test.';
    } else if (score >= 7.5) {
      return 'Good potential. Consider testing with adjustments to hook or CTA.';
    } else {
      return 'Lower fit. May underperform with selected audiences. Consider rework.';
    }
  };

  // Generate visual assets for each variant
export const generateCreativeAssets = (variantId, productCategory) => {
    // For demo purposes, we'll use placeholder services
    // You can replace these with actual generated images later
    
    const baseUrl = 'https://placehold.co';
    
    return {
      images: [
        {
          id: 'img1',
          url: `${baseUrl}/800x600/667eea/ffffff?text=Image+1`,
          type: 'hero'
        },
        {
          id: 'img2',
          url: `${baseUrl}/800x600/764ba2/ffffff?text=Image+2`,
          type: 'product'
        }
      ],
      video: {
        id: 'video1',
        url: `${baseUrl}/800x600/f093fb/ffffff?text=Video+Thumbnail`,
        duration: '0:30',
        type: 'video/mp4'
      },
      googleAds: [
        {
          id: 'ad1',
          headline: 'Transform Your Routine Today',
          description: 'Premium quality that fits your lifestyle. Limited time offer.',
          displayUrl: 'yourbrand.com/shop'
        },
        {
          id: 'ad2',
          headline: 'Join Thousands of Happy Customers',
          description: 'Trusted by 50K+ users. Free shipping on orders over $50.',
          displayUrl: 'yourbrand.com/reviews'
        }
      ]
    };
  };