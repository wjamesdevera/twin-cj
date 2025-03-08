import AdminSidebar from "@/app/components/admin-sidebar";
import "../../globals.scss";
import AuthGuard from "@/app/components/AuthGuard";
import styles from "./page.module.scss";
export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <main className={styles.main}>
        <AdminSidebar />
        {children}
      </main>
    </AuthGuard>
  );
}
