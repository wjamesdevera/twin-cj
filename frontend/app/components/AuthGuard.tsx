"use client";
import React from "react";
import useAuth from "../hooks/useAuth";
import { Loading } from "./loading";
import { redirect } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  return isLoading ? (
    <>
      <Loading />
    </>
  ) : user ? (
    <>{children}</>
  ) : (
    redirect("/admin/login")
  );
}
