import json
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4


DATABASE_PATH = Path(
    os.getenv(
        "CHAT_DATABASE_PATH",
        str(Path(__file__).resolve().parents[2] / "data" / "chat_history.sqlite3"),
    )
)


def initialize_database() -> None:
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with _connect() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS chat_messages (
                id TEXT PRIMARY KEY,
                owner_id TEXT NOT NULL,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
                content TEXT NOT NULL,
                metadata TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_chat_messages_owner_session
            ON chat_messages (owner_id, session_id, created_at)
            """
        )


def list_messages(owner_id: str, session_id: str) -> list[dict[str, Any]]:
    initialize_database()
    with _connect() as connection:
        rows = connection.execute(
            """
            SELECT id, role, content, metadata, created_at
            FROM chat_messages
            WHERE owner_id = ? AND session_id = ?
            ORDER BY created_at ASC, rowid ASC
            """,
            (owner_id, session_id),
        ).fetchall()

    return [
        {
            "id": row["id"],
            "role": row["role"],
            "content": row["content"],
            "metadata": json.loads(row["metadata"] or "{}"),
            "created_at": row["created_at"],
        }
        for row in rows
    ]


def add_message(
    owner_id: str,
    session_id: str,
    role: str,
    content: str,
    metadata: dict[str, Any] | None = None,
) -> dict[str, Any]:
    initialize_database()
    message = {
        "id": str(uuid4()),
        "role": role,
        "content": content,
        "metadata": metadata or {},
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    with _connect() as connection:
        connection.execute(
            """
            INSERT INTO chat_messages (
                id, owner_id, session_id, role, content, metadata, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                message["id"],
                owner_id,
                session_id,
                role,
                content,
                json.dumps(message["metadata"], ensure_ascii=False),
                message["created_at"],
            ),
        )
    return message


def _connect() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection
