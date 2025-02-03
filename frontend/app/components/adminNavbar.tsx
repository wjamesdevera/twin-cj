"use client";

import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "./adminNavbar.module.scss";

interface AdminNavbarProps {
  toggleSidebar?: () => void;
  isSidebarOpen: boolean;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({
  toggleSidebar,
  isSidebarOpen,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isAdminNameBold, setAdminNameBold] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    setAdminNameBold(!isAdminNameBold);
  };

  return (
    <nav
      className={`${styles.navbar} ${
        isSidebarOpen ? styles.withSidebar : styles.fullWidth
      }`}
    >
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <GiHamburgerMenu
            className={styles.hamburger}
            onClick={toggleSidebar}
          />
        </div>

        <div className={styles.rightSection}>
          <a href="/" className={styles.viewSiteLink}>
            View Site
          </a>
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
              ADMIN NAME
              <i
                className={`fas ${
                  isDropdownOpen ? "fa-chevron-up" : "fa-chevron-down"
                } ${styles.chevron}`}
              ></i>
            </button>

            {isDropdownOpen && (
              <ul className={styles.dropdownMenu}>
                <li>
                  <a href="/change-password">Change Password</a>
                </li>
                <li>
                  <a href="/logout">Logout</a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
