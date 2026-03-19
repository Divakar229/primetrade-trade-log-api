from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.models import Trade, User, UserRole, TradeStatus
from app.schemas.schemas import TradeCreate, TradeUpdate, TradeOut
from app.services.deps import get_current_user, require_admin

router = APIRouter(prefix="/trades", tags=["Trades"])


@router.post("/", response_model=TradeOut, status_code=status.HTTP_201_CREATED)
def create_trade(
    payload: TradeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trade = Trade(**payload.model_dump(), owner_id=current_user.id)
    db.add(trade)
    db.commit()
    db.refresh(trade)
    return trade


@router.get("/", response_model=List[TradeOut])
def list_trades(
    status: Optional[TradeStatus] = Query(None),
    symbol: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Admins see all trades; users see only their own
    query = db.query(Trade)
    if current_user.role != UserRole.admin:
        query = query.filter(Trade.owner_id == current_user.id)
    if status:
        query = query.filter(Trade.status == status)
    if symbol:
        query = query.filter(Trade.symbol == symbol.upper())
    return query.order_by(Trade.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{trade_id}", response_model=TradeOut)
def get_trade(
    trade_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trade = db.query(Trade).filter(Trade.id == trade_id).first()
    if not trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    if current_user.role != UserRole.admin and trade.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return trade


@router.patch("/{trade_id}", response_model=TradeOut)
def update_trade(
    trade_id: int,
    payload: TradeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trade = db.query(Trade).filter(Trade.id == trade_id).first()
    if not trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    if current_user.role != UserRole.admin and trade.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(trade, field, value)
    db.commit()
    db.refresh(trade)
    return trade


@router.delete("/{trade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trade(
    trade_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trade = db.query(Trade).filter(Trade.id == trade_id).first()
    if not trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    if current_user.role != UserRole.admin and trade.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    db.delete(trade)
    db.commit()
