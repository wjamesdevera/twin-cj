import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./admin_accounts_table.module.scss";

interface Admin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AdminAccountsTableProps {
  adminAccounts: Admin[];
  onDeleteClick: (id: number) => void;
  onEditClick: (id: number) => void;
}

const AdminAccountsTable: React.FC<AdminAccountsTableProps> = ({
  adminAccounts,
  onDeleteClick,
  onEditClick,
}) => {
  return (
    <div className={styles.table_container}>

      <div className={styles.table_wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminAccounts.map((admin) => (
              <tr key={admin.id}>
                <td data-label="ID">{admin.id}</td>
                <td data-label="First Name">{admin.firstName}</td>
                <td data-label="Last Name">{admin.lastName}</td>
                <td data-label="Email">{admin.email}</td>
                <td data-label="Phone Number">{admin.phone}</td>
                <td data-label="Actions" className={styles.actions}>
                  <FaEdit
                    className={`${styles.icon} ${styles.edit_icon}`}
                    onClick={() => onEditClick(admin.id)}
                  />
                  <span className={styles.separator}>|</span>
                  <FaTrash
                    className={`${styles.icon} ${styles.delete_icon}`}
                    onClick={() => onDeleteClick(admin.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAccountsTable;
