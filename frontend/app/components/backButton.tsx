import React from 'react';
import styles from './backButton.module.scss';

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className }: BackButtonProps) {
  return (
    <div className={`${styles.backBtnContainer} ${className}`}>
      <button className={styles.backBtn}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="66"
          height="66"
          viewBox="0 0 66 66"
          fill="none"
        >
          <path
            d="M40.6459 16.0729C41.4513 16.8783 41.4513 18.1842 40.6459 18.9897L27.6668 31.9688L40.6459 44.9477C41.4513 45.7533 41.4513 47.0592 40.6459 47.8649C39.8405 48.6701 38.5346 48.6701 37.7291 47.8649L23.2916 33.4272C22.4861 32.6217 22.4861 31.3158 23.2916 30.5104L37.7291 16.0729C38.5346 15.2674 39.8405 15.2674 40.6459 16.0729Z"
            fill="#D9AD7C"
          />
        </svg>{' '}
        Booking Details
      </button>
    </div>
  );
}
