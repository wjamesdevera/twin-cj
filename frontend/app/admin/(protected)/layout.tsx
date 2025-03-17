import AdminSidebar from "@/app/components/admin-sidebar";
import "../../globals.scss";
import AuthGuard from "@/app/components/AuthGuard";
import styles from "./page.module.scss";
import AdminNavbar from "@/app/components/admin_navbar";
export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <main className={styles.main}>
        <AdminSidebar />
        <section>
          <AdminNavbar />
          {children}
        </section>
      </main>
    </AuthGuard>
  );
}
