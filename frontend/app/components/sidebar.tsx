"use client";

import React, { useState } from "react";
import styles from "./sidebar.module.scss";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkedAlt, FaHome } from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [isContentDropdownOpen, setContentDropdownOpen] = useState(false);

  const toggleContentDropdown = () => {
    setContentDropdownOpen(!isContentDropdownOpen);
  };

  return (
    <div
      className={`${styles.sidebarContainer} ${
        isOpen ? styles.open : styles.closed
      }`}
    >
      <aside className={styles.sidebar}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <Image
            src="/assets/logo_admin2.png"
            alt="Admin Logo 2"
            width={75}
            height={75}
            className={styles.logo}
            quality={100}
          />
          <Image
            src="/assets/logo_admin.png"
            alt="Admin Logo"
            width={75}
            height={75}
            className={styles.logo}
          />
        </div>

        {/* Navigation Links */}
        <nav className={styles.nav}>
          <ul>
            <li className={styles.navItem}>
              <Link href="/dashboard" className={styles.link}>
                <i className="fas fa-tachometer-alt"></i>
                Dashboard
              </Link>
            </li>

            <li className={styles.navItem}>
              <Link href="/booking-transactions" className={styles.link}>
                <i className="fas fa-calendar-alt"></i>
                Booking & Transactions
              </Link>
            </li>

            <li className={`${styles.navItem} ${styles.dropdown}`}>
              <button
                className={styles.link}
                onClick={toggleContentDropdown}
                aria-expanded={isContentDropdownOpen}
              >
                <div className={styles.linkText}>
                  <i className="fas fa-edit"></i>
                  Content
                </div>
                <i
                  className={`fas ${
                    isContentDropdownOpen ? "fa-chevron-up" : "fa-chevron-down"
                  } chevron`}
                ></i>
              </button>

              {isContentDropdownOpen && (
                <ul className={styles.dropdownMenu}>
                  <li>
                    <Link href="/content/day-tour" className={styles.dropdownLink}>
                      <FaMapMarkedAlt />
                      Day Tour Activities
                    </Link>
                  </li>
                  <li>
                    <Link href="/content/cabins" className={styles.dropdownLink}>
                      <FaHome />
                      Cabins
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className={styles.navItem}>
              <Link href="/admin-accounts" className={styles.link}>
                <i className="fas fa-user"></i>
                Admin Accounts
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
