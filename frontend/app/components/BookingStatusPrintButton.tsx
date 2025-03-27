import styles from "./BookingStatusPrintButton.module.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";

const BookingStatusPrintButton = () => {
    return (
        <section className={`${styles["booking-status-print-button-section"]}`}>
            <button><i className="fas fa-print"></i>&nbsp;PRINT OFFICIAL RECEIPT</button>
        </section>
    );
}

export default BookingStatusPrintButton;
