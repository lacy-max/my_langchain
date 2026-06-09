from fastapi import APIRouter, HTTPException, Query

from app.models.product import (
    ProductCreate,
    ProductDeleteResponse,
    ProductItemResponse,
    ProductListResponse,
    ProductUpdate,
)
from app.services import product_service

router = APIRouter(prefix="/products", tags=["商品"])


@router.get("", response_model=ProductListResponse)
async def list_products(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(10, ge=1, le=100, description="每页条数"),
    keyword: str | None = Query(None, description="搜索关键词（名称/系列/描述）"),
    category: str | None = Query(None, description="商品系列分类"),
):
    data, total = product_service.list_products(
        page=page,
        page_size=page_size,
        keyword=keyword,
        category=category,
    )
    return ProductListResponse(data=data, total=total)


@router.get("/{product_id}", response_model=ProductItemResponse)
async def get_product(product_id: str):
    product = product_service.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="商品不存在")
    return ProductItemResponse(data=product)


@router.post("", response_model=ProductItemResponse)
async def create_product(data: ProductCreate):
    product = product_service.create_product(data)
    return ProductItemResponse(data=product, message="创建成功")


@router.put("/{product_id}", response_model=ProductItemResponse)
async def update_product(product_id: str, data: ProductUpdate):
    product = product_service.update_product(product_id, data)
    if not product:
        raise HTTPException(status_code=404, detail="商品不存在")
    return ProductItemResponse(data=product, message="更新成功")


@router.delete("/{product_id}", response_model=ProductDeleteResponse)
async def delete_product(product_id: str):
    if not product_service.delete_product(product_id):
        raise HTTPException(status_code=404, detail="商品不存在")
    return ProductDeleteResponse(message="删除成功")
