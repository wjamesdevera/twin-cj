"use client";

import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./admin_accounts_table.module.scss";
import useSWR, { mutate } from "swr"; 
import { deleteUser, getAllUsers } from "../../../lib/api";
import { Loading } from "../../../components/loading";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import ConfirmModal from "../../../components/confirm_modal";

interface AdminAccountsTableProps {
  showNotification: (message: string, type: "success" | "error") => void;
}

const AdminAccountsTable: React.FC<AdminAccountsTableProps> = ({ showNotification }) => {
  const { data, isLoading } = useSWR("getUsers", getAllUsers);
  const { trigger } = useSWRMutation(
    "delete",
    (key, { arg }: { arg: string }) => deleteUser(arg)
  );
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { users } = data?.data || [];

  const handleEdit = (id: string) => {
    router.push(`/admin/accounts/edit/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUserId) {
      try {
        await trigger(selectedUserId);

        mutate("getUsers", async (currentData: any) => {
          if (!currentData) return;
          return {
            ...currentData,
            data: {
              users: currentData.data.users.filter(
                (user: any) => user.id !== selectedUserId
              ),
            },
          };
        }, false);

        showNotification("Admin Account deleted successfully!", "success");
      } catch (error) {
        showNotification("Failed to delete Admin Account.", "error");
      }
    }

    setIsModalOpen(false);
    setSelectedUserId(null);
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
                        onClick={() => handleDeleteClick(user.id)}
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

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Are you sure you want to delete this Admin Account?"
        confirmText="Delete"
        confirmColor="#A80000" 
        cancelText="Cancel"
        cancelColor="#CCCCCC" 
      />
    </div>
  );
};

export default AdminAccountsTable;
