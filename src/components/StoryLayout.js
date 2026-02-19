import React, { useState } from 'react';
import { useStory } from '../context/PresentationContext';
import Act1 from '../acts/Act1_AudienceDiscovery';
import Act2 from '../acts/Act2_CreativeBakeoff';
import Act3 from '../acts/Act3_Diagnosis';
import Act4 from '../acts/Act4_Expansion';
import ChatPanel from './shared/ChatPanel';
import { 
  Users, Lightbulb, TrendingUp, Brain, 
  Home, Sparkles, CheckCircle, ArrowRight,
  ChevronRight
} from 'lucide-react';
import emberData from '../data/ember.json';
import velaData from '../data/vela.json';
import peakformData from '../data/peakform.json';
import '../styles/StoryLayout.css';

const brandDataMap = {
  ember: emberData,
  vela: velaData,
  peakform: peakformData
};

const acts = [
  { id: 1, label: 'Audience Discovery', icon: Users },
  { id: 2, label: 'Creative Bake-off', icon: Lightbulb },
  { id: 3, label: 'Performance Diagnosis', icon: TrendingUp },
  { id: 4, label: 'Regional Expansion', icon: Brain }
];

function StoryLayout() {
  const { 
    activeBrand, 
    setActiveBrand, 
    currentAct, 
    setCurrentAct,
    storyState,
    getDecisionsSummary,
    resetStory
  } = useStory();

  const [chatMessages, setChatMessages] = useState([
    { 
      type: 'assistant', 
      content: `Welcome! I'm your AI guide for this story. Let's start by discovering who your ideal audiences are.` 
    }
  ]);

  const brandData = brandDataMap[activeBrand];
  const decisions = getDecisionsSummary();

  const addChatMessage = (message) => {
    setChatMessages(prev => [...prev, message]);
  };

  const handleActChange = (actId) => {
    setCurrentAct(actId);
  };

  const handleHome = () => {
    resetStory();
    setActiveBrand(null);
  };

  const renderAct = () => {
    const props = { brandData, addChatMessage };
    switch (currentAct) {
      case 1: return <Act1 {...props} />;
      case 2: return <Act2 {...props} />;
      case 3: return <Act3 {...props} />;
      case 4: return <Act4 {...props} />;
      default: return <Act1 {...props} />;
    }
  };

  if (!brandData) return null;

  return (
    <div className="story-layout" style={{
      '--brand-primary': brandData.brand.colors.primary,
      '--brand-secondary': brandData.brand.colors.secondary,
      '--brand-light': brandData.brand.colors.light
    }}>
      {/* Top Header */}
      <div className="story-header">
        <div className="story-header-left">
          <button className="home-btn" onClick={handleHome}>
            <Home className="icon" />
          </button>
          <div className="header-brand-icon">
            <span>{brandData.brand.emoji}</span>
          </div>
          <div>
            <h1 className="story-header-title">{brandData.brand.name}</h1>
            <p className="story-header-subtitle">
              {brandData.brand.industry} · {brandData.brand.tagline}
            </p>
          </div>
        </div>

        <div className="story-header-center">
          {acts.map((act, idx) => {
            const Icon = act.icon;
            const isActive = currentAct === act.id;
            const isCompleted = storyState[`act${act.id}`]?.completed;
            const isAccessible = true;

            return (
              <React.Fragment key={act.id}>
                <button
                  className={`act-tab ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => isAccessible && handleActChange(act.id)}
                  style={isActive ? { 
                    borderColor: brandData.brand.colors.primary,
                    color: brandData.brand.colors.primary
                  } : {}}
                >
                  {isCompleted ? (
                    <CheckCircle className="act-tab-icon completed-icon" />
                  ) : (
                    <Icon className="act-tab-icon" />
                  )}
                  <span className="act-tab-num">Act {act.id}</span>
                  <span className="act-tab-label">{act.label}</span>
                </button>
                {idx < acts.length - 1 && (
                  <ChevronRight className="act-separator" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="story-header-right">
          <div className="powered-badge">
            <Sparkles className="powered-icon" />
            <span>BehaviourStack AI</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="story-body">
        {/* Left Sidebar */}
        <div className="story-sidebar left">
          <div className="sidebar-card">
            <h3 className="sidebar-heading">Story Progress</h3>

            {/* Act Steps */}
            <div className="sidebar-acts">
              {acts.map((act) => {
                const Icon = act.icon;
                const isActive = currentAct === act.id;
                const isCompleted = storyState[`act${act.id}`]?.completed;

                return (
                  <button
                    key={act.id}
                    className={`sidebar-act-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => handleActChange(act.id)}
                    style={isActive ? {
                      background: `${brandData.brand.colors.light}`,
                      borderColor: brandData.brand.colors.primary,
                      color: brandData.brand.colors.primary
                    } : {}}
                  >
                    <div className={`sidebar-act-icon ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                      style={isActive ? { background: brandData.brand.colors.primary } : 
                             isCompleted ? { background: '#4caf50' } : {}}
                    >
                      {isCompleted ? (
                        <CheckCircle className="icon" />
                      ) : (
                        <Icon className="icon" />
                      )}
                    </div>
                    <div className="sidebar-act-info">
                      <p className="sidebar-act-num">Act {act.id}</p>
                      <p className="sidebar-act-label">{act.label}</p>
                    </div>
                    {isActive && <ArrowRight className="sidebar-act-arrow" />}
                  </button>
                );
              })}
            </div>

            {/* Decisions Made */}
            {decisions.length > 0 && (
              <div className="decisions-section">
                <h4 className="decisions-title">Decisions Made</h4>
                {decisions.map((decision, idx) => (
                  <div key={idx} className="decision-item">
                    <div className="decision-act-badge"
                      style={{ background: brandData.brand.colors.light,
                               color: brandData.brand.colors.primary }}
                    >
                      Act {decision.act}
                    </div>
                    <div className="decision-content">
                      <p className="decision-type">{decision.type}</p>
                      <p className="decision-value">{decision.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Brand Quick Stats */}
            <div className="brand-stats">
              <h4 className="stats-title">Brand Context</h4>
              <div className="stat-item">
                <span className="stat-label">Established</span>
                <span className="stat-value">
                  {brandData.brand.established_product.customers.toLocaleString()} customers
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">New Product</span>
                <span className="stat-value">
                  {brandData.brand.new_product.price}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Monthly Spend</span>
                <span className="stat-value">
                  {brandData.brand.established_product.monthly_spend}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Workspace */}
        <div className="story-center">
          <div className="act-header">
            <div className="act-header-left">
              <div className="act-number-badge"
                style={{ background: brandData.brand.colors.primary }}
              >
                Act {currentAct}
              </div>
              <div>
                <h2 className="act-title">
                  {brandData[`act${currentAct}`]?.title}
                </h2>
                <p className="act-question">
                  "{brandData[`act${currentAct}`]?.question}"
                </p>
              </div>
            </div>

            {currentAct < 4 && (
              <button
                className="next-act-btn"
                onClick={() => handleActChange(currentAct + 1)}
                style={{ background: brandData.brand.colors.primary }}
              >
                Next Act
                <ArrowRight className="icon" />
              </button>
            )}
          </div>

          {/* Act Content */}
          <div className="act-content fade-in">
            {renderAct()}
          </div>
        </div>

        {/* Right Sidebar - Chat */}
        <div className="story-sidebar right">
          <ChatPanel
            messages={chatMessages}
            brandData={brandData}
            currentAct={currentAct}
            addMessage={addChatMessage}
          />
        </div>
      </div>
    </div>
  );
}

export default StoryLayout;