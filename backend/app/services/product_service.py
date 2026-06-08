from datetime import datetime, timezone
from uuid import uuid4

from app.models.product import Product, ProductCreate, ProductUpdate

PRODUCTS: dict[str, Product] = {}


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _seed_products() -> None:
    """
    种子函数：初始化产品数据
    如果PRODUCTS中已有数据，则直接返回
    否则，使用预定义的种子数据创建产品列表
    """
    if PRODUCTS:
        return

    # 预定义的产品种子数据
    seed_data = [
        {
            "name": "花开富贵吊坠",  # 产品名称
            "price": 12800.0,       # 产品价格
            "image": "/images/products/gold-1.png",  # 产品图片路径
            "category": "黄金系列",  # 产品类别
            "description": "以牡丹为设计元素，寓意花开富贵、吉祥如意。",  # 产品描述
        },
        {
            "name": "如意龙凤镯",
            "price": 28800.0,
            "image": "/images/products/gold-2.png",
            "category": "黄金系列",
            "description": "龙凤呈祥，传统婚庆经典款式。",
        },
        {
            "name": "福禄双全吊坠",
            "price": 9800.0,
            "image": "/images/products/gold-3.png",
            "category": "黄金系列",
            "description": "葫芦造型，寓意福禄双全。",
        },
        {
            "name": "凤凰璎珞耳环",
            "price": 16800.0,
            "image": "/images/products/gold-4.png",
            "category": "黄金系列",
            "description": "凤凰展翅，典雅华贵。",
        },
        {
            "name": "祥云如意戒指",
            "price": 8800.0,
            "image": "/images/products/gold-5.png",
            "category": "黄金系列",
            "description": "祥云纹饰，如意造型。",
        },
        {
            "name": "花丝手链",
            "price": 15800.0,
            "image": "/images/products/gold-6.png",
            "category": "黄金系列",
            "description": "非遗花丝工艺，精致细腻。",
        },
        {
            "name": "传世平安扣",
            "price": 6800.0,
            "image": "/images/products/gold-7.png",
            "category": "黄金系列",
            "description": "经典平安扣，守护平安。",
        },
        {
            "name": "古法传承手镯",
            "price": 36800.0,
            "image": "/images/products/gold-8.png",
            "category": "黄金系列",
            "description": "古法金工艺，传承经典。",
        },
        {
            "name": "璀璨之星钻戒",
            "price": 52800.0,
            "image": "/images/products/diamond-1.png",
            "category": "钻石系列",
            "description": "1克拉主钻，六爪镶嵌。",
        },
        {
            "name": "冰种翡翠手镯",
            "price": 88800.0,
            "image": "/images/products/jade-1.png",
            "category": "翡翠系列",
            "description": "天然A货冰种翡翠，水润通透。",
        },
        {
            "name": "百年好合对戒",
            "price": 19800.0,
            "image": "/images/products/wedding-1.png",
            "category": "婚嫁系列",
            "description": "情侣对戒，见证永恒爱情。",
        },
    ]

    # 获取当前ISO格式时间
    now = _now_iso()
    # 遍历种子数据，创建产品对象
    for item in seed_data:
        # 生成唯一的产品ID
        product_id = str(uuid4())
        # 将产品添加到PRODUCTS字典中
        PRODUCTS[product_id] = Product(
            id=product_id,
            created_at=now,
            updated_at=now,
            **item,
        )


def list_products(
    page: int = 1,
    page_size: int = 10,
    keyword: str | None = None,
) -> tuple[list[Product], int]:
    _seed_products()

    items = list(PRODUCTS.values())
    if keyword:
        keyword_lower = keyword.lower()
        items = [
            p
            for p in items
            if keyword_lower in p.name.lower()
            or keyword_lower in p.category.lower()
            or keyword_lower in p.description.lower()
        ]

    items.sort(key=lambda p: p.created_at, reverse=True)
    total = len(items)
    start = (page - 1) * page_size
    end = start + page_size
    return items[start:end], total


def get_product(product_id: str) -> Product | None:
    _seed_products()
    return PRODUCTS.get(product_id)


def create_product(data: ProductCreate) -> Product:
    _seed_products()
    now = _now_iso()
    product_id = str(uuid4())
    product = Product(
        id=product_id,
        created_at=now,
        updated_at=now,
        **data.model_dump(),
    )
    PRODUCTS[product_id] = product
    return product


def update_product(product_id: str, data: ProductUpdate) -> Product | None:
    _seed_products()
    product = PRODUCTS.get(product_id)
    if not product:
        return None

    updates = data.model_dump(exclude_unset=True)
    updated = product.model_copy(update={**updates, "updated_at": _now_iso()})
    PRODUCTS[product_id] = updated
    return updated


def delete_product(product_id: str) -> bool:
    _seed_products()
    if product_id not in PRODUCTS:
        return False
    del PRODUCTS[product_id]
    return True
