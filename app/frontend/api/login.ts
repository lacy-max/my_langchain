const login = async (loginRq: { username: string; password: string }) => {
  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify(loginRq),
  });
  const data = await res.json();
  return data;
};
