from sqlalchemy import Column, Integer, String, DateTime, Float
from db.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    priority = Column(Integer)
    due_date = Column(DateTime)
    urgency_score = Column(Float)