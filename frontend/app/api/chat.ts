import request from "@/app/utils/request";

export type ChatSource = {
  source: string;
  score: string;
  content: string;
};

export type ChatResponseData = {
  reply: string;
  intent: string;
  ticket_id?: string;
  sources?: ChatSource[];
};

export const chatMessage = async (chatRq: {
  message: string;
  session_id: string;
}) => {
  return request.post<{
    success: boolean;
    message: string;
    user_id: string;
    data: ChatResponseData;
  }>("/api/v1/chat", chatRq);
};

export const chat_message = chatMessage;
