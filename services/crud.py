from sqlalchemy.orm import Session
from datetime import datetime
from models import models
from schemas import taskapp

def calculate_urgency(priority: int, due_date: datetime) -> float:
    time_remaining = (due_date - datetime.now()).total_seconds() / 3600
    score = (priority * 10) - max(0, time_remaining)
    return round(score, 2)

def create_task(db: Session, task: taskapp.TaskCreate):
    score = calculate_urgency(task.priority, task.due_date)
    
    # Convert Pydantic model to SQLAlchemy model
    db_task = models.Task(**task.dict(), urgency_score=score)
    
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_tasks(db: Session, priority: int = None):
    # You write db.query(models.Task) instead of raw SQL [cite: 34, 75]
    query = db.query(models.Task)
    if priority:
        query = query.filter(models.Task.priority == priority)
    return query.all()