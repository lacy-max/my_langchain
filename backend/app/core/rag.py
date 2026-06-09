import math
import os
import re
from collections import Counter
from dataclasses import dataclass
from typing import List

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter


DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
FAQ_PATH = os.path.abspath(os.path.join(DATA_DIR, "faq.txt"))


@dataclass
class RetrievedDoc:
    content: str
    source: str
    score: float


class LocalKnowledgeRetriever:
    def __init__(self, path: str = FAQ_PATH):
        self.path = path
        self.documents = self._load_documents(path)
        self._doc_terms = [self._tokenize(doc.page_content) for doc in self.documents]

    def invoke(self, query: str) -> List[Document]:
        matches = self.search(query)
        return [
            Document(
                page_content=item.content,
                metadata={"source": item.source, "score": item.score},
            )
            for item in matches
        ]

    def search(self, query: str, k: int = 3) -> List[RetrievedDoc]:
        query_terms = self._tokenize(query)
        if not query_terms:
            return []

        scored = []
        query_counter = Counter(query_terms)
        for doc, terms in zip(self.documents, self._doc_terms):
            score = self._score(query_counter, Counter(terms))
            if score > 0:
                scored.append((score, doc))

        scored.sort(key=lambda item: item[0], reverse=True)
        return [
            RetrievedDoc(
                content=doc.page_content,
                source=doc.metadata.get("source", "faq.txt"),
                score=round(score, 4),
            )
            for score, doc in scored[:k]
        ]

    def _load_documents(self, path: str) -> List[Document]:
        if not os.path.exists(path):
            return []

        with open(path, "r", encoding="utf-8") as file:
            text = file.read()

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=420,
            chunk_overlap=70,
            separators=["\n# ", "\n\n", "\n", "。", "；", "，", " "],
        )
        return splitter.create_documents(
            [text],
            metadatas=[{"source": os.path.basename(path)}],
        )

    def _tokenize(self, text: str) -> List[str]:
        lower_text = text.lower()
        english = re.findall(r"[a-z0-9]+", lower_text)
        chinese = re.findall(r"[\u4e00-\u9fff]", lower_text)
        phrases = re.findall(r"[\u4e00-\u9fff]{2,}", lower_text)
        phrase_windows = []
        for phrase in phrases:
            phrase_windows.extend(phrase[i : i + 2] for i in range(len(phrase) - 1))
            phrase_windows.extend(phrase[i : i + 3] for i in range(len(phrase) - 2))
        return english + chinese + phrase_windows

    def _score(self, query_counter: Counter, doc_counter: Counter) -> float:
        overlap = set(query_counter) & set(doc_counter)
        if not overlap:
            return 0.0

        numerator = sum(query_counter[term] * doc_counter[term] for term in overlap)
        query_norm = math.sqrt(sum(value * value for value in query_counter.values()))
        doc_norm = math.sqrt(sum(value * value for value in doc_counter.values()))
        if query_norm == 0 or doc_norm == 0:
            return 0.0
        return numerator / (query_norm * doc_norm)


retriever = None


def get_rag() -> LocalKnowledgeRetriever:
    global retriever
    if retriever is None:
        retriever = LocalKnowledgeRetriever()
    return retriever

