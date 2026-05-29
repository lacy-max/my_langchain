import os
requitements = "requirements.txt"
if not os.path.exists(requitements):
    with open(requitements, "w",encoding="utf-8") as f:
        f.write(
            """
项目简介
构建一个企业级智能客服系统，用户上传文档（PDF、TXT、Markdown），系统自动提取内容，通过 LangChain 进行向量化存储，并提供基于大模型的智能问答接口。前端提供对话界面，后端处理文档解析、向量检索和 LLM 调用。
技术栈建议
前端：React / Vue 3 + TailwindCSS + Axios

后端：FastAPI（Python）+ SQLite/PostgreSQL

LangChain 组件：

文档加载器（PyPDFLoader, TextLoader）

文本分割器（RecursiveCharacterTextSplitter）

嵌入模型（OpenAI Embeddings 或本地模型如 sentence-transformers）

向量数据库（Chroma / FAISS）

检索问答链（RetrievalQA）
核心功能需求
1. 用户认证（基础）
用户注册/登录（JWT）

每个用户拥有独立的文档库和对话历史
2. 文档管理模块
后端 API：

POST /upload：上传文档，后台自动解析 → 分块 → 向量化 → 存入向量库

GET /documents：列出用户已上传的文档

DELETE /documents/{id}：删除文档及其向量数据

前端界面：

拖拽上传区域

文档列表展示（文件名、上传时间、处理状态）
3. 智能问答模块
后端 API：

POST /ask：接收问题，调用 LangChain RetrievalQA 链，返回答案和引用来源（文档名 + 片段）

前端界面：

聊天式对话界面（气泡样式）

显示答案对应的引用来源（可点击跳转到文档原文）

支持多轮对话（带历史记忆功能）

4. 增强功能（可选但加分）
流式输出：SSE 或 WebSocket 实现逐字输出答案

提示词模板：自定义 prompt（如“你是一个 HR 助手，请基于以下内容回答...”）

文档预览：点击文档名可查看原始文本内容

"""
        )