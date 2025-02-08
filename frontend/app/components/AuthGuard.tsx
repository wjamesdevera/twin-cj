"use client";
import React from "react";
import useAuth from "../hooks/useAuth";
import { Loading } from "./loading";
import { useRouter } from "next/navigation";

// const AuthGuard: React.FC = ({ children }: { children: React.ReactNode }) => {
//   const { user, isLoading } = useAuth();
//   const router = useRouter();
//   return isLoading ? (
//     <>
//       <Loading />
//     </>
//   ) : user ? (
//     <>{children}</>
//   ) : (
//     router.push("/admin/login")
//   );
// };
export default function AuthGuard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  return isLoading ? (
    <>
      <Loading />
    </>
  ) : user ? (
    <>{children}</>
  ) : (
    router.push("/admin/login")
  );
}
