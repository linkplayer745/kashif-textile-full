"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // 🚀 Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard"); // or wherever you want
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="border-secondary w-full max-w-md rounded-2xl border p-6 shadow-md">
        <h2 className="text-base-color mb-6 text-center text-2xl font-bold">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="text-base-color block text-sm font-medium"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-secondary text-base-color focus:border-muted focus:ring-muted mt-1 w-full rounded-md border bg-white p-2 shadow-sm focus:ring-1 focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-base-color block text-sm font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-secondary text-base-color focus:border-muted focus:ring-muted mt-1 w-full rounded-md border bg-white p-2 shadow-sm focus:ring-1 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-base-color w-full rounded-md px-4 py-2 text-white transition hover:opacity-90"
          >
            Sign In
          </button>
        </form>
        {errorMessage && (
          <div className="mt-2 rounded-md bg-red-100 p-2 text-sm text-red-600">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
