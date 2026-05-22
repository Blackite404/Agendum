"""
Database initialization script
Run this to create tables and insert reference data
"""
import sys
import os

# Add app directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from sqlalchemy import text
from db.database import engine
from core.config import settings
from core.logger import logger


def run_sql_file(file_path: str):
    """Execute SQL commands from a file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()

        # Split by semicolon and execute each statement
        statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]

        with engine.connect() as conn:
            for statement in statements:
                # Skip empty statements and comments
                if not statement or statement.startswith('--'):
                    continue

                try:
                    conn.execute(text(statement))
                    conn.commit()
                except Exception as e:
                    # Skip errors for CREATE DATABASE, CREATE USER, GRANT (they may already exist)
                    if any(keyword in statement.upper() for keyword in ['CREATE DATABASE', 'CREATE USER', 'GRANT']):
                        logger.warning(f"Skipping statement (may already exist): {str(e)}")
                        continue
                    else:
                        raise

        logger.info(f"Successfully executed SQL file: {file_path}")
        return True

    except Exception as e:
        logger.error(f"Error executing SQL file {file_path}: {str(e)}")
        return False


def init_database():
    """Initialize database with schema and reference data"""

    logger.info("=" * 80)
    logger.info("DATABASE INITIALIZATION STARTED")
    logger.info("=" * 80)

    # Get paths to SQL files
    db_init_file = os.path.join(os.path.dirname(__file__), 'database', 'dmdapp', 'dbinit.sql')
    db_insert_file = os.path.join(os.path.dirname(__file__), 'database', 'dmdapp', 'dbinsert.sql')

    # Check if files exist
    if not os.path.exists(db_init_file):
        logger.error(f"Database init file not found: {db_init_file}")
        return False

    if not os.path.exists(db_insert_file):
        logger.error(f"Database insert file not found: {db_insert_file}")
        return False

    # Execute schema creation
    logger.info("Creating database schema...")
    if not run_sql_file(db_init_file):
        logger.error("Failed to create database schema")
        return False

    # Execute reference data insertion
    logger.info("Inserting reference data...")
    if not run_sql_file(db_insert_file):
        logger.error("Failed to insert reference data")
        return False

    logger.info("=" * 80)
    logger.info("DATABASE INITIALIZATION COMPLETED SUCCESSFULLY")
    logger.info("=" * 80)

    return True


if __name__ == "__main__":
    success = init_database()
    sys.exit(0 if success else 1)
