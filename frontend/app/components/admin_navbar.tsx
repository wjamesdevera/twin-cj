"use client";

import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "./admin_navbar.module.scss";
import Link from "next/link";
import LogoutButton from "./logout-button";
import useAuth from "../hooks/useAuth";
import { User } from "../lib/api";

const AdminNavbar: React.FC = () => {
  const { user: userData } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isAdminNameBold, setAdminNameBold] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    setAdminNameBold(!isAdminNameBold);
  };

  const { user }: { user: User } = {
    user: {
      id: "",
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      isVerified: false,
      createdAt: "",
      updatedAt: "",
    },
    ...userData,
  };

  return (
    <nav className={styles.adminNavbar}>
      <div className={styles.container}>
        <Link href="/" target="_blank" className={styles.viewSiteLink}>
          View Site
        </Link>

        <div
          className={`${styles.adminDropdown} ${
            isDropdownOpen ? styles.open : ""
          }`}
        >
          <button
            className={`${styles.adminButton} ${
              isAdminNameBold ? styles.bold : ""
            }`}
            onClick={toggleDropdown}
          >
            {user.firstName !== "" ? user.firstName : "Admin"}
            {isDropdownOpen ? (
              <FaChevronUp className={styles.chevron} />
            ) : (
              <FaChevronDown className={styles.chevron} />
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <ul className={styles.dropdownMenu}>
              <li>
                <Link href="/admin/change-password">Change Password</Link>
              </li>
              <li>
                <LogoutButton className={styles.logoutBtn} />
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
