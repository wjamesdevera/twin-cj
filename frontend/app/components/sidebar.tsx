"use client";

import React, { JSX, useState } from "react";
import styles from "./sidebar.module.scss";
import Image from "next/image";
import Link from "next/link";
import { FaHome, FaRegUser } from "react-icons/fa";
import { FaAngleDown, FaAngleUp, FaRegPenToSquare } from "react-icons/fa6";
import { LuCalendarDays } from "react-icons/lu";
import { TbArrowBarToLeft, TbArrowBarToRight } from "react-icons/tb";
import twinCJLogo from "@/public/assets/logo_admin.png";

interface SidebarProps {
  isOpen: boolean;
}

interface NavItemProps {
  href: string;
  icon?: JSX.Element;
  label: string;
  collapsed: boolean;
}

interface NavListProps {
  collapsed: boolean;
}

const NavItem = ({ label, href, icon, collapsed }: NavItemProps) => {
  return (
    <li>
      <Link href={href} className={styles["navitem-container"]}>
        <div className={styles["navitem-wrapper"]}>
          {icon}
          <p className={collapsed ? styles.hidden : ""}>{label}</p>
        </div>
      </Link>
    </li>
  );
};

const NavDropdown = ({ collapsed }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <li
        className={styles["navitem-dropdown-container"]}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles["navitem-dropdown-wrapper"]}>
          <div className={styles["navitem-dropdown-label"]}>
            <FaRegPenToSquare />
            <p className={collapsed ? styles.hidden : "navlabel"}>Content</p>
          </div>
          <div
            className={
              collapsed ? styles.hidden : styles["navitem-dropdown-button"]
            }
          >
            {!isOpen ? <FaAngleDown /> : <FaAngleUp />}
          </div>
        </div>
      </li>
      <div
        className={`${!isOpen ? styles.hidden : ""} ${
          styles["dropdown-items"]
        }`}
      >
        <NavItem
          href="/admin/day-tour-activities"
          label="Day Tour Activities"
          collapsed={false}
        />
        <NavItem href="/admin/cabins" label="Cabins" collapsed={false} />
      </div>
    </>
  );
};

const NavList = ({ collapsed }: NavListProps) => {
  return (
    <ul className={styles["navlist"]}>
      <NavItem
        href="/admin"
        label="Dashboard"
        icon={<FaHome />}
        collapsed={collapsed}
      />
      <NavItem
        href="/admin/bookings"
        label="Booking & Transactions"
        collapsed={collapsed}
        icon={<LuCalendarDays />}
      />
      <NavDropdown collapsed={collapsed} />
      <NavItem
        href="/admin/accounts"
        label="Admin Accounts"
        collapsed={collapsed}
        icon={<FaRegUser />}
      />
    </ul>
  );
};

const Sidebar: React.FC = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  return (
    <div
      className={`${styles["sidebar-container"]} ${
        isSideBarOpen ? styles.open : styles.closed
      }`}
    >
      <aside className={styles["sidebar-wrapper"]}>
        {/* Logo */}
        <div
          className={isSideBarOpen ? styles["logo-container"] : styles.hidden}
        >
          <Image
            src={twinCJLogo}
            alt="Twin CJ Logo"
            className={styles.logo}
            width={175}
            height={75}
          />
        </div>

        {/* Navigation Links */}
        <nav className={styles.nav}>
          <NavList collapsed={!isSideBarOpen} />
        </nav>
      </aside>
      <div className={styles["sidebar-footer"]}>
        <button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
          {isSideBarOpen ? <TbArrowBarToLeft /> : <TbArrowBarToRight />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
