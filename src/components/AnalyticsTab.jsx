import React, { useState, useEffect } from 'react';

export default function AnalyticsTab({ meetings, tasksList }) {
  const [animateCharts, setAnimateCharts] = useState(false);

  useEffect(() => {
    // Trigger animations after mount for hardware acceleration transition effect
    const timer = setTimeout(() => setAnimateCharts(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate metrics
  const totalTasks = tasksList.length;
  const completedTasks = tasksList.filter(t => t.completed).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalMeetings = meetings.length;
  const totalMeetingMinutes = meetings.reduce((sum, m) => sum + (m.duration || 0), 0);

  // SVG Math for Radial Progress Ring
  const radialRadius = 40;
  const radialCircumference = 2 * Math.PI * radialRadius; // 251.3
  const strokeOffset = animateCharts ? radialCircumference - (taskCompletionRate / 100) * radialCircumference : radialCircumference;

  // Fake recent activities for list
  const recentActivities = [
    { id: 1, title: 'Completed "UI Design System" sprint', time: '2 hours ago', color: 'var(--color-success)' },
    { id: 2, title: 'Hosted "Engineering Sync"', time: '4 hours ago', color: 'var(--color-accent-cyan)' },
    { id: 3, title: 'Reordered Tasks in "Marketing"', time: 'Yesterday', color: 'var(--color-accent-violet)' },
    { id: 4, title: 'Updated System Preferences', time: 'Yesterday', color: 'var(--color-warning)' },
  ];

  // Bar chart fake weekly data (percentages)
  const barData = [40, 65, 80, 50, 95, 30, 75]; 

  return (
    <div className="view-panel active">
      <div className="view-header-module">
        <div className="title-meta">PERFORMANCE METRICS</div>
        <h1 className="view-title">Analytics Dashboard</h1>
      </div>

      <div className="analytics-grid-bento">
        
        {/* Metric 1: Task Completion Radial */}
        <section className="bento-card" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <h2 className="card-title" style={{ alignSelf: 'flex-start', marginBottom: '16px' }}>Task Completion</h2>
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            <svg style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }} viewBox="0 0 100 100">
              <defs>
                <linearGradient id="radialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-accent-violet)" />
                  <stop offset="100%" stopColor="var(--color-accent-cyan)" />
                </linearGradient>
              </defs>
              <circle 
                cx="50" cy="50" r={radialRadius} 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.05)" 
                strokeWidth="8" 
              />
              <circle 
                cx="50" cy="50" r={radialRadius} 
                fill="none" 
                stroke="url(#radialGradient)" 
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray={radialCircumference}
                strokeDashoffset={strokeOffset}
                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.25, 0.8, 0.25, 1)' }}
              />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 700 }}>{taskCompletionRate}%</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Done</div>
            </div>
          </div>
        </section>

        {/* Metric 2: Weekly Activity Bar Chart (Col Span 2) */}
        <section className="bento-card bento-colspan-2">
          <div className="card-header border-none" style={{ marginBottom: '0' }}>
            <div>
              <h2 className="card-title">Weekly Focus Output</h2>
              <p className="card-subtitle">Relative productivity score across 7 days</p>
            </div>
          </div>
          <div className="chart-container-flex">
            <svg className="bar-chart-svg" viewBox="0 0 400 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-accent-violet)" />
                  <stop offset="100%" stopColor="var(--color-accent-cyan)" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              <line x1="0" y1="40" x2="400" y2="40" className="chart-axis-line" />
              <line x1="0" y1="80" x2="400" y2="80" className="chart-axis-line" />
              <line x1="0" y1="120" x2="400" y2="120" className="chart-axis-line" />
              <line x1="0" y1="160" x2="400" y2="160" className="chart-axis-line" />

              {/* Bars */}
              {barData.map((val, idx) => {
                const barWidth = 32;
                const gap = (400 - (7 * barWidth)) / 8;
                const xPos = gap + (idx * (barWidth + gap));
                const maxH = 150;
                const h = animateCharts ? (val / 100) * maxH : 0;
                const yPos = 160 - h;

                return (
                  <rect 
                    key={idx}
                    className="bar-element"
                    x={xPos} 
                    y={yPos} 
                    width={barWidth} 
                    height={h} 
                    rx="4"
                  />
                );
              })}
            </svg>
          </div>
        </section>

        {/* Metric 3: Fast Stats Numbers */}
        <section className="bento-card">
          <h2 className="card-title">Scheduled Sessions</h2>
          <div className="widget-large-number">{totalMeetings}</div>
          <p className="card-subtitle">Total synced sessions created</p>
          
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 className="card-title" style={{ fontSize: '0.9rem' }}>Meeting Time</h2>
            <div className="widget-large-number" style={{ fontSize: '1.8rem', marginTop: '4px' }}>{totalMeetingMinutes}<span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>m</span></div>
          </div>
        </section>

        {/* Metric 4: Recent Activities Breakdown List (Col Span 2) */}
        <section className="bento-card bento-colspan-2">
          <div className="card-header border-none">
            <h2 className="card-title">Recent Workspace Activity</h2>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentActivities.map(act => (
              <div key={act.id} className="breakdown-row-item" style={{ animation: `staggerFadeIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards`, opacity: animateCharts ? 1 : 0, animationDelay: `${act.id * 0.1}s` }}>
                <div className="breakdown-label-block">
                  <div className="breakdown-color-dot" style={{ backgroundColor: act.color }}></div>
                  <span className="breakdown-title">{act.title}</span>
                </div>
                <div className="breakdown-stats-block">
                  <span className="breakdown-meta">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
