import SectionHeader from "../../components/SectionHeader";
import styles from "./contactinfo.module.scss";
const ContactInfo: React.FC = () => {
  return (
    <section className={styles.contactSection}>
      <SectionHeader title="contact us" />
      <div className={`${styles.contactContainer} container`}>
        {/* Google Maps */}
        <div className={styles.mapContainer}>
          <div className={styles.gmap_canvas}>
            <iframe
              className={styles.gmap_iframe}
              src="https://maps.google.com/maps?width=652&amp;height=424&amp;hl=en&amp;q=Twin CJ Riverside Glamping Resort, Tabtab 3013, Norzagaray, Bulacan&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Contact Info */}
        <div className={styles.contactInfo}>
          <h3>Our Address</h3>
          <div className={styles["contact-details"]}>
            <p>
              Twin CJ Riverside Glamping Resort, Tabtab 3013, Norzagaray,
              Bulacan
            </p>
          </div>

          <h3>Office Hours</h3>
          <div className={styles["contact-details"]}>
            <p>
              Monday to Sunday <br /> 7:00 AM - 7:00 PM
            </p>
          </div>

          <h3>Contact</h3>
          <div className={styles["contact-details"]}>
            <p>
              <strong>Phone:</strong> 09175599237
            </p>
            <p>
              <strong>Email:</strong> twincjriversideresort@gmail.com
            </p>
            <p>
              <strong>Facebook:</strong> Twin CJ Riverside Glamping Resort
            </p>
            <p>
              <strong>Instagram:</strong> @twincjriversideglamping
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
