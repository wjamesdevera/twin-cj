"use client";

import React, { useState } from "react";
import styles from "./navbar.module.scss";
import Link from "next/link";
import Image from "next/image";
import { navlist } from "@/app/constants/navlist";
import twinCJLogo from "@/public/assets/twincj-logo.png";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface NavLinkProps {
  label: string;
  href: string;
  isActive?: boolean;
}

const NavLink = ({ label, href, isActive }: NavLinkProps) => {
  return (
    <li className={styles["nav-item"]}>
      <Link
        href={href}
        className={`${isActive ? styles["nav-link-active"] : ""} ${
          styles["nav-link"]
        }`}
      >
        {label}
      </Link>
    </li>
  );
};

const NavLinks = () => {
  const pathname = usePathname();

  return (
    <ul className={styles.navlist}>
      {navlist.map((navlink) => {
        return (
          <NavLink
            isActive={navlink.href == pathname}
            label={navlink.label}
            href={navlink.href}
            key={navlink.label}
          />
        );
      })}
    </ul>
  );
};

export default function Navbar() {
  const router = useRouter();
  const [isNavActive, setIsNavActive] = useState(false);

  const toggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  return (
    <div id="navbar" className={`${styles["navbar-container"]}`}>
      <div className={`${styles["navbar-wrapper"]} container`}>
        <div className={styles.logo}>
          <Image src={twinCJLogo} alt="Twin CJ Logo" />
        </div>
        {/* Hamburger Menu */}
        <div
          className={`${styles.hamburger} ${
            isNavActive ? styles.hamburgerActive : ""
          }`}
          onClick={toggleNav}
        >
          <span className={styles.line}></span>
          <span className={styles.line}></span>
          <span className={styles.line}></span>
        </div>
        {/* Menubar for Mobile */}
        <div
          className={`${styles.menubar} ${isNavActive ? styles.active : ""}`}
        >
          <div className={`${styles["menubar-wrapper"]} container`}>
            <NavLinks />
          </div>
        </div>
        {/* Navigation Links */}
        <div
          className={`${styles["navlist-wrapper"]} ${
            isNavActive ? styles.hidden : ""
          }`}
        >
          <NavLinks />
        </div>
        {/* Reservation Button */}
        <div
          className={`${styles.reservation} ${
            isNavActive ? styles.hidden : ""
          }`}
        >
          <button
            className={styles.reserveBtn}
            onClick={() => router.push("/booking")}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
