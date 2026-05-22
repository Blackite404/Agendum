from fastapi import FastAPI
from models import models
from db.database import engine
from db.database import Base

from routers.router import router as tasks_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task_Manager-api")

app.include_router(tasks_router)
