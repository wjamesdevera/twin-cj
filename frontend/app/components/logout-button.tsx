"use client";

import { logout } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

export default function LogoutButton() {
  const router = useRouter();
  const { trigger } = useSWRMutation("logout", async () => await logout(), {
    revalidate: true,
    onSuccess: () => {
      mutate("auth", null, false);
      router.replace("/admin/login");
      window.location.reload();
    },
  });
  const handleLogout = async () => {
    await trigger();
  };
  return <button onClick={handleLogout}>Logout</button>;
}
