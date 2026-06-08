from langchain_community.embeddings import DashScopeEmbeddings
from  langchain_openai import ChatOpenAI
DEEPSEEK_API_KEY = "sk-db1bf7ed39664270970518d8e1298cfe"
DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1"
model = ChatOpenAI(
    model = "deepseek-chat",
    temperature=0.3,
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL
)
embeddings = DashScopeEmbeddings( model="text-embedding-v4")