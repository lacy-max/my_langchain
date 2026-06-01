import uuid
def Create_ticket(type,desc):
    """创建工单。当用户投诉或需要售后服务时调用。
        
        Args:
            type: 问题类型，如：退货、换货、投诉、咨询
            desc: 问题描述
        """
    if type not in ["退货", "换货", "投诉", "咨询"]:
        raise ValueError("工单类型必须是退货、换货、投诉或咨询")
    if type == "":
        raise ValueError("工单类型不能为空")
    if desc == "":
        raise ValueError("工单描述不能为空")
    ticket_id = f"TKT-{uuid.uuid4().hex[:8].upper()}"
    return f"已为您创建工单 {ticket_id}，客服将在24小时内处理。工单号：{ticket_id}"
