from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import embeddings
from langchain_community.vectorstores import Chroma
import os
# 离线文档目录
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
CHROMA_DIR = os.path.join(os.path.dirname(__file__), "..", "chroma_db")

retriever = None
def init_rag():
     """初始化 RAG 系统：加载文档、分块、向量化、持久化"""
     global retriever
     doc_path = os.path.join(DATA_DIR, "faq.txt")
     if not os.path.exists(doc_path):
        raise FileNotFoundError(f"文档文件 {doc_path} 不存在")
     if not os.path.exists(CHROMA_DIR):
     # 加载文档
        loader = TextLoader(doc_path, encoding="utf-8")
        doc = loader.load()
        # 分块
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
         )
        chunks = text_splitter.split_documents(doc)
        # 向量化
        vectorstore = Chroma.from_documents(
            chunks,
            embedding=embeddings,
            persist_directory="./chroma_db"
        )
     else: 
        vectorstore = Chroma(
            persist_directory="./chroma_db", 
            embedding=embeddings
            )
     return vectorstore.as_retriever(search_kwargs={"k": 1})

def get_rag():
   global retriever
   if retriever is None:
      retriever = init_rag()
   return retriever

