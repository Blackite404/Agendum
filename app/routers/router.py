from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List

from db import database
from models import models
from schemas import taskapp
from services import crud
from db.database import SessionLocal

# Initialize the router and define a prefix so we don't have to type "/tasks" every time
router = APIRouter(
    prefix="/tasks",
    tags=["Tasks Management"]
)

# Dependency to safely manage database sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=taskapp.Task)
def create_task_endpoint(task: taskapp.TaskCreate, db: Session = Depends(get_db)):
    """
    Creates a new task and automatically calculates the Urgency Score.
    """
    return crud.create_task(db=db, task=task)

@router.get("/", response_model=List[taskapp.Task])
def get_tasks_endpoint(
    priority: int = Query(None, ge=1, le=5), 
    db: Session = Depends(get_db)
):
    """
    Fetches all tasks, with an optional query parameter to filter by priority.
    """
    return crud.get_tasks(db=db, priority=priority)

@router.patch("/{task_id}", response_model=taskapp.Task)
def partial_update_task_endpoint(
    task_id: int, 
    task: taskapp.TaskUpdate, # We use the new Optional schema here!
    db: Session = Depends(get_db)
):
    """
    Partially updates an existing task. 
    Only provided fields will be changed. Urgency Score recalculates automatically.
    """
    updated_task = crud.update_task_partial(db=db, task_id=task_id, task_update=task)
    
    if not updated_task:
        raise HTTPException(
            status_code=404, 
            detail=f"Task with ID {task_id} not found."
        )
        
    return updated_task

@router.delete("/{task_id}")
def delete_task_endpoint(task_id: int, db: Session = Depends(get_db)):
    """
    Permanently removes a task from the database.
    """
    deleted_task = crud.delete_task(db=db, task_id=task_id)
    
    if not deleted_task:
        raise HTTPException(
            status_code=404, 
            detail=f"Task with ID {task_id} not found."
        )
        
    return {"detail": f"Task {task_id} has been successfully deleted."}
