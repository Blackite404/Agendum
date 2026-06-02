import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TasksTab from './components/TasksTab';
import CalendarTab from './components/CalendarTab';
import AnalyticsTab from './components/AnalyticsTab';
import PreferencesTab from './components/PreferencesTab';
import MeetingRunner from './components/MeetingRunner';

// Seed Data
const DEFAULT_TREE = [
  {
    id: 'f-1', title: 'Agendum UI Development', isExpanded: true, taskCount: 4, children: [
      { id: 'f-1-1', title: 'Sprint 1: Core Framework', isExpanded: false, taskCount: 0, children: [] },
      { id: 'f-1-2', title: 'Sprint 2: Dynamic React', isExpanded: false, taskCount: 0, children: [] }
    ]
  },
  { id: 'f-2', title: 'Marketing Sync', isExpanded: false, taskCount: 0, children: [] }
];

const DEFAULT_TASKS = [
  { id: 't-1', folderId: 'f-1', title: 'Implement dynamic React Tree component', priority: 'high', completed: true },
  { id: 't-2', folderId: 'f-1', title: 'Implement Drag and Drop React Lists', priority: 'high', completed: false },
  { id: 't-3', folderId: 'f-1', title: 'Rule of Thirds Calendar Grid calculation', priority: 'medium', completed: false },
  { id: 't-4', folderId: 'f-1', title: 'Rename Settings to Preferences globally', priority: 'low', completed: true }
];

const DEFAULT_MEETINGS = [
  {
    id: "meet-1", title: "Design System Align & Visual Assets", date: "2026-06-02", time: "10:30", tag: "Design", duration: 30, attendees: "Julius Drake, Clara Hughes",
    topics: [
      { id: "t1-1", title: "React Component Hierarchy", speaker: "Julius Drake", duration: 15 },
      { id: "t1-2", title: "SVG Visuals & Animation Timings", speaker: "Clara Hughes", duration: 15 }
    ],
    minutes: "", completedTopics: []
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Global State
  const [treeFolders, setTreeFolders] = useState(DEFAULT_TREE);
  const [tasksList, setTasksList] = useState(DEFAULT_TASKS);
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 'e-1', title: 'Weekly Product Review', date: '2026-06-15', type: 'product' },
    { id: 'e-2', title: 'React UI Brainstorm', date: '2026-06-02', type: 'design' }
  ]);
  const [meetings, setMeetings] = useState(DEFAULT_MEETINGS);
  const [userProfile, setUserProfile] = useState({ name: 'Julius Drake', role: 'Design Director' });
  const [soundAlert, setSoundAlert] = useState(true);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('agendum_react_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTreeFolders(parsed.treeFolders || DEFAULT_TREE);
        setTasksList(parsed.tasksList || DEFAULT_TASKS);
        setCalendarEvents(parsed.calendarEvents || []);
        setMeetings(parsed.meetings || DEFAULT_MEETINGS);
        setUserProfile(parsed.userProfile || { name: 'Julius Drake', role: 'Design Director' });
        setSoundAlert(parsed.soundAlert !== undefined ? parsed.soundAlert : true);
        setCurrentView(parsed.currentView || 'dashboard');
      } catch (e) { console.error(e); }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('agendum_react_state', JSON.stringify({
      treeFolders, tasksList, calendarEvents, meetings, userProfile, soundAlert, currentView
    }));
  }, [treeFolders, tasksList, calendarEvents, meetings, userProfile, soundAlert, currentView]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg> },
    { id: 'tasks', label: 'Tasks Tracker', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
    { id: 'calendar', label: 'Calendar', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { id: 'analytics', label: 'Analytics', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { id: 'runner', label: 'Meeting Runner', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg> },
    { id: 'preferences', label: 'Preferences', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
  ];

  return (
    <div className="app-container">
      
      {/* Sidebar */}
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-glow"></div>
          <div className="brand-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="var(--color-accent-violet)" />
              <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="var(--color-accent-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="brand-name">Agendum</span>
        </div>

        <nav className="sidebar-menu">
          <p className="menu-label">Workspace</p>
          <ul>
            {navItems.map(item => (
              <li 
                key={item.id} 
                className={`menu-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => setCurrentView(item.id)}
              >
                <div className="menu-icon">{item.icon}</div>
                <span>{item.label}</span>
                {item.id === 'dashboard' && <span className="badge badge-glow">Live</span>}
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="profile-card">
            <div 
              className="profile-avatar"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent-violet), var(--color-accent-cyan))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 700, color: 'white'
              }}
            >
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="profile-info">
              <h4 className="profile-name">{userProfile.name}</h4>
              <span className="profile-role">{userProfile.role}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="app-workspace">
        <header className="app-header">
          <div className="search-bar">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Search workspaces..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="header-right">
            <button className="notification-btn" style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="notification-indicator"></span>
            </button>
            <button className="action-btn-primary" onClick={() => setCurrentView('calendar')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Quick Action</span>
            </button>
          </div>
        </header>

        <main className="workspace-content">
          {currentView === 'dashboard' && <Dashboard meetings={meetings} setView={setCurrentView} />}
          {currentView === 'tasks' && <TasksTab treeFolders={treeFolders} setTreeFolders={setTreeFolders} tasksList={tasksList} setTasksList={setTasksList} />}
          {currentView === 'calendar' && <CalendarTab calendarEvents={calendarEvents} setCalendarEvents={setCalendarEvents} />}
          {currentView === 'analytics' && <AnalyticsTab meetings={meetings} tasksList={tasksList} />}
          {currentView === 'preferences' && <PreferencesTab userProfile={userProfile} setUserProfile={setUserProfile} soundAlert={soundAlert} setSoundAlert={setSoundAlert} />}
          {currentView === 'runner' && <MeetingRunner meetings={meetings} setMeetings={setMeetings} soundAlert={soundAlert} setView={setCurrentView} />}
        </main>
      </div>

    </div>
  );
}
