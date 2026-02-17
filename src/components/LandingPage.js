import React, { useState } from 'react';
import { useStory } from '../context/StoryContext';
import { Sparkles, ArrowRight, Brain, TrendingUp, Users, Lightbulb } from 'lucide-react';
import emberData from '../data/ember.json';
import velaData from '../data/vela.json';
import peakformData from '../data/peakform.json';
import '../styles/LandingPage.css';

const brands = [
  { data: emberData, key: 'ember' },
  { data: velaData, key: 'vela' },
  { data: peakformData, key: 'peakform' }
];

const actLabels = [
  { icon: Users, label: 'Audience Discovery' },
  { icon: Lightbulb, label: 'Creative Bake-off' },
  { icon: TrendingUp, label: 'Performance Diagnosis' },
  { icon: Brain, label: 'Regional Expansion' }
];

function LandingPage() {
  const { setActiveBrand, resetStory } = useStory();
  const [hoveredBrand, setHoveredBrand] = useState(null);

  const handleSelectBrand = (brandKey) => {
    resetStory();
    setActiveBrand(brandKey);
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <div className="landing-header">
        <div className="landing-header-content">
          <div className="landing-logo">
            <div className="logo-icon">
              <Sparkles className="icon" />
            </div>
            <div>
              <h1 className="logo-title">BehaviourStack</h1>
              <p className="logo-subtitle">AI-Powered Campaign Intelligence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Brain className="badge-icon" />
            <span>Powered by LCBM · Social Agents · Transsuasion AI</span>
          </div>
          <h2 className="hero-title">
            See how brands grow with
            <span className="hero-highlight"> AI intelligence</span>
          </h2>
          <p className="hero-description">
            Three brands. Four acts. One connected story. Watch how BehaviourStack
            guides marketers from audience discovery to regional expansion —
            with every decision shaping what comes next.
          </p>

          {/* Act Overview */}
          <div className="act-overview">
            {actLabels.map((act, idx) => {
              const Icon = act.icon;
              return (
                <div key={idx} className="act-pill">
                  <div className="act-pill-number">Act {idx + 1}</div>
                  <Icon className="act-pill-icon" />
                  <span className="act-pill-label">{act.label}</span>
                  {idx < actLabels.length - 1 && (
                    <ArrowRight className="act-pill-arrow" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Brand Cards */}
      <div className="brands-section">
        <div className="brands-container">
          <h3 className="brands-title">Choose a brand story to explore</h3>
          <p className="brands-subtitle">
            Each story is fully connected — decisions you make in Act 1 shape
            what you see in Acts 2, 3, and 4.
          </p>

          <div className="brands-grid">
            {brands.map(({ data, key }) => (
              <button
                key={key}
                className={`brand-card ${hoveredBrand === key ? 'hovered' : ''}`}
                onClick={() => handleSelectBrand(key)}
                onMouseEnter={() => setHoveredBrand(key)}
                onMouseLeave={() => setHoveredBrand(null)}
                style={{
                  '--brand-primary': data.brand.colors.primary,
                  '--brand-secondary': data.brand.colors.secondary,
                  '--brand-light': data.brand.colors.light
                }}
              >
                {/* Card Header */}
                <div className="brand-card-header">
                  <div className="brand-emoji-wrap">
                    <span className="brand-emoji">{data.brand.emoji}</span>
                  </div>
                  <div className="brand-info">
                    <h4 className="brand-name">{data.brand.name}</h4>
                    <p className="brand-industry">{data.brand.industry}</p>
                  </div>
                </div>

                {/* Tension Badge */}
                <div className="tension-badge">
                  <span className="tension-vs">Core Tension:</span>
                  <p className="tension-text">"{data.brand.tension}"</p>
                </div>

                {/* Products */}
                <div className="products-section">
                  <div className="product-item established">
                    <span className="product-label">Established</span>
                    <span className="product-name">
                      {data.brand.established_product.name}
                    </span>
                    <span className="product-meta">
                      {data.brand.established_product.customers.toLocaleString()} customers
                      · {data.brand.established_product.price}
                    </span>
                  </div>
                  <div className="product-arrow">→</div>
                  <div className="product-item new">
                    <span className="product-label">New Launch</span>
                    <span className="product-name">
                      {data.brand.new_product.name}
                    </span>
                    <span className="product-meta">
                      {data.brand.new_product.price}
                      · {data.brand.new_product.channel}
                    </span>
                  </div>
                </div>

                {/* Act Previews */}
                <div className="act-previews">
                  <div className="act-preview-item">
                    <span className="act-preview-num">Act 1</span>
                    <span className="act-preview-q">
                      {data.act1.question}
                    </span>
                  </div>
                  <div className="act-preview-item">
                    <span className="act-preview-num">Act 2</span>
                    <span className="act-preview-q">
                      {data.act2.question}
                    </span>
                  </div>
                  <div className="act-preview-item">
                    <span className="act-preview-num">Act 3</span>
                    <span className="act-preview-q">
                      {data.act3.question}
                    </span>
                  </div>
                  <div className="act-preview-item">
                    <span className="act-preview-num">Act 4</span>
                    <span className="act-preview-q">
                      {data.act4.question}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="brand-cta">
                  <span>Explore {data.brand.name}'s Story</span>
                  <ArrowRight className="cta-arrow" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="landing-footer">
        <div className="footer-content">
          <div className="footer-models">
            <div className="footer-model">
              <Brain className="model-icon" />
              <div>
                <p className="model-name">LCBM</p>
                <p className="model-desc">Latent Consumer Behaviour Model</p>
              </div>
            </div>
            <div className="footer-divider" />
            <div className="footer-model">
              <Users className="model-icon" />
              <div>
                <p className="model-name">Social Agents</p>
                <p className="model-desc">AI Persona Simulation</p>
              </div>
            </div>
            <div className="footer-divider" />
            <div className="footer-model">
              <Sparkles className="model-icon" />
              <div>
                <p className="model-name">Transsuasion AI</p>
                <p className="model-desc">Persuasion-Optimized Copywriting</p>
              </div>
            </div>
          </div>
          <p className="footer-copy">© 2025 BehaviourStack. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;