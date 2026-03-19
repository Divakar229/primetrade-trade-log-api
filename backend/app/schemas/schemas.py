from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
from app.models.models import UserRole, TradeType, TradeStatus


# ─── Auth Schemas ────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str

    @field_validator("username")
    @classmethod
    def username_alphanumeric(cls, v):
        if not v.replace("_", "").isalnum():
            raise ValueError("Username must be alphanumeric (underscores allowed)")
        if len(v) < 3 or len(v) > 30:
            raise ValueError("Username must be 3–30 characters")
        return v

    @field_validator("password")
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password must be 72 characters or fewer (bcrypt limit)")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    username: str
    role: UserRole
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ─── Trade Schemas ────────────────────────────────────────────────────────────

class TradeCreate(BaseModel):
    symbol: str
    trade_type: TradeType
    quantity: float
    entry_price: float
    exit_price: Optional[float] = None
    status: TradeStatus = TradeStatus.open
    notes: Optional[str] = None

    @field_validator("quantity", "entry_price")
    @classmethod
    def must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Must be greater than 0")
        return v

    @field_validator("symbol")
    @classmethod
    def symbol_upper(cls, v):
        return v.upper().strip()


class TradeUpdate(BaseModel):
    symbol: Optional[str] = None
    trade_type: Optional[TradeType] = None
    quantity: Optional[float] = None
    entry_price: Optional[float] = None
    exit_price: Optional[float] = None
    status: Optional[TradeStatus] = None
    notes: Optional[str] = None


class TradeOut(BaseModel):
    id: int
    symbol: str
    trade_type: TradeType
    quantity: float
    entry_price: float
    exit_price: Optional[float]
    status: TradeStatus
    notes: Optional[str]
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}
