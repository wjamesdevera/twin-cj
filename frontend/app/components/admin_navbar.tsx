"use client";

import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "./admin_navbar.module.scss";

const AdminNavbar: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isAdminNameBold, setAdminNameBold] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    setAdminNameBold(!isAdminNameBold);
  };

  return (
    <nav className={styles.adminNavbar}>
      <div className={styles.container}>
        <a href="/" className={styles.viewSiteLink}>
          View Site
        </a>

        <div
          className={`${styles.adminDropdown} ${isDropdownOpen ? styles.open : ""}`}
        >
          <button
            className={`${styles.adminButton} ${isAdminNameBold ? styles.bold : ""}`}
            onClick={toggleDropdown}
          >
            ADMIN NAME
            {isDropdownOpen ? <FaChevronUp className={styles.chevron} /> : <FaChevronDown className={styles.chevron} />}
          </button>

          {/* Dropdown Menu */}
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
    </nav>
  );
};

export default AdminNavbar;
