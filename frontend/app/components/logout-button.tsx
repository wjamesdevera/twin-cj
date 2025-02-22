"use client";

import { logout } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";

export default function LogoutButton() {
  const router = useRouter();
  const { trigger } = useSWRMutation("logout", async () => await logout(), {
    revalidate: true,
    onSuccess: () => {
      router.push("/admin/login");
    },
  });
  const handleLogout = async () => {
    await trigger();
  };
  return <button onClick={handleLogout}>Logout</button>;
}
