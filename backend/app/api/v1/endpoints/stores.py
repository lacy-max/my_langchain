from fastapi import APIRouter, HTTPException, Query

from app.models.store import (
    StoreCreate,
    StoreDeleteResponse,
    StoreItemResponse,
    StoreListResponse,
    StoreUpdate,
)
from app.services import store_service

router = APIRouter(prefix="/stores", tags=["门店"])


@router.get("", response_model=StoreListResponse)
async def list_stores(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(10, ge=1, le=100, description="每页条数"),
    keyword: str | None = Query(None, description="搜索关键词（城市/名称/地址/服务）"),
    city: str | None = Query(None, description="城市"),
):
    data, total = store_service.list_stores(
        page=page,
        page_size=page_size,
        keyword=keyword,
        city=city,
    )
    return StoreListResponse(data=data, total=total)


@router.get("/{store_id}", response_model=StoreItemResponse)
async def get_store(store_id: str):
    store = store_service.get_store(store_id)
    if not store:
        raise HTTPException(status_code=404, detail="门店不存在")
    return StoreItemResponse(data=store)


@router.post("", response_model=StoreItemResponse)
async def create_store(data: StoreCreate):
    store = store_service.create_store(data)
    return StoreItemResponse(data=store, message="创建成功")


@router.put("/{store_id}", response_model=StoreItemResponse)
async def update_store(store_id: str, data: StoreUpdate):
    store = store_service.update_store(store_id, data)
    if not store:
        raise HTTPException(status_code=404, detail="门店不存在")
    return StoreItemResponse(data=store, message="更新成功")


@router.delete("/{store_id}", response_model=StoreDeleteResponse)
async def delete_store(store_id: str):
    if not store_service.delete_store(store_id):
        raise HTTPException(status_code=404, detail="门店不存在")
    return StoreDeleteResponse(message="删除成功")
