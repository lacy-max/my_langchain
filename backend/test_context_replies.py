import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

from langchain_core.messages import AIMessage, HumanMessage

from app.agent.node import (
    ConversationDecision,
    _answer_with_products,
    _understand_conversation,
)
from app.services import chat_history_service
from app.services import product_service


class ContextReplyTests(unittest.TestCase):
    def test_router_reads_full_role_history(self):
        captured = {}

        class Classifier:
            def invoke(self, prompt):
                captured["prompt"] = prompt
                return ConversationDecision(
                    action="conversation",
                    reply="好的，您可以继续比较。",
                    confidence=0.95,
                )

        class Model:
            def with_structured_output(self, schema):
                self.schema = schema
                return Classifier()

        messages = [
            HumanMessage(content="我想看看适合日常佩戴的商品"),
            AIMessage(content="您偏好简约还是传统风格？"),
            HumanMessage(content="我先自己比较一下"),
        ]
        with patch("app.agent.node.get_chat_model", return_value=Model()):
            decision = _understand_conversation(messages)

        self.assertEqual(decision.action, "conversation")
        self.assertIn("用户：我想看看适合日常佩戴的商品", captured["prompt"])
        self.assertIn("助手：您偏好简约还是传统风格", captured["prompt"])
        self.assertIn("用户：我先自己比较一下", captured["prompt"])

    def test_router_supports_all_generic_capabilities(self):
        routes = [
            ConversationDecision(
                action="conversation",
                reply="好的。",
                confidence=0.9,
            ),
            ConversationDecision(
                action="knowledge",
                query="会员积分如何使用",
                confidence=0.9,
            ),
            ConversationDecision(
                action="products",
                query="预算内的日常佩戴商品",
                confidence=0.9,
            ),
        ]

        for expected in routes:
            with self.subTest(action=expected.action):
                class Classifier:
                    def invoke(self, _prompt):
                        return expected

                class Model:
                    def with_structured_output(self, _schema):
                        return Classifier()

                with patch("app.agent.node.get_chat_model", return_value=Model()):
                    decision = _understand_conversation(
                        [HumanMessage(content="动态用户问题")]
                    )

                self.assertEqual(decision, expected)

    def test_product_advisor_receives_history_and_live_catalog(self):
        captured = {}

        class Response:
            content = "已根据当前需求和商品目录完成筛选。"

        class Chain:
            def invoke(self, values):
                captured.update(values)
                return Response()

        class Prompt:
            def __or__(self, _model):
                return Chain()

        messages = [
            HumanMessage(content="想挑一件商品"),
            AIMessage(content="您有哪些偏好？"),
            HumanMessage(content="预算有限，想要简约款"),
        ]
        with patch("app.agent.node.get_chat_model", return_value=object()), patch(
            "app.agent.node.ChatPromptTemplate.from_messages",
            return_value=Prompt(),
        ):
            reply = _answer_with_products(messages)

        self.assertIn("完成筛选", reply)
        self.assertIn("用户：预算有限，想要简约款", captured["conversation"])
        products, _ = product_service.list_products(page=1, page_size=100)
        self.assertTrue(products)
        for product in products:
            self.assertIn(product.name, captured["catalog"])
            self.assertIn(f"{product.price:.0f}元", captured["catalog"])

    def test_chat_history_is_persisted_in_database(self):
        with TemporaryDirectory() as directory, patch.object(
            chat_history_service,
            "DATABASE_PATH",
            Path(directory) / "chat.sqlite3",
        ):
            chat_history_service.add_message(
                owner_id="member-1",
                session_id="primary",
                role="user",
                content="这是需要持久化的消息",
            )
            chat_history_service.add_message(
                owner_id="member-1",
                session_id="primary",
                role="assistant",
                content="这是数据库中的回复",
                metadata={"intent": "consult"},
            )

            history = chat_history_service.list_messages(
                owner_id="member-1",
                session_id="primary",
            )

        self.assertEqual(len(history), 2)
        self.assertEqual(history[0]["content"], "这是需要持久化的消息")
        self.assertEqual(history[1]["metadata"]["intent"], "consult")


if __name__ == "__main__":
    unittest.main()
