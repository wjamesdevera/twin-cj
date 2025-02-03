import "../../globals.scss";
import AuthGuard from "@/app/components/AuthGuard";
export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthGuard>{children}</AuthGuard>;
}
