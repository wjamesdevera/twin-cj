import "../../globals.scss";
import styles from "./login.module.scss";
export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={styles.body}>{children}</div>;
}
