"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        const error = new Error(data.message || "Login failed");
        setError(error.message);
        throw error;
      }

      localStorage.setItem("token", data.token);
      router.push("/");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && password) {
      handleSubmit(e);
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
              onKeyPress={handleKeyPress}
              className="border-secondary text-base-color focus:border-muted focus:ring-muted mt-1 w-full rounded-md border bg-white p-2 shadow-sm focus:ring-1 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-base-color w-full rounded-md px-4 py-2 text-white transition hover:opacity-90 focus:shadow-2xl focus-visible:ring-4 focus-visible:ring-gray-600 focus-visible:outline-none"
          >
            Sign In
          </button>
        </form>
        {error && (
          <div className="mt-2 rounded-md bg-red-100 p-2 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
