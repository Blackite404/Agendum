import React from 'react';

export default function Dashboard({ meetings, setView }) {
  const todaysMeetings = meetings.slice(0, 3); // Fake today's meetings

  return (
    <div className="view-panel active">
      <div className="view-header-module">
        <div className="title-meta">TODAY'S OVERVIEW</div>
        <h1 className="view-title">Productivity Workspace</h1>
      </div>

      <div className="analytics-grid-bento">
        
        <section className="bento-card bento-colspan-2 bento-rowspan-2">
          <div className="card-header">
            <div>
              <h2 className="card-title">Scheduled Meetings</h2>
              <p className="card-subtitle">Manage today's agenda sessions</p>
            </div>
            <span className="card-tag tag-violet" style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--color-accent-violet-glow)', color: 'hsl(263, 100%, 75%)', border: '1px solid hsla(263, 90%, 65%, 0.25)' }}>
              {meetings.length} Sessions
            </span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {todaysMeetings.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)' }}>No meetings scheduled.</p>
            ) : (
              todaysMeetings.map(meet => (
                <div key={meet.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px auto', alignItems: 'center', gap: '24px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius-md)', border: 'var(--border-glass)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: '16px' }}>
                    <span style={{ fontFamily: 'Outfit', fontWeight: 600, color: 'var(--color-text-primary)' }}>{meet.time}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{meet.date}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{meet.title}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Guests: {meet.attendees || 'None'}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{meet.duration} mins</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', marginTop: '4px', background: 'var(--color-accent-cyan-glow)', color: 'hsl(187, 100%, 65%)', border: '1px solid hsla(187, 92%, 46%, 0.25)' }}>
                      {meet.tag}
                    </span>
                  </div>
                  <div>
                    <button 
                      onClick={() => setView('runner')}
                      style={{ background: 'rgba(255,255,255,0.04)', border: 'var(--border-glass)', borderRadius: 'var(--radius-sm)', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bento-card">
          <div className="card-header border-none">
            <h2 className="card-title">Quick Actions</h2>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', justifyContent: 'center' }}>
            <button 
              onClick={() => setView('calendar')}
              style={{ background: 'rgba(255,255,255,0.02)', border: 'var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', width: '100%' }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-accent-violet-glow)', color: 'hsl(263, 100%, 70%)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>Calendar</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Manage your schedule</span>
              </div>
            </button>
            <button 
              onClick={() => setView('tasks')}
              style={{ background: 'rgba(255,255,255,0.02)', border: 'var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', width: '100%' }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-accent-cyan-glow)', color: 'hsl(187, 100%, 65%)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>Task Tracker</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Action items & folders</span>
              </div>
            </button>
          </div>
        </section>

        <section className="bento-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header border-none">
            <h2 className="card-title">Inspirational Pulse</h2>
          </div>
          <div className="card-body" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ borderLeft: '2px solid var(--color-accent-cyan)', paddingLeft: '16px', marginTop: '8px' }}>
              <blockquote style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                "Good design is as little design as possible. It makes a product understandable and useful."
              </blockquote>
              <cite style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600, marginTop: '4px' }}>— Dieter Rams</cite>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Workspace Efficiency</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-accent-cyan)', boxShadow: '0 0 8px 0 var(--color-accent-cyan)' }}></div>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-accent-cyan)' }}>Optimal</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
