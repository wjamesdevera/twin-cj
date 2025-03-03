"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./admin_accounts_table.module.scss";
import useSWR from "swr";
import { deleteUser, getAllUsers } from "../../../lib/api";
import { Loading } from "../../../components/loading";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";

const AdminAccountsTable: React.FC = ({}) => {
  const { data, isLoading } = useSWR("getUsers", getAllUsers);
  const { trigger } = useSWRMutation(
    "delete",
    (key, { arg }: { arg: string }) => deleteUser(arg)
  );
  const router = useRouter();

  const { users } = data?.data || [];

  const handleEdit = (id: string) => {
    router.push(`/admin/accounts/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    trigger(id);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className={styles.table_container}>
      <div className={styles.table_wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users ? (
              users.map(
                (user: {
                  id: string;
                  firstName: string;
                  lastName: string;
                  email: string;
                  phoneNumber: string;
                }) => (
                  <tr key={user.id}>
                    <td data-label="First Name">{user.firstName}</td>
                    <td data-label="Last Name">{user.lastName}</td>
                    <td data-label="Email">{user.email}</td>
                    <td data-label="Phone Number">{user.phoneNumber}</td>
                    <td data-label="Actions" className={styles.actions}>
                      <FaEdit
                        className={`${styles.icon} ${styles.edit_icon}`}
                        onClick={() => handleEdit(user.id)}
                      />
                      <span className={styles.separator}>|</span>
                      <FaTrash
                        onClick={() => handleDelete(user.id)}
                        className={`${styles.icon} ${styles.delete_icon}`}
                      />
                    </td>
                  </tr>
                )
              )
            ) : (
              <p>No Users Found</p>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAccountsTable;
