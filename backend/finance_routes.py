from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import (
    User,
    Transaction,
    TransactionCreate, 
    TransactionResponse, 
    Budget,
    BudgetCreate, 
    BudgetResponse,
    Goal,
    GoalCreate,
    GoalResponse
)
from auth import get_current_user

router = APIRouter()

# Transactions
@router.post("/transactions", response_model=TransactionResponse)
async def create_transaction(
    transaction: TransactionCreate, 
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # If date is None, don't pass it to SQLAlchemy model so it uses its default
    tx_data = transaction.dict(exclude_unset=True)
    new_transaction = Transaction(
        **tx_data,
        user_id=current_user.id
    )
    db.add(new_transaction)
    await db.commit()
    await db.refresh(new_transaction)
    return new_transaction

@router.get("/transactions", response_model=List[TransactionResponse])
async def list_transactions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Transaction).where(Transaction.user_id == current_user.id))
    transactions = result.scalars().all()
    return transactions

@router.delete("/transactions/{transaction_id}")
async def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Transaction).where(Transaction.id == transaction_id, Transaction.user_id == current_user.id)
    )
    transaction = result.scalar_one_or_none()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    await db.delete(transaction)
    await db.commit()
    return {"message": "Transaction deleted"}

# Budgets
@router.post("/budgets", response_model=BudgetResponse)
async def create_budget(
    budget: BudgetCreate, 
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if budget for this category already exists
    result = await db.execute(
        select(Budget).where(
            Budget.user_id == current_user.id,
            Budget.category == budget.category
        )
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        existing.limit = budget.limit
        await db.commit()
        await db.refresh(existing)
        return existing

    new_budget = Budget(
        **budget.dict(),
        user_id=current_user.id
    )
    db.add(new_budget)
    await db.commit()
    await db.refresh(new_budget)
    return new_budget

@router.get("/budgets", response_model=List[BudgetResponse])
async def list_budgets(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Budget).where(Budget.user_id == current_user.id))
    budgets = result.scalars().all()
    return budgets

@router.delete("/budgets/{budget_id}")
async def delete_budget(
    budget_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Budget).where(Budget.id == budget_id, Budget.user_id == current_user.id)
    )
    budget = result.scalar_one_or_none()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    await db.delete(budget)
    await db.commit()
    return {"message": "Budget deleted"}

# Goals
@router.post("/goals", response_model=GoalResponse)
async def create_goal(
    goal: GoalCreate, 
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_goal = Goal(
        **goal.dict(),
        user_id=current_user.id
    )
    db.add(new_goal)
    await db.commit()
    await db.refresh(new_goal)
    return new_goal

@router.get("/goals", response_model=List[GoalResponse])
async def list_goals(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Goal).where(Goal.user_id == current_user.id))
    goals = result.scalars().all()
    return goals

@router.delete("/goals/{goal_id}")
async def delete_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Goal).where(Goal.id == goal_id, Goal.user_id == current_user.id)
    )
    goal = result.scalar_one_or_none()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    await db.delete(goal)
    await db.commit()
    return {"message": "Goal deleted"}
