from typing import Any, List, TypedDict
from langgraph.graph import StateGraph
from langgraph.checkpoint.memory import MemorySaver

from .node import (detect_intent, handle_consult, handle_complaint,
                    handle_after_sales, handle_human, route_by_intent)
class CustomerState(TypedDict):
    messages: List[Any]   # 对话历史
    intent: str
    ticket_id: str

def builder_graph():
    """构建智能客服系统图"""
    builder = StateGraph(CustomerState)
    builder.add_node("internt",detect_intent)
    builder.add_node("consult",handle_consult)
    builder.add_node("complaint", handle_complaint) # 投诉咨询
    builder.add_node("after_sales", handle_after_sales)
    builder.add_node("human", handle_human)
    builder.set_entry_point("internt")
    builder.add_conditional_edges(
        "internt",
       route_by_intent,
       {
        "consult": "consult",
        "complaint": "complaint",
        "after_sales": "after_sales",
        "human": "human",
    })
    builder.add_edge( "consult","__end__")
    builder.add_edge( "complaint","__end__")
    builder.add_edge( "after_sales","__end__")
    builder.add_edge( "human","__end__")
    
    memory = MemorySaver()
    graph = builder.compile(checkpointer=memory)
    return graph
    

   
    