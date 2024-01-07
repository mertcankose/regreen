import styles from "./style.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer} id="footer">
      <p className={styles.copyrightText}>
        Copyright © {new Date().getFullYear()} <br /> ReGreen All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
