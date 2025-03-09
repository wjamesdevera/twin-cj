import React from "react";
import { ChangePasswordForm } from "./form";
import AuthGuard from "@/app/components/AuthGuard";

export default function Page() {
  return (
    <AuthGuard>
      <ChangePasswordForm />
    </AuthGuard>
  );
}
