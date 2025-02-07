import React from "react";
import styles from "./selectPayment.module.scss";

interface SelectPaymentProps {
  className?: string;
  style?: React.CSSProperties;
}

const SelectPayment: React.FC<SelectPaymentProps> = ({ style, className }) => {
  return (
    <div className={`${styles.paymentContainer} ${className}`} style={style}>
      <h2 className={styles.heading}>
        Select Payment Method <span className={styles.required}>*</span>
      </h2>
      <select
        className={styles.paymentOptions}
        defaultValue={"Select Payment Method"}
      >
        <option value="Select Payment Method" disabled>
          Select Payment Method
        </option>
        <option value="GCash">GCash</option>
        <option value="CreditCard">Credit Card</option>
      </select>
      <h3 className={styles.subheading}>
        Please upload your proof of payment here{" "}
        <span className={styles.required}>*</span>
      </h3>
      <label className={styles.fileUpload}>
        <input type="file" accept=".jpg,.jpeg" />
        <span className={styles.uploadText}>
          <svg
            className={styles.uploadIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 23 21"
            fill="none"
          >
            <path
              d="M7.7165 5.99176L10.35 3.57616V13.6482C10.35 13.9267 10.4712 14.1939 10.6868 14.3908C10.9025 14.5878 11.195 14.6984 11.5 14.6984C11.805 14.6984 12.0975 14.5878 12.3132 14.3908C12.5288 14.1939 12.65 13.9267 12.65 13.6482V3.57616L15.2835 5.99176C15.3904 6.0902 15.5176 6.16833 15.6577 6.22165C15.7979 6.27497 15.9482 6.30242 16.1 6.30242C16.2518 6.30242 16.4021 6.27497 16.5423 6.22165C16.6824 6.16833 16.8096 6.0902 16.9165 5.99176C17.0243 5.89412 17.1098 5.77796 17.1682 5.64998C17.2266 5.52199 17.2567 5.38472 17.2567 5.24607C17.2567 5.10743 17.2266 4.97015 17.1682 4.84217C17.1098 4.71418 17.0243 4.59802 16.9165 4.50039L12.3165 0.299339C12.2071 0.203722 12.0782 0.12877 11.937 0.0787838C11.657 -0.0262613 11.343 -0.0262613 11.063 0.0787838C10.9218 0.12877 10.7929 0.203722 10.6835 0.299339L6.0835 4.50039C5.97628 4.59831 5.89122 4.71457 5.83319 4.84251C5.77516 4.97046 5.74529 5.10759 5.74529 5.24607C5.74529 5.38456 5.77516 5.52169 5.83319 5.64963C5.89122 5.77758 5.97628 5.89383 6.0835 5.99176C6.19072 6.08968 6.31802 6.16736 6.45811 6.22036C6.59821 6.27335 6.74836 6.30063 6.9 6.30063C7.05164 6.30063 7.20179 6.27335 7.34189 6.22036C7.48198 6.16736 7.60928 6.08968 7.7165 5.99176ZM21.85 10.4974C21.545 10.4974 21.2525 10.608 21.0368 10.805C20.8212 11.002 20.7 11.2691 20.7 11.5476V17.8492C20.7 18.1278 20.5788 18.3949 20.3632 18.5919C20.1475 18.7888 19.855 18.8995 19.55 18.8995H3.45C3.145 18.8995 2.85249 18.7888 2.63683 18.5919C2.42116 18.3949 2.3 18.1278 2.3 17.8492V11.5476C2.3 11.2691 2.17884 11.002 1.96317 10.805C1.74751 10.608 1.455 10.4974 1.15 10.4974C0.845001 10.4974 0.552494 10.608 0.336827 10.805C0.12116 11.002 0 11.2691 0 11.5476V17.8492C0 18.6849 0.363481 19.4863 1.01048 20.0772C1.65748 20.668 2.535 21 3.45 21H19.55C20.465 21 21.3425 20.668 21.9895 20.0772C22.6365 19.4863 23 18.6849 23 17.8492V11.5476C23 11.2691 22.8788 11.002 22.6632 10.805C22.4475 10.608 22.155 10.4974 21.85 10.4974Z"
              fill="#555555"
            />
          </svg>
          Upload
        </span>
      </label>
    </div>
  );
};

export default SelectPayment;
