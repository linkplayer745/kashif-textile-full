"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLayoutEffect, useState } from "react";
import router from "next/router";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/slices/userSlice";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const user = useAppSelector((state) => state.user.currentUser);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  useLayoutEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, []);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (form: LoginFormData) => {
    const { email, password } = form;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      dispatch(setUser(data.user));
      localStorage.setItem("token", data.token);
      router.push("/");
    } catch (error: any) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="space-y-6 p-6">
        <h2 className="text-2xl font-bold">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
          {/* <div className="text-muted-foreground text-right text-sm">
            <a href="#" className="hover:underline">
              Forgot your password?
            </a>
          </div> */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </CardContent>
    </Card>
  );
}
