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
  const { user, isLoading } = useAuth({
    onError: () => {
      console.log(user);
    },
  });
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.replace("/admin/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) return <Loading />;

  return user ? <>{children}</> : null;
}
