import CustomButton from "../../../components/custom_button";
// import ConfirmModal from "../../../components/confirm_modal";
// import NotificationModal from "../../../components/notification_modal";
import AdminAccountsTable from "../../../components/admin_accounts_table";
import styles from "./page.module.scss";
import Link from "next/link";

const AdminAccountsPage = () => {
  // const [isClient, setIsClient] = useState(false);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // const [notificationMessage, setNotificationMessage] = useState("");
  // const [notificationType, setNotificationType] = useState<"success" | "error">(
  // "success"
  // );
  // const [selectedId, setSelectedId] = useState<number | null>(null);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen((prev) => !prev);
  // };

  // const handleConfirmDelete = () => {
  //   // if (selectedId !== null) {
  //   //   setAdminAccounts((prev) =>
  //   //     prev.filter((account) => account.id !== selectedId)
  //   //   );
  //   //   setIsModalOpen(false);
  //   //   setTimeout(() => {
  //   //     setNotificationMessage("Admin deleted successfully.");
  //   //     setNotificationType("success");
  //   //     setIsNotificationOpen(true);
  //   //   }, 200);
  //   // }
  // };

  return (
    <div className={styles.page_container}>
      <div className={styles.page_header}>
        <h1 className={styles.title}>Admin Accounts</h1>
      </div>
      <div className={styles.add_user_container}>
        <Link className={styles.primaryLink} href="/admin/accounts/add">
          Add User
        </Link>
      </div>

      <AdminAccountsTable />
    </div>
  );
};

export default AdminAccountsPage;
