from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import User, Asset, AssetCreate, AssetResponse
from auth import get_current_user

router = APIRouter()

# Simple mock price fetcher
async def get_current_price(symbol: str, asset_type: str):
    return 150.0 if asset_type == "stock" else 45000.0

@router.post("/assets", response_model=AssetResponse)
async def create_asset(
    asset: AssetCreate, 
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if asset exists
    result = await db.execute(
        select(Asset).where(
            Asset.user_id == current_user.id,
            Asset.symbol == asset.symbol
        )
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        total_quantity = existing.quantity + asset.quantity
        if total_quantity > 0:
            # New average price = (old_total_cost + new_total_cost) / total_quantity
            new_avg_price = (
                (existing.quantity * existing.average_price) + 
                (asset.quantity * asset.average_price)
            ) / total_quantity
            existing.average_price = new_avg_price
        
        existing.quantity = total_quantity
        await db.commit()
        await db.refresh(existing)
        return existing

    new_asset = Asset(
        **asset.dict(),
        user_id=current_user.id
    )
    db.add(new_asset)
    await db.commit()
    await db.refresh(new_asset)
    return new_asset

@router.get("/assets", response_model=List[AssetResponse])
async def list_assets(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Asset).where(Asset.user_id == current_user.id))
    assets = result.scalars().all()
    
    response = []
    for asset in assets:
        curr_price = await get_current_price(asset.symbol, asset.type)
        total_val = curr_price * asset.quantity
        cost_basis = asset.average_price * asset.quantity
        gain_loss = total_val - cost_basis
        gain_loss_pct = (gain_loss / cost_basis * 100) if cost_basis > 0 else 0
        
        # Pydantic v2 style or v1 from_orm then copy with updates
        asset_data = AssetResponse.model_validate(asset)
        asset_data.current_price = curr_price
        asset_data.total_value = total_val
        asset_data.gain_loss = gain_loss
        asset_data.gain_loss_percent = gain_loss_pct
        response.append(asset_data)
    
    return response

@router.delete("/assets/{asset_id}")
async def delete_asset(
    asset_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Asset).where(Asset.id == asset_id, Asset.user_id == current_user.id)
    )
    asset = result.scalar_one_or_none()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    await db.delete(asset)
    await db.commit()
    return {"message": "Asset deleted"}
