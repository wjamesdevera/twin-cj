import styles from "./BookingStatusReupload.module.scss";

const BookingStatusDetailsReupload = () => {
    return (
        <section className={`${styles["booking-status-reupload-section"]}`}>
            <div className={`${styles["booking-status-reupload-container"]}`}>
                <div className={`${styles["booking-status-reupload-container-heading"]}`}>
                    <h3>Re-Upload Payment Screenshot</h3>
                    <h4>Please note that your reservation is not secured until the payment is verified.</h4>
                </div>
                <div className={`${styles["booking-status-reupload-container-sub"]}`}>
                    <label className={`${styles["booking-status-reupload-label"]}`} htmlFor="reupload-input">
                        <i className="fas fa-arrow-up-from-bracket"></i>&nbsp;&nbsp;Upload
                    </label>
                    <input className={`${styles["booking-status-reupload-input"]}`} id="reupload-input" type="file"></input>
                    <p>Max file size accepted is 1 MB.</p>
                    <button>UPLOAD PAYMENT</button>
                </div>
            </div>
        </section>
    );
};

export default BookingStatusDetailsReupload;
