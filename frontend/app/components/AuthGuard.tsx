"use client";
import React from "react";
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

  if (isLoading) {
    return <Loading />;
  } else if (!user) {
    router.push("/admin/login");
    return null;
  }

  return <>{children}</>;
}
