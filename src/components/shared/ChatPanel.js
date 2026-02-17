import React, { useState, useEffect, useRef } from 'react';
import { useStory } from '../../context/StoryContext';
import {
  Brain, Send, Sparkles,
  Users, Lightbulb, TrendingUp, MapPin, MessageSquare
} from 'lucide-react';
import '../../styles/ChatPanel.css';

// Context-aware quick prompts per act
const actPrompts = {
  1: [
    { label: '🎯 Best audience?', message: 'Which audience has the highest fit score and why?' },
    { label: '📊 Crossover rate?', message: 'Explain the crossover rate and what it means for our strategy' },
    { label: '⚡ Bridge segment?', message: 'Tell me more about the bridge segment opportunity' },
    { label: '🤔 Which strategy?', message: 'Which strategy would you recommend and why?' }
  ],
  2: [
    { label: '🏆 Best creative?', message: 'Which creative is most likely to win and why?' },
    { label: '📈 LCBM scores?', message: 'Explain how LCBM scores the creatives' },
    { label: '💡 Test plan?', message: 'Walk me through the optimal test plan setup' },
    { label: '🎨 Creative mismatch?', message: 'Which creative has the biggest audience mismatch?' }
  ],
  3: [
    { label: '🔍 Root cause?', message: 'What is the root cause of the performance issue?' },
    { label: '💊 Best recovery?', message: 'Which recovery strategy has the highest expected lift?' },
    { label: '📉 Why struggling?', message: 'Why is the struggling track underperforming?' },
    { label: '🚀 Quick wins?', message: 'What are the fastest wins we can implement right now?' }
  ],
  4: [
    { label: '🗺️ Best market?', message: 'Which market has the best predicted ROAS and why?' },
    { label: '⚔️ Competition?', message: 'How do we differentiate against competitors in each market?' },
    { label: '💰 Budget split?', message: 'How should we split budget across the blended playbook layers?' },
    { label: '📍 All 3 markets?', message: 'Should we launch in all 3 markets or focus on one first?' }
  ]
};

// AI response generator based on context
const generateResponse = (message, brandData, currentAct, storyState) => {
  const msg = message.toLowerCase();
  const brand = brandData.brand;
  const act1Data = brandData.act1;
  const act2Data = brandData.act2;
  const act3Data = brandData.act3;
  const act4Data = brandData.act4;
  const selectedStrategy = storyState.act1.selectedStrategy;

  // Act 1 responses
  if (currentAct === 1) {
    if (msg.includes('best audience') || msg.includes('highest fit')) {
      const topAudience = [...act1Data.new_audiences].sort(
        (a, b) => b.fit_score - a.fit_score
      )[0];
      return `The highest fit audience for ${brand.name} is **${topAudience.name}** with a fit score of ${topAudience.fit_score}. They're ideal because: ${topAudience.psychographics}. Their top affinity is "${topAudience.affinities[0].name}" at ${topAudience.affinities[0].strength} strength — ${topAudience.affinities[0].reason}.`;
    }

    if (msg.includes('crossover') || msg.includes('overlap')) {
      const pct = Math.round(act1Data.crossover_rate * 100);
      return `The crossover rate of ${pct}% means only ${act1Data.crossover_count.toLocaleString()} of your ${act1Data.existing_customers.toLocaleString()} existing customers are likely to buy the new product. This is ${pct < 30 ? 'relatively low' : pct < 50 ? 'moderate' : 'quite high'}, which means ${pct < 30 ? 'your primary growth must come from new audiences' : 'you have a strong existing base to leverage while also targeting new audiences'}.`;
    }

    if (msg.includes('bridge segment') || msg.includes('bridge')) {
      const seg = act1Data.bridge_segment;
      return `The bridge segment "${seg.name}" is your most valuable immediate opportunity. These ${seg.size.toLocaleString()} people already exist in your customer base with a ${seg.fit_score} fit score. They're the connective tissue between your established product loyalists and your new product's target market. I'd prioritize them in the first 2 weeks of launch.`;
    }

    if (msg.includes('strategy') || msg.includes('recommend')) {
      const strategies = act1Data.strategies;
      return `Based on the LCBM analysis, I'd lean toward **"${strategies[1].label}"** — here's why: The crossover rate of ${Math.round(act1Data.crossover_rate * 100)}% shows most existing customers won't naturally migrate. New audiences have higher propensity and no preconceptions. That said, "${strategies[0].label}" is lower risk if brand consistency is your priority. What matters most to you — growth velocity or brand safety?`;
    }
  }

  // Act 2 responses
  if (currentAct === 2) {
    if (msg.includes('best creative') || msg.includes('win')) {
      const strategy = selectedStrategy
        ? act1Data.strategies.find(s => s.id === selectedStrategy)
        : null;
      const recommendedId = strategy?.impacts?.act2_recommended;
      const recommended = act2Data.creatives.find(c => c.id === recommendedId)
        || act2Data.creatives.sort((a, b) =>
          b.scores.new_audiences - a.scores.new_audiences
        )[0];
      return `Given your ${strategy ? '"' + strategy.label + '"' : 'selected'} strategy, **"${recommended.name}"** is your strongest bet. It scores ${recommended.scores.new_audiences} with new audiences. The hook "${recommended.hook}" directly addresses what your target segment cares about. ${recommended.why_it_works}`;
    }

    if (msg.includes('lcbm') || msg.includes('score')) {
      return `LCBM (Latent Consumer Behaviour Model) scores creatives on a 0-10 scale by simulating how each audience segment would respond based on their behavioral signals, content affinities, and purchase patterns. A score above 8.5 = Excellent (strong signal), 7-8.5 = Good (worth testing), 5-7 = Average (use cautiously), below 5 = Poor (likely to underperform or actively harm brand perception with that segment).`;
    }

    if (msg.includes('test plan') || msg.includes('setup')) {
      const plan = act2Data.test_plan;
      return `The optimal test plan for ${brand.name}: Run ${plan.cells_per_track} cells per audience track with a $${plan.budget.toLocaleString()} total budget over ${plan.duration_hours} hours. Key rules: Stop any cell if CPA spikes too early (saves budget), promote immediately when ROAS crosses your threshold. This gives you statistically meaningful data without burning budget on losers.`;
    }

    if (msg.includes('mismatch')) {
      const worstMatch = act2Data.creatives.sort((a, b) => {
        const aGap = Math.abs(
          a.scores.new_audiences - (a.scores.existing_subscribers || a.scores.existing_customers || 0)
        );
        const bGap = Math.abs(
          b.scores.new_audiences - (b.scores.existing_subscribers || b.scores.existing_customers || 0)
        );
        return bGap - aGap;
      })[0];
      const existingScore = worstMatch.scores.existing_subscribers ||
        worstMatch.scores.existing_customers || 0;
      return `The biggest mismatch is **"${worstMatch.name}"** — it scores ${existingScore} with existing customers but only ${worstMatch.scores.new_audiences} with new audiences (or vice versa). A gap this large means the creative is perfectly tuned for one audience and actively repels the other. Never run this creative to both segments simultaneously.`;
    }
  }

  // Act 3 responses
  if (currentAct === 3) {
    const scenario = selectedStrategy
      ? act3Data.scenarios[selectedStrategy]
      : Object.values(act3Data.scenarios)[0];

    if (msg.includes('root cause')) {
      return `LCBM's root cause analysis points to: **${scenario.diagnosis.type}**. ${scenario.diagnosis.root_cause} This is different from what the surface metrics suggest — it's not about creative fatigue or budget. It's a fundamental positioning issue that requires a messaging fix, not a media fix.`;
    }

    if (msg.includes('best recovery') || msg.includes('highest lift')) {
      const best = scenario.recovery_strategies.sort((a, b) => {
        const aLift = parseInt(a.expected_lift.match(/\d+/)?.[0] || 0);
        const bLift = parseInt(b.expected_lift.match(/\d+/)?.[0] || 0);
        return bLift - aLift;
      })[0];
      return `The recovery strategy with the highest expected lift is **"${best.label}"**: ${best.expected_lift}. The Transsuasion copy "${best.transsuasion_copy}" directly addresses the psychological barrier we identified. This is your fastest path to fixing the funnel.`;
    }

    if (msg.includes('struggling') || msg.includes('underperform')) {
      const badTrack = scenario.tracks.find(
        t => t.status === 'STRUGGLING' ||
             t.status === 'FAILING' ||
             t.status === 'UNDERPERFORMING'
      );
      if (badTrack) {
        return `The "${badTrack.name}" track is struggling because ${scenario.diagnosis.root_cause} The funnel data confirms this: ${scenario.diagnosis.funnel_insight} The good news is this is fixable — it's not a product problem, it's a positioning and messaging problem.`;
      }
    }

    if (msg.includes('quick win') || msg.includes('fastest')) {
      return `Your 3 fastest wins right now: 1) Pause the underperforming track immediately to stop budget bleed. 2) Deploy the Transsuasion copy from the recovery strategy — it can go live in 24 hours. 3) Reactivate the winning track from Act 2 with the new messaging angle. These three moves alone could improve overall ROAS by 40-60% within 2 weeks.`;
    }
  }

  // Act 4 responses
  if (currentAct === 4) {
    if (msg.includes('best market') || msg.includes('highest roas')) {
      const best = [...act4Data.markets].sort(
        (a, b) => b.predicted_roas - a.predicted_roas
      )[0];
      return `**${best.name}** has the best predicted ROAS at ${best.predicted_roas}x with a LCBM market score of ${best.lcbm_score}. Key reason: ${best.lcbm_insight} I'd recommend allocating extra budget here in the first 30 days to validate the prediction before scaling the other markets.`;
    }

    if (msg.includes('competition') || msg.includes('differentiat')) {
      return act4Data.markets.map(m =>
        `**${m.name}**: ${m.competitive_landscape} → Strategy: ${m.lcbm_insight}`
      ).join('\n\n');
    }

    if (msg.includes('budget') || msg.includes('split')) {
      const layers = act4Data.blended_playbook.layers;
      return `The optimal budget split across the blended playbook: ${layers.map(
        l => `${l.budget_pct}% to ${l.name} (${l.description})`
      ).join(', ')}. This weighting maximizes both new customer acquisition and retention of DTC buyers who'll encounter the brand in retail for the first time.`;
    }

    if (msg.includes('all 3') || msg.includes('focus on one')) {
      const topMarket = [...act4Data.markets].sort(
        (a, b) => b.predicted_roas - a.predicted_roas
      )[0];
      return `My recommendation: Launch in all 3 markets simultaneously but with different budget weightings. ${topMarket.name} gets 40% (highest predicted ROAS), the others split the remaining 60%. This gives you comparative data across market types while putting your best resources where the odds are highest. Revisit allocation after 3 weeks of data.`;
    }
  }

  // Generic fallback responses
  const fallbacks = [
    `Great question about ${brand.name}! Based on the LCBM analysis, the key insight here is that behavioral signals don't lie — the data is pointing you toward a clear path. What specific aspect would you like to dig deeper into?`,
    `The Social Agents simulation for ${brand.name} suggests that audience psychology is at the heart of this decision. The tension between "${brand.tension}" is real and measurable in the data.`,
    `For ${brand.name}'s ${brand.new_product.name} launch, the most critical factor at this stage is consistency across your decisions. The conditions you've set in previous acts are creating a compounding effect on your outcomes.`,
    `LCBM's behavioral model shows that ${brand.name}'s audience is more nuanced than typical demographic segments suggest. The content affinity signals are the real predictor of purchase intent here.`
  ];

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

const actIcons = { 1: Users, 2: Lightbulb, 3: TrendingUp, 4: MapPin };

function ChatPanel({ messages, brandData, currentAct, addMessage }) {
  const { storyState } = useStory();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const ActIcon = actIcons[currentAct] || MessageSquare;
  const prompts = actPrompts[currentAct] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (messageText) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    addMessage({ type: 'user', content: text });
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = generateResponse(
        text, brandData, currentAct, storyState
      );
      setIsTyping(false);
      addMessage({ type: 'assistant', content: response });
    }, 800 + Math.random() * 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (prompt) => {
    handleSend(prompt.message);
  };

  return (
    <div className="chat-panel">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-avatar">
            <Brain className="avatar-icon" />
          </div>
          <div>
            <h3 className="chat-title">AI Guide</h3>
            <div className="chat-status">
              <span className="status-dot" />
              <span>Act {currentAct} · {brandData.brand.name}</span>
            </div>
          </div>
        </div>
        <div className="chat-act-badge">
          <ActIcon className="act-badge-icon" />
          <span>Act {currentAct}</span>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="quick-prompts">
        <p className="prompts-label">Quick questions</p>
        <div className="prompts-grid">
          {prompts.map((prompt, idx) => (
            <button
              key={idx}
              className="prompt-chip"
              onClick={() => handleQuickPrompt(prompt)}
            >
              {prompt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.type} fade-in`}
          >
            {msg.type === 'assistant' && (
              <div className="message-avatar">
                <Sparkles className="msg-avatar-icon" />
              </div>
            )}
            <div className={`message-bubble ${msg.type}`}>
              <p className="message-text">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="message assistant fade-in">
            <div className="message-avatar">
              <Sparkles className="msg-avatar-icon" />
            </div>
            <div className="message-bubble assistant typing">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-wrap">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder={`Ask about Act ${currentAct}...`}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className="send-btn"
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isTyping}
            style={inputValue.trim() && !isTyping ? {
              background: brandData.brand.colors.primary
            } : {}}
          >
            <Send className="send-icon" />
          </button>
        </div>
        <p className="input-hint">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

export default ChatPanel;