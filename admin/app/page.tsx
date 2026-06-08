"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    router.replace(userId ? "/container/products" : "/container/login");
  }, [router]);

  return null;
}
