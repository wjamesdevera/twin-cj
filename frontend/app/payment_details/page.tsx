import React from "react";
import PaymentDetailsHeader from "../components/paymentDetailsHeader";
import styles from "./paymentDetails.module.scss";
import BackBtn from "../components/backButton";
import PaymentContainer from "../components/paymentDetailsContainer";
import PaymentMethod from "../components/selectPayment";
import ConfirmBooking from "../components/confirmBooking";
import PaymentDetailsContainer from "../components/paymentDetailsContainer";
import SelectPayment from "../components/selectPayment";
import PricingContainer from "../components/pricingContainer";

export default function () {
  return (
    <div className={styles.paymentContainer}>
      <PaymentDetailsHeader />

      <BackBtn className={styles.backBtn} />
      <div className={styles.paymentDetails}>
        <h2 className={styles.text}>Payment Details</h2>
        <div className={styles.paymentContainers}>
          <PricingContainer
            className={`${styles.rightContainer} ${styles.container1}`}
            numberOfGuests="6 guest(s)"
            type="Overnight"
            cabinType="Maxi Cabin"
          />
          <PaymentContainer
            className={`${styles.leftContainer} ${styles.container2} `}
            heading="Payment Information"
            subheading="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at neque egestas turpis varius pellentesque vitae sed est. Duis cursus nisi vitae enim pellentesque fringilla. Nam eget dolor et enim fringilla semper non eu purus. Nullam lectus lorem, facilisis quis aliquam sollicitudin, facilisis eu ipsum. Sed eget viverra purus."
          />
          <PaymentContainer
            className={`${styles.leftContainer} ${styles.container3} `}
            heading="Transfer Details"
            subheading="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at neque egestas turpis varius pellentesque vitae sed est. Duis cursus nisi vitae enim pellentesque fringilla."
          />
          <SelectPayment
            className={`${styles.leftContainer} ${styles.container4} `}
          />
          <PaymentContainer
            className={`${styles.rightContainer} ${styles.container5}`}
            heading="Cancellation Policy"
            subheading={
              <>
                Cancellations made at least{" "}
                <span className={styles.bold}>3 business days</span> prior to
                the scheduled booking will be eligible for a refund or
                reschedule. In cases of typhoon, natural calamities, or other
                unforeseen circumstances affecting the reservation, refunds may
                be accommodated upon review.
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}
