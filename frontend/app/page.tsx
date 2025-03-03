import Link from "next/link";
import styles from "./page.module.scss";
import Image from "next/image";
import twinCJLogo from "@/public/assets/admin-logo.svg";
import HomePageCarousel from "./components/home-page-carousel";
import Button from "./components/button";
import SectionHeader from "./components/SectionHeader";

const cabins = [
  {
    imageSrc: "/assets/home_mini.jpg",
    imgAltText: "Mini Cabin",
    title: "Mini",
    description: "For 3 to 4 guests",
    availableCabins: 3,
  },
  {
    imageSrc: "/assets/home_maxi.png",
    imgAltText: "Maxi",
    title: "Maxi Cabin",
    description: "For 6 to 8 guests",
    availableCabins: 3,
  },
  {
    imageSrc: "/assets/home_venti.png",
    imgAltText: "Venti",
    title: "Maxi Cabin",
    description: "For 15 to 20 guests",
    availableCabins: 1,
  },
];

type CabinCardProps = {
  imageSrc: string;
  imgAltText: string;
  title: string;
  description: string;
  availableCabins: number;
};

const CabinCard: React.FC<CabinCardProps> = ({
  imageSrc,
  imgAltText,
  title,
  description,
  availableCabins,
}) => {
  return (
    <div className={styles["cabin-card"]}>
      <div className={styles["wrapper"]}>
        <div className={styles["img-wrapper"]}>
          <Image src={imageSrc} alt={imgAltText} fill />
        </div>
        <div className={styles["title"]}>{title}</div>
        <div className={styles["description"]}>
          <p>{description}</p>
          <p>
            {availableCabins} {title} cabins available
          </p>
        </div>
      </div>
    </div>
  );
};
export default function page() {
  return (
    <main>
      <section className={styles.heroSection}>
        <div className={styles.backgroundImage}>
          <Image src="/assets/home_cover.jpg" alt="Home Cover" fill priority />
        </div>
        <div className={`${styles["hero-wrapper"]} container`}>
          <div className={styles["hero-content-container"]}>
            <div className={styles["hero-content-wrapper"]}>
              <div className={styles["hero-logo-image-container"]}>
                <Image
                  src={twinCJLogo}
                  alt="Twin CJ Glamping Resort Logo"
                  className={styles["hero-logo"]}
                  width={250}
                />
              </div>
              <p className={styles["subtext"]}>
                Enjoy the scenic view by the river
              </p>
              <Button
                variant="outline-white"
                fullWidth={true}
                className={styles["book-now-button"]}
              >
                Book Now
              </Button>
              <p className={styles["subtext"]}>
                Check your booking status{" "}
                <Link href="/booking-status">here</Link>!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles["welcome-section"]}`}>
        <div className={`${styles["wrapper"]} container`}>
          <SectionHeader title="TWIN CJ GLAMPING RESORT" subtext="WELCOME TO" />
          <div className={styles.divider}></div>
          <p className={styles.descriptionText}>
            Location is everything when it comes to finding the perfect getaway,
            and we’re thrilled to have found ours at Twin CJ Glamping Resort.
            The river is within your reach, which is a great way to spend time
            with your loved ones with different fun activities.
          </p>
        </div>
      </section>

      <section className={styles.footstepsSection}>
        <div className={styles.footstepsContent}>
          <h2>FOOTSTEPS TO THE RIVER</h2>
        </div>
        <div className={styles.footstepsImage}>
          <Image
            src="/assets/home_river.jpg"
            alt="River Footsteps"
            fill
            priority
          />
        </div>
      </section>

      <section className={styles.ourCabinsSection}>
        <div className={`${styles["wrapper"]} container`}>
          <SectionHeader title="Our Cabins" />
          <div className={`${styles["cabin-cards-container"]}`}>
            {cabins.map((cabin, key) => (
              <CabinCard
                imageSrc={cabin.imageSrc}
                imgAltText={cabin.imgAltText}
                title={cabin.title}
                description={cabin.description}
                availableCabins={cabin.availableCabins}
                key={key}
              />
            ))}
          </div>
        </div>
      </section>
      <section className={styles["all-around-experience-section"]}>
        <SectionHeader title="AN ALL-AROUND EXPERIENCE" />
        <HomePageCarousel />
      </section>
      <section className={styles["why-choose-us-section"]}>
        <div className={`${styles["wrapper"]} container`}>
          <SectionHeader title="WHY CHOOSE US?" />
          <p className={styles["header-description"]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at
            neque egestas turpis varius pellentesque vitae sed est. Duis cursus
            nisi vitae enim pellentesque fringilla.
          </p>
          <div className={`${styles["two-column"]} ${styles["img-right"]}`}>
            <div className={styles["text-area"]}>
              <h3 className={styles.title}>GAZEBO</h3>
              <p className={styles.description}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at
                urna euismod, sodales ipsum nec, pretium justo. Aenean volutpat
                est at nibh imperdiet faucibus. Fusce pellentesque, elit sed
                suscipit pretium, sapien dui tincidunt risus, eu malesuada nunc
                arcu eget neque. Aenean in velit arcu. Donec non mattis sem.
                Vivamus sed volutpat augue, eget ullamcorper arcu. Morbi
                fermentum eu lacus nec commodo. Proin vestibulum rhoncus mi sed
                interdum. Vivamus et eros varius, dapibus velit in, pellentesque
                dolor. Donec sit amet massa elementum, venenatis orci et,
                venenatis nulla. Nam efficitur a ante id viverra.
              </p>
              <Button variant="outline" className={styles["outline"]}>
                Book Now
              </Button>
            </div>
            <div className={styles["img-area"]}>
              <Image src="/assets/home_gazebo.jpg" alt="Gazebo" fill />
            </div>
          </div>
          <div className={`${styles["two-column"]} ${styles["img-left"]}`}>
            <div className={styles["img-area"]}>
              <Image src="/assets/home_photoshoot.jpg" alt="Photoshoot" fill />
            </div>
            <div className={styles["text-area"]}>
              <h3 className={styles.title}>PHOTOSHOOT</h3>
              <p className={styles.description}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at
                urna euismod, sodales ipsum nec, pretium justo. Aenean volutpat
                est at nibh imperdiet faucibus. Fusce pellentesque, elit sed
                suscipit pretium, sapien dui tincidunt risus, eu malesuada nunc
                arcu eget neque. Aenean in velit arcu. Donec non mattis sem.
                Vivamus sed volutpat augue, eget ullamcorper arcu. Morbi
                fermentum eu lacus nec commodo. Proin vestibulum rhoncus mi sed
                interdum. Vivamus et eros varius, dapibus velit in, pellentesque
                dolor. Donec sit amet massa elementum, venenatis orci et,
                venenatis nulla. Nam efficitur a ante id viverra.
              </p>
              <Button variant="outline" className={styles["outline"]}>
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
