"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const token =
    typeof localStorage !== "undefined" ? localStorage?.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    } else {
      router.replace("/dashboard");
    }
  }, [token, router]);

  return null;
}
