"use client";

import { logout } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes } from "react";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

export default function LogoutButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation(
    "logout",
    async () => await logout(),
    {
      revalidate: true,
      onSuccess: () => {
        mutate("auth", null, false);
        router.replace("/admin/login");
        window.location.reload();
      },
    }
  );
  const handleLogout = async () => {
    await trigger();
  };
  return (
    <button
      onClick={handleLogout}
      className={className}
      {...props}
      disabled={isMutating}
    >
      Logout
    </button>
  );
}
