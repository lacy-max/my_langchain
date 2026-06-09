from datetime import datetime, timezone
from uuid import uuid4

from app.models.store import Store, StoreCreate, StoreUpdate

STORES: dict[str, Store] = {}


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _seed_stores() -> None:
    if STORES:
        return

    seed_data = [
        {
            "city": "沈阳",
            "name": "萃华珠宝 中街旗舰店",
            "address": "沈阳市沈河区中街路 128 号恒隆广场 1F",
            "phone": "024-2488 6888",
            "hours": "10:00 - 22:00",
            "level": "旗舰店",
            "services": ["婚嫁定制", "黄金换新", "珠宝保养", "贵宾预约"],
            "distance": "距您约 2.4km",
        },
        {
            "city": "沈阳",
            "name": "萃华珠宝 太原街精品店",
            "address": "沈阳市和平区太原北街 88 号万达广场 1F",
            "phone": "024-2356 1999",
            "hours": "10:00 - 21:30",
            "level": "精品店",
            "services": ["黄金换新", "珠宝保养", "会员礼遇"],
            "distance": "距您约 4.8km",
        },
        {
            "city": "北京",
            "name": "萃华珠宝 王府井专柜",
            "address": "北京市东城区王府井大街 255 号百货大楼 2F",
            "phone": "010-6528 7789",
            "hours": "10:00 - 22:00",
            "level": "专柜",
            "services": ["婚嫁顾问", "珠宝保养", "礼品包装"],
            "distance": "热门商圈",
        },
        {
            "city": "上海",
            "name": "萃华珠宝 南京西路精品店",
            "address": "上海市静安区南京西路 1618 号久光百货 1F",
            "phone": "021-6288 5678",
            "hours": "10:00 - 22:00",
            "level": "精品店",
            "services": ["钻石甄选", "珠宝保养", "贵宾预约"],
            "distance": "热门商圈",
        },
        {
            "city": "深圳",
            "name": "萃华珠宝 万象城旗舰店",
            "address": "深圳市罗湖区宝安南路 1881 号万象城 L1",
            "phone": "0755-8266 8899",
            "hours": "10:00 - 22:30",
            "level": "旗舰店",
            "services": ["高定珠宝", "婚嫁定制", "珠宝保养", "贵宾预约"],
            "distance": "热门商圈",
        },
        {
            "city": "成都",
            "name": "萃华珠宝 太古里精品店",
            "address": "成都市锦江区中纱帽街 8 号远洋太古里 M 层",
            "phone": "028-8666 3288",
            "hours": "10:00 - 22:00",
            "level": "精品店",
            "services": ["黄金换新", "钻石甄选", "会员礼遇"],
            "distance": "热门商圈",
        },
    ]

    now = _now_iso()
    for item in seed_data:
        store_id = str(uuid4())
        STORES[store_id] = Store(
            id=store_id,
            created_at=now,
            updated_at=now,
            **item,
        )


def list_stores(
    page: int = 1,
    page_size: int = 10,
    keyword: str | None = None,
    city: str | None = None,
) -> tuple[list[Store], int]:
    _seed_stores()

    items = list(STORES.values())
    if city:
        items = [store for store in items if store.city == city]
    if keyword:
        keyword_lower = keyword.lower()
        items = [
            store
            for store in items
            if keyword_lower in store.name.lower()
            or keyword_lower in store.city.lower()
            or keyword_lower in store.address.lower()
            or keyword_lower in store.level.lower()
            or any(keyword_lower in service.lower() for service in store.services)
        ]

    items.sort(key=lambda store: store.created_at, reverse=True)
    total = len(items)
    start = (page - 1) * page_size
    end = start + page_size
    return items[start:end], total


def get_store(store_id: str) -> Store | None:
    _seed_stores()
    return STORES.get(store_id)


def create_store(data: StoreCreate) -> Store:
    _seed_stores()
    now = _now_iso()
    store_id = str(uuid4())
    store = Store(
        id=store_id,
        created_at=now,
        updated_at=now,
        **data.model_dump(),
    )
    STORES[store_id] = store
    return store


def update_store(store_id: str, data: StoreUpdate) -> Store | None:
    _seed_stores()
    store = STORES.get(store_id)
    if not store:
        return None

    updates = data.model_dump(exclude_unset=True)
    updated = store.model_copy(update={**updates, "updated_at": _now_iso()})
    STORES[store_id] = updated
    return updated


def delete_store(store_id: str) -> bool:
    _seed_stores()
    if store_id not in STORES:
        return False
    del STORES[store_id]
    return True
