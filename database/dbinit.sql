
-- Database: agendum
-- Schema: taskapp

-- Create the schema if it does not exist
CREATE SCHEMA IF NOT EXISTS taskapp;

-- Set the active schema
SET search_path TO taskapp;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    priority INTEGER,
    due_date TIMESTAMP WITHOUT TIME ZONE,
    urgency_score DOUBLE PRECISION
);

-- Create indexes for performance (matching SQLAlchemy models)
CREATE INDEX IF NOT EXISTS ix_tasks_id ON tasks (id);
CREATE INDEX IF NOT EXISTS ix_tasks_title ON tasks (title);

-- Seed data: 10 mock tasks
INSERT INTO tasks (title, description, priority, due_date, urgency_score) VALUES
('Complete Q3 Financial Report', 'Gather all regional data and finalize the Q3 report for the board meeting.', 5, '2026-06-15 10:00:00', 48.5),
('Schedule Dentist Appointment', 'Call Dr. Smith''s office and book a cleaning for next month.', 2, '2026-05-25 14:00:00', 18.2),
('Update Project Documentation', 'Review and update the REST API documentation with the new endpoints.', 3, '2026-05-28 17:00:00', 25.0),
('Buy Groceries', 'Milk, eggs, bread, coffee, and vegetables for the week.', 1, '2026-05-23 18:00:00', 8.5),
('Fix Login Bug #452', 'Investigate and resolve the intermittent timeout issue on the login screen.', 4, '2026-05-24 12:00:00', 36.4),
('Prepare Presentation Slides', 'Draft the slide deck for the upcoming marketing campaign launch.', 4, '2026-06-05 09:00:00', 32.1),
('Review PR #89', 'Code review for the new authentication middleware implementation.', 3, '2026-05-26 15:00:00', 26.8),
('Renew Car Insurance', 'Check online portals for the best rates and renew the policy.', 5, '2026-05-30 23:59:00', 45.0),
('Plan Weekend Trip', 'Look up hotels and activities for the long weekend getaway.', 1, '2026-06-10 12:00:00', 2.0),
('Client Onboarding Call', 'Initial kickoff meeting with the new enterprise client.', 5, '2026-05-27 11:00:00', 47.3);
