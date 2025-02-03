import AdminNavbar from "@/app/components/adminNavbar";
import "../../globals.scss";
import AuthGuard from "@/app/components/AuthGuard";
import Sidebar from "@/app/components/sidebar";
export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <Sidebar isOpen={true} />
      {children}
    </AuthGuard>
  );
}
