import React from 'react';

export default function PreferencesTab({ userProfile, setUserProfile, soundAlert, setSoundAlert }) {
  
  const handleProfileChange = (field, val) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: val
    }));
  };

  return (
    <div className="view-panel active">
      <div className="view-header-module">
        <div className="title-meta">WORKSPACE PREFERENCES</div>
        <h1 className="view-title">User Preferences</h1>
      </div>

      <div className="preferences-layout-grid">
        
        {/* Profile Card */}
        <section className="bento-card" aria-labelledby="headingProfileConfig">
          <div className="card-header">
            <div>
              <h2 id="headingProfileConfig" className="card-title">Profile Customization</h2>
              <p className="card-subtitle">Manage your personal signature and avatar metadata</p>
            </div>
          </div>
          <div className="card-body vertical-preferences-form" style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div 
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-accent-violet), var(--color-accent-cyan))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.1)'
                }}
              >
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="vertical-preferences-form" style={{ flexGrow: 1, gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="prefName" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Full Name</label>
                  <input 
                    type="text" 
                    id="prefName"
                    value={userProfile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: 'var(--border-glass)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                      padding: '8px 12px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="prefRole" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Professional Role</label>
                  <input 
                    type="text" 
                    id="prefRole"
                    value={userProfile.role}
                    onChange={(e) => handleProfileChange('role', e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: 'var(--border-glass)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                      padding: '8px 12px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Sound & Sync Controls */}
        <section className="bento-card" aria-labelledby="headingSystemConfig">
          <div className="card-header">
            <div>
              <h2 id="headingSystemConfig" className="card-title">System & Audio Preferences</h2>
              <p className="card-subtitle">Manage focus alerts, alarm toggles, and notification setups</p>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column' }}>
            
            <div className="preference-control-row">
              <div className="preference-details">
                <span className="pref-label">Presenter Double-Tone Alarm</span>
                <span className="pref-desc">Play a premium HSL audio synthesizer sound alert in your browser when an active topic timer finishes.</span>
              </div>
              <label className="pref-switch" id="lblPrefSound">
                <input 
                  type="checkbox" 
                  id="chkPrefSound"
                  checked={soundAlert}
                  onChange={(e) => setSoundAlert(e.target.checked)}
                />
                <span className="pref-slider"></span>
              </label>
            </div>

            <div className="preference-control-row">
              <div className="preference-details">
                <span className="pref-label">Workspace Performance Tracking</span>
                <span className="pref-desc">Send anonymized agenda metrics (variance percentages, pacing ratings) to local focus trackers.</span>
              </div>
              <label className="pref-switch" id="lblPrefTracking">
                <input type="checkbox" id="chkPrefTracking" defaultChecked />
                <span className="pref-slider"></span>
              </label>
            </div>

            <div className="preference-control-row">
              <div className="preference-details">
                <span className="pref-label">Active Auto-Save (LocalStorage Sync)</span>
                <span className="pref-desc">Sync core database pointers, checklists, and note pads to standard browser cache immediately to prevent data loss.</span>
              </div>
              <label className="pref-switch" id="lblPrefAutosave">
                <input type="checkbox" id="chkPrefAutosave" defaultChecked disabled />
                <span className="pref-slider"></span>
              </label>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
