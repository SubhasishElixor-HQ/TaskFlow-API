from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskPublic, TaskStatus, TaskUpdate

router = APIRouter()

@router.post("", response_model=TaskPublic, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Task:
    task = Task(title=payload.title.strip(), description=payload.description, owner_id=current_user.id)
    if not task.title:
        raise HTTPException(status_code=422, detail="Title cannot be blank")
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.get("", response_model=list[TaskPublic])
def list_tasks(status_filter: TaskStatus | None = Query(default=None, alias="status"), limit: int = Query(default=20, ge=1, le=100), offset: int = Query(default=0, ge=0), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> list[Task]:
    query = select(Task).where(Task.owner_id == current_user.id).order_by(Task.created_at.desc(), Task.id.desc())
    if status_filter is not None:
        query = query.where(Task.status == status_filter)
    return list(db.scalars(query.offset(offset).limit(limit)).all())

@router.get("/{task_id}", response_model=TaskPublic)
def get_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Task:
    task = db.scalar(select(Task).where(Task.id == task_id, Task.owner_id == current_user.id))
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.patch("/{task_id}", response_model=TaskPublic)
def update_task(task_id: int, payload: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Task:
    task = db.scalar(select(Task).where(Task.id == task_id, Task.owner_id == current_user.id))
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    updates = payload.model_dump(exclude_unset=True)
    if "title" in updates and updates["title"] is not None:
        updates["title"] = updates["title"].strip()
        if not updates["title"]:
            raise HTTPException(status_code=422, detail="Title cannot be blank")
    for field, value in updates.items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> Response:
    task = db.scalar(select(Task).where(Task.id == task_id, Task.owner_id == current_user.id))
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
