import request from "@/app/utils/request";

const Chat_rq = {
  message: String,
  session_id: String,
};

export const chat_message = async (chatRq: {
  message: string;
  session_id: string;
}) => {
  return request.post("/api/v1/chat", chatRq);
};
