from datetime import datetime

from pydantic import BaseModel, Field


class Product(BaseModel):

    """
    商品模型类，用于存储商品相关信息
    
    继承自BaseModel，提供了商品的基本属性和方法
    """
    id: str        # 商品名称     # 商品价格，浮点数类型          # 商品ID，唯一标识符
    name: str
    price: float
    image: str = ""
    category: str
    description: str = ""
    created_at: str
    updated_at: str


class ProductCreate(BaseModel):

    # 产品创建模型，用于验证产品创建时的数据格式
    name: str  # 产品名称，必需字符串类型
    price: float = Field(gt=0)  # 产品价格，必需为大于0的浮点数
    image: str = ""  # 产品图片URL，可选字符串类型，默认为空字符串
    category: str  # 产品分类，必需字符串类型
    description: str = ""  # 产品描述，可选字符串类型，默认为空字符串


class ProductUpdate(BaseModel):

    """
    产品更新数据模型类，用于定义可以更新的产品字段及其约束条件。
    继承自BaseModel，表明这是一个数据模型类。
    所有字段都设置为可选（允许为None），因为这是用于更新操作，可能只更新部分字段。
    """
    name: str | None = None  # 产品名称，可选字符串类型，默认值为None
    price: float | None = Field(default=None, gt=0)
    image: str | None = None
    category: str | None = None
    description: str | None = None


class ProductListResponse(BaseModel):

    """
    产品列表响应模型类
    用于定义获取产品列表接口的返回数据结构
    """
    success: bool = True  # 请求是否成功，默认为True
    data: list[Product]  # 产品列表数据，包含Product对象的列表
    total: int  # 产品总数


class ProductItemResponse(BaseModel):

    # 定义商品项目响应模型，继承自BaseModel
    success: bool = True  # 响应状态，默认为True表示成功
    data: Product  # 商品数据，类型为Product
    message: str | None = None  # 响应消息，可选字符串类型，默认为None


# 定义一个产品删除响应的模型类
class ProductDeleteResponse(BaseModel):
    # 定义success字段，表示删除操作是否成功，默认值为True
    success: bool = True
    # 定义message字段，用于存储响应消息，类型为字符串
    message: str
