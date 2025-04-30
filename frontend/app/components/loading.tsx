import styles from "./loading.module.scss";
export const Loading = () => {
  return (
    <div className={styles.ldsRingContainer}>
      <div className={styles["lds-ring"]}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
