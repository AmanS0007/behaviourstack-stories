import React, { useState } from 'react';
import { useStory } from '../context/StoryContext';
import {
  Lightbulb, Star, CheckCircle, ArrowRight,
  TrendingUp, TrendingDown, AlertTriangle,
  Play, Image, Layout, Zap, Target, Info,
  ChevronDown, ChevronUp, Trophy
} from 'lucide-react';
import '../styles/Act2.css';

const typeIcons = {
  VIDEO: Play,
  CAROUSEL: Layout,
  STATIC: Image,
  UGC: Zap
};

function Act2({ brandData, addChatMessage }) {
  const { storyState, updateActState, completeAct, setCurrentAct } = useStory();
  const [selectedCreatives, setSelectedCreatives] = useState(
    storyState.act2.selectedCreatives || []
  );
  const [winningCreative, setWinningCreative] = useState(
    storyState.act2.winningCreative || null
  );
  const [expandedCreative, setExpandedCreative] = useState(null);
  const [showTestPlan, setShowTestPlan] = useState(false);
  const [viewMode, setViewMode] = useState('all');

  const act2Data = brandData.act2;
  const act1State = storyState.act1;
  const selectedStrategy = act1State.selectedStrategy;
  const brandColors = brandData.brand.colors;

  // Get recommended creative angle from strategy
  const getRecommendedFilter = () => {
    if (!selectedStrategy) return null;
    const strategy = brandData.act1.strategies.find(
      s => s.id === selectedStrategy
    );
    return strategy?.impacts?.act2_creative_filter || null;
  };

  const getRecommendedCreativeId = () => {
    if (!selectedStrategy) return null;
    const strategy = brandData.act1.strategies.find(
      s => s.id === selectedStrategy
    );
    return strategy?.impacts?.act2_recommended || null;
  };

  const recommendedFilter = getRecommendedFilter();
  const recommendedCreativeId = getRecommendedCreativeId();

  // Filter creatives based on view mode
  const getFilteredCreatives = () => {
    switch (viewMode) {
      case 'recommended':
        return act2Data.creatives.filter(
          c => c.angle === recommendedFilter ||
               c.id === recommendedCreativeId
        );
      case 'existing':
        return act2Data.creatives.filter(
          c => c.best_for === 'existing_customers' ||
               c.best_for === 'existing_subscribers'
        );
      case 'new':
        return act2Data.creatives.filter(
          c => c.best_for === 'new_audiences' ||
               c.best_for === 'jump_rope_community'
        );
      default:
        return act2Data.creatives;
    }
  };

  const filteredCreatives = getFilteredCreatives();

  const handleCreativeToggle = (creativeId) => {
    if (winningCreative) return;
    const updated = selectedCreatives.includes(creativeId)
      ? selectedCreatives.filter(id => id !== creativeId)
      : selectedCreatives.length < 3
        ? [...selectedCreatives, creativeId]
        : selectedCreatives;
    setSelectedCreatives(updated);
    updateActState('act2', { selectedCreatives: updated });
  };

  const handleSetWinner = (creativeId) => {
    const creative = act2Data.creatives.find(c => c.id === creativeId);
    setWinningCreative(creativeId);
    updateActState('act2', {
      winningCreative: creative.name,
      selectedCreatives,
      recommendedTrack: recommendedFilter
    });
    addChatMessage({
      type: 'user',
      content: `"${creative.name}" is our winning creative`
    });
    addChatMessage({
      type: 'assistant',
      content: `Excellent pick! "${creative.name}" scored ${
        creative.scores.new_audiences > creative.scores.existing_customers
          ? creative.scores.new_audiences
          : creative.scores.existing_customers
      } with your target audience. This will influence the performance metrics we see in Act 3.`
    });
  };

  const handleProceedToAct3 = () => {
    if (!winningCreative) return;
    completeAct(2);
    setCurrentAct(3);
    addChatMessage({
      type: 'assistant',
      content: `Act 2 complete! Your winning creative "${
        storyState.act2.winningCreative || winningCreative
      }" is now live. Let's jump to Act 3 to see how it performed over 5-6 weeks.`
    });
  };

  const getScoreColor = (score) => {
    if (score >= 8.5) return '#4caf50';
    if (score >= 7.0) return '#ff9800';
    return '#f44336';
  };

  const getScoreLabel = (score) => {
    if (score >= 8.5) return 'Excellent';
    if (score >= 7.0) return 'Good';
    if (score >= 5.0) return 'Average';
    return 'Poor';
  };

  // Get test plan for selected strategy
  const getTestPlan = () => {
    if (!selectedStrategy) return act2Data.test_plan;
    const scenario = act2Data.test_plan.scenarios?.[selectedStrategy];
    return { ...act2Data.test_plan, scenario };
  };

  const testPlan = getTestPlan();

  return (
    <div className="act2">
      {/* Strategy Context Banner */}
      {selectedStrategy ? (
        <div className="strategy-context-banner"
          style={{
            background: brandColors.light,
            borderColor: brandColors.primary + '40'
          }}>
          <CheckCircle className="banner-icon"
            style={{ color: brandColors.primary }} />
          <div className="banner-content">
            <p className="banner-label">Strategy from Act 1</p>
            <p className="banner-value">
              {brandData.act1.strategies.find(
                s => s.id === selectedStrategy
              )?.label}
              {' '}—{' '}
              <span className="banner-hint">
                Recommended creatives are highlighted below
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="strategy-context-banner warning">
          <AlertTriangle className="banner-icon warning" />
          <div className="banner-content">
            <p className="banner-label">No strategy selected</p>
            <p className="banner-hint">
              Go back to Act 1 to select a strategy for personalized
              creative recommendations
            </p>
          </div>
        </div>
      )}

      {/* Context */}
      <div className="context-banner"
        style={{
          background: brandColors.light,
          borderColor: brandColors.primary + '40'
        }}>
        <Info className="context-icon"
          style={{ color: brandColors.primary }} />
        <p className="context-text">{act2Data.context}</p>
      </div>

      {/* Creative Gallery */}
      <div className="card">
        <div className="card-header-row">
          <div className="card-icon-wrap"
            style={{ background: brandColors.primary }}>
            <Lightbulb className="icon" />
          </div>
          <div className="card-header-text">
            <h3 className="card-title">Creative Gallery</h3>
            <p className="card-subtitle">
              Select up to 3 creatives to test · Pick 1 winner
              {selectedCreatives.length > 0 &&
                ` · ${selectedCreatives.length}/3 selected`}
            </p>
          </div>
        </div>

        {/* View Mode Filter */}
        <div className="view-filters">
          {[
            { id: 'all', label: 'All Creatives' },
            { id: 'recommended', label: '⭐ Recommended for Strategy' },
            { id: 'existing', label: 'Best for Existing Customers' },
            { id: 'new', label: 'Best for New Audiences' }
          ].map(filter => (
            <button
              key={filter.id}
              className={`filter-btn ${viewMode === filter.id ? 'active' : ''}`}
              onClick={() => setViewMode(filter.id)}
              style={viewMode === filter.id ? {
                background: brandColors.primary,
                borderColor: brandColors.primary
              } : {}}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Creatives Grid */}
        <div className="creatives-grid">
          {filteredCreatives.map((creative) => {
            const isSelected = selectedCreatives.includes(creative.id);
            const isWinner = winningCreative === creative.id;
            const isRecommended = creative.id === recommendedCreativeId ||
              creative.angle === recommendedFilter;
            const TypeIcon = typeIcons[creative.type] || Play;
            const existingScore = creative.scores.existing_subscribers ||
              creative.scores.existing_customers || 0;
            const newScore = creative.scores.new_audiences ||
              creative.scores.jump_rope_community || 0;
            const isExpanded = expandedCreative === creative.id;

            return (
              <div
                key={creative.id}
                className={`creative-card ${isSelected ? 'selected' : ''} 
                  ${isWinner ? 'winner' : ''} 
                  ${isRecommended ? 'recommended' : ''}`}
                style={isWinner ? {
                  borderColor: '#ffd700',
                  background: '#fffde7'
                } : isSelected ? {
                  borderColor: brandColors.primary,
                  background: brandColors.light
                } : {}}
              >
                {/* Badges */}
                <div className="creative-badges">
                  {isRecommended && !isWinner && (
                    <span className="badge recommended-badge"
                      style={{
                        background: brandColors.primary + '20',
                        color: brandColors.primary,
                        borderColor: brandColors.primary + '40'
                      }}>
                      ⭐ Recommended
                    </span>
                  )}
                  {isWinner && (
                    <span className="badge winner-badge">
                      🏆 Winner
                    </span>
                  )}
                </div>

                {/* Creative Header */}
                <div className="creative-header">
                  <div className="creative-thumbnail">
                    <span className="creative-emoji">
                      {creative.thumbnail}
                    </span>
                  </div>
                  <div className="creative-meta">
                    <div className="creative-type-row">
                      <TypeIcon className="type-icon" />
                      <span className="creative-type">{creative.type}</span>
                    </div>
                    <h4 className="creative-name">{creative.name}</h4>
                    <p className="creative-desc">{creative.description}</p>
                  </div>
                </div>

                {/* Hook */}
                <div className="creative-hook"
                  style={{
                    background: brandColors.light,
                    borderColor: brandColors.primary + '30'
                  }}>
                  <span className="hook-label">Hook:</span>
                  <span className="hook-text">"{creative.hook}"</span>
                </div>

                {/* LCBM Scores */}
                <div className="lcbm-scores">
                  <div className="score-row">
                    <span className="score-label">Existing Customers</span>
                    <div className="score-bar-wrap">
                      <div className="score-bar-bg">
                        <div
                          className="score-bar-fill"
                          style={{
                            width: `${(existingScore / 10) * 100}%`,
                            background: getScoreColor(existingScore)
                          }}
                        />
                      </div>
                      <span className="score-value"
                        style={{ color: getScoreColor(existingScore) }}>
                        {existingScore}
                      </span>
                    </div>
                    <span className="score-grade"
                      style={{ color: getScoreColor(existingScore) }}>
                      {getScoreLabel(existingScore)}
                    </span>
                  </div>

                  <div className="score-row">
                    <span className="score-label">New Audiences</span>
                    <div className="score-bar-wrap">
                      <div className="score-bar-bg">
                        <div
                          className="score-bar-fill"
                          style={{
                            width: `${(newScore / 10) * 100}%`,
                            background: getScoreColor(newScore)
                          }}
                        />
                      </div>
                      <span className="score-value"
                        style={{ color: getScoreColor(newScore) }}>
                        {newScore}
                      </span>
                    </div>
                    <span className="score-grade"
                      style={{ color: getScoreColor(newScore) }}>
                      {getScoreLabel(newScore)}
                    </span>
                  </div>
                </div>

                {/* Expanded Analysis */}
                {isExpanded && (
                  <div className="creative-expanded fade-in">
                    <div className="analysis-row">
                      <div className="analysis-item works">
                        <TrendingUp className="analysis-icon" />
                        <div>
                          <p className="analysis-label">Why it works</p>
                          <p className="analysis-text">
                            {creative.why_it_works}
                          </p>
                        </div>
                      </div>
                      <div className="analysis-item fails">
                        <TrendingDown className="analysis-icon" />
                        <div>
                          <p className="analysis-label">Why it fails</p>
                          <p className="analysis-text">
                            {creative.why_it_fails}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="best-for-tag">
                      <Target className="tag-icon" />
                      <span>Best for: </span>
                      <strong>{creative.best_for.replace(/_/g, ' ')}</strong>
                    </div>
                  </div>
                )}

                {/* Card Actions */}
                <div className="creative-actions">
                  <button
                    className="expand-btn"
                    onClick={() => setExpandedCreative(
                      isExpanded ? null : creative.id
                    )}
                  >
                    {isExpanded ? (
                      <><ChevronUp className="btn-icon" /> Less</>
                    ) : (
                      <><ChevronDown className="btn-icon" /> Analysis</>
                    )}
                  </button>

                  {!winningCreative ? (
                    <>
                      <button
                        className={`select-creative-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleCreativeToggle(creative.id)}
                        disabled={!isSelected && selectedCreatives.length >= 3}
                        style={isSelected ? {
                          background: brandColors.primary,
                          borderColor: brandColors.primary
                        } : {}}
                      >
                        {isSelected ? (
                          <><CheckCircle className="btn-icon" /> In Test</>
                        ) : selectedCreatives.length >= 3 ? (
                          'Max 3 selected'
                        ) : (
                          '+ Add to Test'
                        )}
                      </button>

                      {isSelected && (
                        <button
                          className="winner-btn"
                          onClick={() => handleSetWinner(creative.id)}
                          style={{ background: '#ffd700', color: '#333' }}
                        >
                          <Trophy className="btn-icon" />
                          Set Winner
                        </button>
                      )}
                    </>
                  ) : (
                    <div className={`winner-status ${isWinner ? 'is-winner' : 'not-winner'}`}>
                      {isWinner ? '🏆 Winning Creative' : 
                       isSelected ? '✓ Was Tested' : ''}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selection Status */}
        {selectedCreatives.length > 0 && !winningCreative && (
          <div className="selection-status"
            style={{
              background: brandColors.light,
              borderColor: brandColors.primary + '40'
            }}>
            <Star className="status-icon"
              style={{ color: brandColors.primary }} />
            <p className="status-text">
              <strong>{selectedCreatives.length}/3 creatives selected for testing.</strong>
              {' '}Click "Set Winner" on your best pick to proceed.
            </p>
          </div>
        )}

        {winningCreative && (
          <div className="winner-announced">
            <Trophy className="trophy-icon" />
            <div>
              <p className="winner-label">Winning Creative Selected!</p>
              <p className="winner-name">
                {act2Data.creatives.find(
                  c => c.id === winningCreative
                )?.name}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Test Plan */}
      <div className="card">
        <button
          className="test-plan-toggle"
          onClick={() => setShowTestPlan(!showTestPlan)}
        >
          <div className="test-plan-left">
            <div className="card-icon-wrap"
              style={{ background: '#6366f1' }}>
              <Target className="icon" />
            </div>
            <div>
              <h3 className="card-title">Test Plan</h3>
              <p className="card-subtitle">
                ${testPlan.budget?.toLocaleString()} budget ·
                {testPlan.duration_hours}hr test ·
                {testPlan.cells_per_track} cells per track
              </p>
            </div>
          </div>
          {showTestPlan
            ? <ChevronUp className="toggle-icon" />
            : <ChevronDown className="toggle-icon" />
          }
        </button>

        {showTestPlan && (
          <div className="test-plan-content fade-in">
            {/* Test Overview */}
            <div className="test-overview">
              <div className="test-stat">
                <p className="test-stat-value">
                  ${testPlan.budget?.toLocaleString()}
                </p>
                <p className="test-stat-label">Total Budget</p>
              </div>
              <div className="test-stat">
                <p className="test-stat-value">{testPlan.duration_hours}hrs</p>
                <p className="test-stat-label">Test Duration</p>
              </div>
              <div className="test-stat">
                <p className="test-stat-value">
                  {testPlan.cells_per_track}
                </p>
                <p className="test-stat-label">Cells Per Track</p>
              </div>
              {testPlan.tiktok_track && (
                <div className="test-stat tiktok">
                  <p className="test-stat-value">🎵</p>
                  <p className="test-stat-label">TikTok Track</p>
                </div>
              )}
            </div>

            {/* Strategy-specific test cells */}
            {testPlan.scenario && (
              <div className="test-cells">
                <h4 className="test-cells-title">
                  Test Cells for{' '}
                  {brandData.act1.strategies.find(
                    s => s.id === selectedStrategy
                  )?.label || 'Selected Strategy'}
                </h4>

                <div className="cells-grid">
                  {testPlan.scenario.cells?.map((cell, idx) => (
                    <div key={idx} className="cell-card">
                      <div className="cell-number">Cell {idx + 1}</div>
                      <div className="cell-creative">
                        {act2Data.creatives.find(
                          c => c.id === cell.creative
                        )?.thumbnail || '🎯'} {cell.creative.replace(/_/g, ' ')}
                      </div>
                      <div className="cell-audience">
                        👥 {cell.audience}
                      </div>
                      <div className="cell-budget">
                        💰 ${cell.budget.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="test-rules">
                  <div className="rule stop">
                    <AlertTriangle className="rule-icon" />
                    <span>
                      <strong>Stop Rule:</strong> {testPlan.scenario.stop_rule}
                    </span>
                  </div>
                  <div className="rule promote">
                    <Zap className="rule-icon" />
                    <span>
                      <strong>Promote Rule:</strong>{' '}
                      {testPlan.scenario.promote_rule}
                    </span>
                  </div>
                  {testPlan.scenario.tiktok_note && (
                    <div className="rule tiktok">
                      <Star className="rule-icon" />
                      <span>{testPlan.scenario.tiktok_note}</span>
                    </div>
                  )}
                </div>

                <div className="landing-page-note">
                  <Info className="lp-icon" />
                  <span>
                    <strong>Landing Page:</strong>{' '}
                    {testPlan.scenario.landing_page}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Proceed Button */}
      <button
        className={`proceed-btn ${!winningCreative ? 'disabled' : ''}`}
        onClick={handleProceedToAct3}
        disabled={!winningCreative}
        style={winningCreative ? {
          background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})`
        } : {}}
      >
        {winningCreative ? (
          <>
            <CheckCircle className="proceed-icon" />
            Proceed to Act 3: Performance Diagnosis
            <ArrowRight className="proceed-icon" />
          </>
        ) : (
          'Select and set a winning creative to continue'
        )}
      </button>
    </div>
  );
}

export default Act2;