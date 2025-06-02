"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect, useState, type ReactNode } from "react";

type AuthProps = {
  children: ReactNode;
};

export default function Auth({ children }: AuthProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (isAuthenticated === null || isAuthenticated === false) {
    return null; // Or return a loading indicator here
  }

  return <>{children}</>;
}
