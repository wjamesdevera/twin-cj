import "../../globals.scss";
import styles from "./login/login.module.scss";
export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className={styles.body}>{children}</section>;
}
