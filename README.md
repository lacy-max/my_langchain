
## 技术栈

- **后端框架**: FastAPI 0.104.1
- **大模型**: DeepSeek Chat (deepseek-chat)
- **嵌入模型**: DashScope Embeddings (text-embedding-v4)
- **向量数据库**: Chroma
- **LangChain**: 文档处理与检索问答
- **前端**: Next.js + TailwindCSS

## 核心功能

### 1. 用户认证模块
- 用户登录（JWT 认证）
- 会话管理

### 2. 智能问答模块
- 基于文档的问答（RAG）
- 多轮对话记忆
- 引用来源标注

### 3. 文档管理
- 支持 TXT/PDF/Markdown 文档
- 自动分块与向量化
- 向量数据持久化

## 快速开始

### 环境要求
- Python 3.10+
- Node.js 18+

### 后端启动

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

## API 接口

### 登录接口
```http
POST /api/v1/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

### 聊天接口
```http
POST /api/v1/chat
Content-Type: application/json

{
  "message": "用户问题",
  "session_id": "会话ID"
}
```

## 配置说明

在 `backend/app/config.py` 中配置：
- `DEEPSEEK_API_KEY`: DeepSeek API 密钥
- `DEEPSEEK_BASE_URL`: API 基础地址
- 嵌入模型参数

## 知识库

系统使用 `backend/app/data/faq.txt` 作为初始知识库，包含：
- 退货与售后政策
- 发货与物流信息
- 会员与积分规则
- 支付与发票说明
- 常见问题解答

## 快捷指令

| 指令 | 作用 |
|------|------|
| 退货流程 | 返回退货详细步骤 |
| 运费 | 显示运费规则 |
| 会员折扣 | 展示会员等级与折扣 |
| 发票 | 解释发票开具方式 |
| 转人工 | 创建人工客服工单 |

## 项目特点

1. **RAG 检索增强**: 基于文档内容进行精准回答
2. **多轮对话**: 支持上下文记忆
3. **向量数据库**: Chroma 本地持久化存储
4. **异步处理**: FastAPI 异步接口设计

---

**注意**: 请确保已配置有效的 API 密钥才能正常使用大模型功能。