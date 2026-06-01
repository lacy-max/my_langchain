import os
import sys
sys.path.append(os.path.dirname(__file__))
from app.core.rag import get_rag


def test_rag():
    rag = get_rag()
    if rag is None:
        raise ValueError("RAG 系统未初始化")
    else:
        results = rag.invoke("退货政策是什么？")
        print(results)
if __name__ == "__main__":
    test_rag()
