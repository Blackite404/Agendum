## Setup Instructions

### 1. Prerequisites

- Python 3.12.6
- PostgreSQL 14+
- Virtual environment (recommended)

### 2. Database Setup

```bash
# Create database and schema
psql -U postgres
CREATE DATABASE Agendum;
\c agendum
CREATE SCHEMA agenapp;

# Run DDL script
psql -U postgres -d Agendum -f database/agenapp/dbinit.sql
```

### 3. Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows
venv\Scripts\activate
# On Linux/Mac
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
# Update database credentials, secret key, etc.
```

### 6. Run Application

```bash
# Development mode
python -m main

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
