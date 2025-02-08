"use client";
import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Loading } from "./loading";
import { useRouter } from "next/navigation";

export default function AuthGuard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <Loading />;
  if (!user) return null; // Prevent rendering while redirecting

  return <>{children}</>;
}
