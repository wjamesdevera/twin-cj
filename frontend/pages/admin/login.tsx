import React from 'react';
import Image from 'next/image';
import styles from '../admin/login.module.scss';

export default function Login() {
  return (
    <div className={styles.container}>
      <div className={styles['left-container']}>
      <Image src='/assets/login-left-bg.png' alt='logo' layout='fill' objectFit='cover' className='left-bg' />
      </div>
      <div className={styles['right-container']}>
        <div className={styles.title}>
          <h1>twin cj</h1>
        </div>
        <div className={styles["subtitle"]}>
          <h2>RIVERSIDE RESORT</h2>
        </div>
        <div>
          <p className={styles["text"]}>Welcome! Please log-in with your admin account.</p>
        </div>
        <div className={styles.form}>
          <form className={styles["login-form"]}>
            <input type="text" placeholder="Email Address" />
            <input type="password" placeholder="Password" />
            <a href="#">Forgot Password?</a>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}