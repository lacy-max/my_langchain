from pydantic import BaseModel


class Store(BaseModel):
    id: str
    city: str
    name: str
    address: str
    phone: str
    hours: str
    level: str
    services: list[str] = []
    distance: str = ""
    created_at: str
    updated_at: str


class StoreCreate(BaseModel):
    city: str
    name: str
    address: str
    phone: str
    hours: str
    level: str
    services: list[str] = []
    distance: str = ""


class StoreUpdate(BaseModel):
    city: str | None = None
    name: str | None = None
    address: str | None = None
    phone: str | None = None
    hours: str | None = None
    level: str | None = None
    services: list[str] | None = None
    distance: str | None = None


class StoreListResponse(BaseModel):
    success: bool = True
    data: list[Store]
    total: int


class StoreItemResponse(BaseModel):
    success: bool = True
    data: Store
    message: str | None = None


class StoreDeleteResponse(BaseModel):
    success: bool = True
    message: str
