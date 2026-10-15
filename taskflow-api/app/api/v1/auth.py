from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import Token, UserCreate, UserPublic

router = APIRouter()

@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)) -> User:
    if len(payload.password) < settings.password_min_length:
        raise HTTPException(status_code=422, detail=f"Password must be at least {settings.password_min_length} characters")
    user = User(email=str(payload.email).lower(), hashed_password=hash_password(payload.password))
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    return user

@router.post("/login", response_model=Token)
def login(payload: UserCreate, db: Session = Depends(get_db)) -> Token:
    email = str(payload.email).lower()
    user = db.scalar(select(User).where(User.email == email))
    # Same public error for unknown users and incorrect passwords.
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    return Token(access_token=create_access_token(str(user.id)))
