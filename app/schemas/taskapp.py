from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    description: str
    priority: int = Field(..., ge=1, le=5)  # 1 (low) to 5 (high)
    due_date: datetime

    @validator('due_date')
    def date_must_be_future(cls, v):
        if v.replace(tzinfo=None) < datetime.now():
            raise ValueError('Due date must be in the future')
        return v

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    urgency_score: float

    class Config:
        from_attributes = True

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[int] = Field(None, ge=1, le=10)
    due_date: Optional[datetime] = None

    @validator('title', 'description')
    def prevent_swagger_placeholders(cls, v):
        if v == "string":
            raise ValueError("Please provide a real value or remove this field. 'string' is not allowed.")
        return v

    @validator('priority', 'due_date')
    def prevent_swagger_placeholders(cls, v):
        if v == "0":
            raise ValueError("Please provide a real value or remove this field. '0' is not allowed.")
        return v        

    @validator('due_date')
    def date_must_be_future(cls, v):
        if v and v.replace(tzinfo=None) < datetime.now():
            raise ValueError('Due date must be in the future')
        return v   