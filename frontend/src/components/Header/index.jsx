import { useState } from "react";
import styles from "./style.module.css";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "../";
import Button from "../Button";

const Header = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const navigate = useNavigate();

  const lineStyle = (item) => {
    if (item === "first") {
      if (isOpenMenu) {
        return "rotate-45";
      } else {
        return "-translate-y-1.5";
      }
    } else if (item === "second") {
      if (isOpenMenu) {
        return "opacity-0";
      }
    } else if (item === "third") {
      if (isOpenMenu) {
        return "-rotate-45";
      } else {
        return "translate-y-1.5";
      }
    }
  };

  const mobileMenuStyle = () => {
    if (isOpenMenu) {
      return "opacity-1 visible translate-y-0";
    } else {
      return "opacity-0 invisible -translate-y-1/2";
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.innerHeader}>
        <div className={styles.desktopContainer}>
          <Link to="/" className={[styles.logoDesktop, "text-xl text-primary"].join(" ")}>
            ReGreen
          </Link>
          <Menu className={styles.desktopMenuContainer} />
          {/* <ConnectWallet className={styles.connectWalletDesktop} /> */}
          <Button
            onClick={() => {
              navigate("/feed");
            }}
          >
            GO FEED
          </Button>
        </div>
        <div className={styles.mobileContainer}>
          <Link to="/" className={[styles.logoMobile, "text-xl text-primary"].join(" ")}>
            ReGreen
          </Link>

          <button
            className={styles.hamburgerButton}
            onClick={() => {
              setIsOpenMenu(!isOpenMenu);
            }}
          >
            <div className={styles.hamburgerInnerContainer}>
              <span aria-hidden="true" className={[styles.hamburgerLine, lineStyle("first")].join(" ")}></span>
              <span aria-hidden="true" className={[styles.hamburgerLine, lineStyle("second")].join(" ")}></span>
              <span aria-hidden="true" className={[styles.hamburgerLine, lineStyle("third")].join(" ")}></span>
            </div>
          </button>
        </div>

        {/* outside the context because absolute */}
        <Menu className={[styles.mobileMenuContainer, mobileMenuStyle()].join(" ")}>
          <Button
            onClick={() => {
              navigate("/contact");
            }}
          >
            Get in touch
          </Button>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
