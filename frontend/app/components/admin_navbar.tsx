"use client";

import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "./admin_navbar.module.scss";
import Link from "next/link";
import LogoutButton from "./logout-button";
import useAuth from "../hooks/useAuth";

const AdminNavbar: React.FC = () => {
  const { user } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isAdminNameBold, setAdminNameBold] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    setAdminNameBold(!isAdminNameBold);
  };

  return (
    <nav className={styles.adminNavbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.viewSiteLink}>
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
            {user.user.firstName}
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
