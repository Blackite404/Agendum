from sqlalchemy.orm import Session
from datetime import datetime
from models import models
from schemas import taskapp

def calculate_urgency(priority: int, due_date: datetime) -> float:
    time_remaining = (due_date.replace(tzinfo=None) - datetime.now()).total_seconds() / 3600
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

def update_task_partial(db: Session, task_id: int, task_update: taskapp.TaskUpdate):
    
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        return None
        
     
    
    update_data = task_update.dict(exclude_unset=True)
    
    
    for key, value in update_data.items():
        setattr(db_task, key, value)
        
    
    
    if "priority" in update_data or "due_date" in update_data:
        
        current_priority = update_data.get("priority") or db_task.priority
        current_due_date = update_data.get("due_date") or db_task.due_date
        
        db_task.urgency_score = calculate_urgency(current_priority, current_due_date)
        
    
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    
    
    if not db_task:
        return None
        
    # 3. Delete the task and commit the transaction
    db.delete(db_task)
    db.commit()
    
    # 4. Return the deleted task (or a success boolean/message)
    return db_task