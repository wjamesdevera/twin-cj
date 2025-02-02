"use client";

import { logout } from "@/app/lib/api";
import { redirect } from "next/navigation";
import useSWRMutation from "swr/mutation";

export default function LogoutButton() {
  const { trigger } = useSWRMutation("logout", async () => await logout(), {
    revalidate: true,
    onSuccess: () => {
      redirect("/admin/login");
    },
  });
  const handleLogout = async () => {
    await trigger();
  };
  return <button onClick={handleLogout}>Logout</button>;
}
