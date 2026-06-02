import React, { useState, useEffect, useRef } from 'react';

export default function MeetingRunner({ meetings, setMeetings, soundAlert, setView }) {
  const [activeMeetingId, setActiveMeetingId] = useState(meetings.length > 0 ? meetings[0].id : null);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [timerTotalSeconds, setTimerTotalSeconds] = useState(0);
  const [minutesText, setMinutesText] = useState('');

  const activeMeeting = meetings.find(m => m.id === activeMeetingId);
  const topics = activeMeeting?.topics || [];
  const currentTopic = topics[currentTopicIndex];

  // Initialize timer when topic changes or mounts
  useEffect(() => {
    if (currentTopic) {
      setTimerRemaining(currentTopic.duration * 60);
      setTimerTotalSeconds(currentTopic.duration * 60);
      setIsTimerRunning(false);
    }
  }, [currentTopicIndex, activeMeetingId, currentTopic]);

  // Load minutes text
  useEffect(() => {
    if (activeMeeting) {
      setMinutesText(activeMeeting.minutes || '');
    }
  }, [activeMeetingId]);

  // Timer Interval
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining(prev => prev - 1);
      }, 1000);
    } else if (isTimerRunning && timerRemaining <= 0) {
      handleTopicCompleted();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerRemaining]);

  // Audio Synthesizer
  const playTransitionChime = () => {
    if (!soundAlert) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      
      osc1.start();
      osc1.stop(ctx.currentTime + 0.35);
      
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(1318.51, ctx.currentTime);
        gain2.gain.setValueAtTime(0.1, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc2.start();
        osc2.stop(ctx.currentTime + 0.45);
      }, 150);
      
    } catch (e) {
      console.warn("Web Audio chime failed", e);
    }
  };

  const markTopicCompleted = (topicId) => {
    setMeetings(prev => prev.map(m => {
      if (m.id === activeMeetingId) {
        const comp = m.completedTopics || [];
        if (!comp.includes(topicId)) {
          return { ...m, completedTopics: [...comp, topicId] };
        }
      }
      return m;
    }));
  };

  const handleTopicCompleted = () => {
    setIsTimerRunning(false);
    playTransitionChime();
    
    if (currentTopic) {
      markTopicCompleted(currentTopic.id);
    }

    if (currentTopicIndex + 1 < topics.length) {
      setCurrentTopicIndex(prev => prev + 1);
    } else {
      alert("🎉 All topics completed!");
    }
  };

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);

  const handlePrev = () => {
    if (currentTopicIndex > 0) {
      setIsTimerRunning(false);
      setCurrentTopicIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentTopic) {
      markTopicCompleted(currentTopic.id);
    }
    if (currentTopicIndex + 1 < topics.length) {
      setIsTimerRunning(false);
      setCurrentTopicIndex(prev => prev + 1);
    } else {
      setIsTimerRunning(false);
      alert("Already on the final topic.");
    }
  };

  const handleSaveMinutes = (e) => {
    const val = e.target.value;
    setMinutesText(val);
    setMeetings(prev => prev.map(m => m.id === activeMeetingId ? { ...m, minutes: val } : m));
  };

  const insertTag = (tag) => {
    const stamp = tag === 'decision' ? '\n💡 DECISION: ' : '\n🔥 ACTION: ';
    const newVal = minutesText + stamp;
    setMinutesText(newVal);
    setMeetings(prev => prev.map(m => m.id === activeMeetingId ? { ...m, minutes: newVal } : m));
  };

  const handleEndMeeting = () => {
    if (currentTopic) markTopicCompleted(currentTopic.id);
    alert("Session complete. Progress saved.");
    setView('dashboard');
  };

  if (!activeMeeting) {
    return (
      <div className="view-panel active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>No meetings available to run. Please create one in the Calendar or Planner.</p>
      </div>
    );
  }

  // Timer formatting
  const mins = Math.floor(timerRemaining / 60);
  const secs = timerRemaining % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  
  const ringRatio = timerTotalSeconds > 0 ? timerRemaining / timerTotalSeconds : 1;
  const ringCircumference = 534.07; // 2*PI*85
  const ringOffset = ringCircumference - (ringRatio * ringCircumference);
  const ringColor = ringRatio < 0.2 ? 'var(--color-danger)' : 'url(#runnerRadialGradient)';

  // Pace Math
  let expectedSeconds = 0;
  for (let i = 0; i <= currentTopicIndex; i++) {
    expectedSeconds += topics[i].duration * 60;
  }
  const actualUsed = expectedSeconds - timerRemaining;
  const variance = actualUsed - expectedSeconds;
  let pacePercent = 50;
  let paceText = "On Track";
  let paceColor = "var(--color-success)";

  if (variance > 60) {
    pacePercent = Math.max(15, 50 - (variance / 6));
    paceText = "Behind";
    paceColor = "var(--color-warning)";
  } else if (variance < -60) {
    pacePercent = Math.min(85, 50 + (Math.abs(variance) / 6));
    paceText = "Ahead";
    paceColor = "var(--color-accent-cyan)";
  }

  return (
    <div className="view-panel active">
      <div className="view-header-module" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="title-meta">{activeMeeting.tag.toUpperCase()} SYNC</div>
          <h1 className="view-title">{activeMeeting.title}</h1>
        </div>
        <button className="action-btn-primary" onClick={handleEndMeeting}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Complete Meeting</span>
        </button>
      </div>

      <div className="runner-split-container">
        
        {/* Timer UI */}
        <section className="runner-timer-panel bento-card">
          <div className="card-header text-center border-none">
            <span className="timer-category-badge">Topic {currentTopicIndex + 1} of {topics.length}</span>
            <h2 className="active-topic-heading">{currentTopic?.title || 'Done'}</h2>
            <p className="active-speaker-tag">Led by <span>{currentTopic?.speaker || '-'}</span></p>
          </div>
          
          <div className="timer-countdown-container">
            <svg className="countdown-radial-svg" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="runnerRadialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-accent-violet)" />
                  <stop offset="100%" stopColor="var(--color-accent-cyan)" />
                </linearGradient>
              </defs>
              <circle className="countdown-radial-bg" cx="100" cy="100" r="85" />
              <circle 
                className="countdown-radial-fill" 
                cx="100" cy="100" r="85" 
                stroke={ringColor}
                strokeDashoffset={ringOffset}
              />
            </svg>
            <div className="countdown-text">
              <span className="countdown-time">{timeStr}</span>
              <span className="countdown-label">{currentTopic?.duration || 0}:00 Total</span>
            </div>
          </div>

          <div className="timer-actions-row">
            <button className="timer-control-btn btn-secondary" onClick={handlePrev}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
            </button>
            <button className={`timer-control-btn btn-primary-pulsing ${isTimerRunning ? 'paused' : ''}`} onClick={toggleTimer}>
              {isTimerRunning ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              )}
            </button>
            <button className="timer-control-btn btn-secondary" onClick={handleNext}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
            </button>
          </div>
        </section>

        {/* Minutes Card */}
        <section className="runner-minutes-card bento-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Meeting Minutes</h2>
              <p className="card-subtitle">Real-time synced notes</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="action-btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => insertTag('decision')}>💡 Decision</button>
              <button className="action-btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => insertTag('action')}>🔥 Action</button>
            </div>
          </div>
          <div className="card-body" style={{ flexGrow: 1, display: 'flex' }}>
            <textarea 
              className="minutes-editor" 
              value={minutesText} 
              onChange={handleSaveMinutes}
              placeholder="Record notes and action items here..."
            ></textarea>
          </div>
        </section>

        {/* Sidebar Tracking */}
        <aside className="runner-sidebar bento-card">
          <div className="card-header"><h2 className="card-title">Agenda Progress</h2></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column' }}>
            
            <div className="timeline-runner-list">
              {topics.map((t, idx) => {
                const isActive = idx === currentTopicIndex;
                const isDone = (activeMeeting.completedTopics || []).includes(t.id) || idx < currentTopicIndex;
                const statusClass = isActive ? 'active' : isDone ? 'done' : '';
                return (
                  <div key={t.id} className={`runner-timeline-item ${statusClass}`}>
                    <div className="runner-item-status-icon">
                      {isActive ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>
                      ) : isDone ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
                      )}
                    </div>
                    <div className="runner-item-details">
                      <span className="runner-item-title">{t.title}</span>
                      <span className="runner-item-meta">{t.speaker}</span>
                    </div>
                    <span className="runner-item-duration">{t.duration}m</span>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '24px' }}>
              <h3 className="subsection-title">Pace Meter</h3>
              <div className="pace-gauge-wrapper">
                <div className="pace-gauge-indicator" style={{ width: `${pacePercent}%` }}></div>
              </div>
              <div className="pace-gauge-labels" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Behind</span>
                <span className="active-pace-status" style={{ color: paceColor }}>{paceText}</span>
                <span>Ahead</span>
              </div>
            </div>

          </div>
        </aside>

      </div>
    </div>
  );
}
