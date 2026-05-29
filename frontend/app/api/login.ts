import request from "@/app/utils/request";
export const auth_login = async (loginRq: {
  username: string;
  password: string;
}) => {
  return request.post("/api/v1/login", loginRq);
};
