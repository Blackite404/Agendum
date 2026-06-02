import React, { useState } from 'react';

export default function CalendarTab({ calendarEvents, setCalendarEvents }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 2)); // Fixed pre-seed date: June 2026
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTag, setNewEventTag] = useState('design');

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Launch modal to add event
  const handleDayClick = (dayNum, isCurrentMonth) => {
    if (!isCurrentMonth) return;
    const formattedDay = dayNum.toString().padStart(2, '0');
    const formattedMonth = (month + 1).toString().padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    setSelectedDateStr(dateStr);
    setIsModalOpen(true);
  };

  const handleAddEventSubmit = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEvent = {
      id: `event-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: newEventTitle.trim(),
      date: selectedDateStr,
      type: newEventTag
    };

    setCalendarEvents(prev => [...prev, newEvent]);
    setNewEventTitle('');
    setIsModalOpen(false);
  };

  // Create date grid array (including padding days from previous and next months)
  const gridCells = [];

  // 1. Padding from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    gridCells.push({
      dayNum: daysInPrevMonth - i,
      isCurrentMonth: false,
      dateStr: `${month === 0 ? year - 1 : year}-${(month === 0 ? 12 : month).toString().padStart(2, '0')}-${(daysInPrevMonth - i).toString().padStart(2, '0')}`
    });
  }

  // 2. Days in active month
  for (let i = 1; i <= daysInMonth; i++) {
    gridCells.push({
      dayNum: i,
      isCurrentMonth: true,
      dateStr: `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`
    });
  }

  // 3. Padding from next month to fill complete 6-row standard calendar grid (42 cells)
  const remainingCells = 42 - gridCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    gridCells.push({
      dayNum: i,
      isCurrentMonth: false,
      dateStr: `${month === 11 ? year + 1 : year}-${(month === 11 ? 1 : month + 2).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`
    });
  }

  return (
    <div className="view-panel active">
      <div className="view-header-module">
        <div className="title-meta">WORKSPACE CALENDAR</div>
        <h1 className="view-title">Team Schedule</h1>
      </div>

      <div className="calendar-layout-bento">
        
        {/* Navigation Toolbar */}
        <div className="calendar-header-actions bento-card border-none" style={{ marginBottom: '16px' }}>
          <div className="calendar-nav-controls">
            <button className="btn-cal-arrow" id="btnPrevMonth" onClick={handlePrevMonth} aria-label="Previous month">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <h2 className="current-month-heading">{monthNames[month]} {year}</h2>
            <button className="btn-cal-arrow" id="btnNextMonth" onClick={handleNextMonth} aria-label="Next month">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          <span 
            className="card-tag tag-cyan" 
            style={{ fontSize: '0.8rem', padding: '6px 12px', borderRadius: 'var(--radius-sm)' }}
          >
            {calendarEvents.length} Active Events
          </span>
        </div>

        {/* Days of Week Header */}
        <div className="calendar-days-week-grid" aria-label="Days of week">
          {daysOfWeek.map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid cells (Rule of Thirds proportions) */}
        <div className="calendar-dates-modular-grid">
          {gridCells.map((cell, idx) => {
            const isToday = cell.isCurrentMonth && cell.dayNum === 2 && month === 5 && year === 2026; // Fixed "today" for seed
            const dayEvents = calendarEvents.filter(e => e.date === cell.dateStr);

            return (
              <div 
                key={idx}
                className={`calendar-day-tile ${cell.isCurrentMonth ? '' : 'other-month'} ${isToday ? 'today' : ''}`}
                onClick={() => handleDayClick(cell.dayNum, cell.isCurrentMonth)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${cell.dateStr}`}
              >
                <span className="day-number-label">{cell.dayNum}</span>
                <div className="day-events-stack">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      className={`calendar-event-pill event-${event.type}`}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="calendar-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="calendar-modal-body" onClick={(e) => e.stopPropagation()}>
            <div className="card-header" style={{ marginBottom: '16px', paddingBottom: '8px' }}>
              <h2 className="card-title">Schedule New Event</h2>
            </div>
            <form onSubmit={handleAddEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Selected Date</label>
                <input 
                  type="text" 
                  value={selectedDateStr} 
                  readOnly 
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: 'var(--border-glass)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-muted)',
                    padding: '10px',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="modalEventTitle" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Event Title</label>
                <input 
                  type="text" 
                  id="modalEventTitle"
                  placeholder="e.g. UX Layout Retrospective"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  required
                  autoFocus
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: 'var(--border-glass)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                    padding: '10px',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="modalEventTag" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Category Tag</label>
                <select 
                  id="modalEventTag"
                  value={newEventTag}
                  onChange={(e) => setNewEventTag(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: 'var(--border-glass)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                    padding: '10px',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="design">🎨 Design Sync</option>
                  <option value="engineering">💻 Engineering Review</option>
                  <option value="product">🚀 Product Align</option>
                  <option value="marketing">📢 Marketing Campaign</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button 
                  type="button" 
                  className="action-btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="action-btn-primary"
                  style={{ padding: '8px 16px', boxShadow: 'none' }}
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
