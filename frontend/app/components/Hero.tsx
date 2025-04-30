import styles from "./Hero.module.scss";

interface HeroProps {
    imageURL: string;
    children?: React.ReactNode;
    height?: string;
    marginBottom?: string;
}

const Hero: React.FC<HeroProps> = ({ imageURL, children, height, marginBottom }) => {
    return (
        <section 
            className={styles.hero} 
            style={{ 
                backgroundImage: `url(${imageURL})`, 
                height: height,
                marginBottom: marginBottom
            }}
        >
            {children}
        </section>
    );
};

export default Hero;
