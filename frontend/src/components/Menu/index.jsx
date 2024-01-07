import { Link, NavLink } from "react-router-dom";
import styles from "./style.module.css";
import { menu } from "../../constants/menu";

const Menu = ({ className, children, ...props }) => {
  return (
    <ul className={[styles.menu, className].join(" ")} {...props}>
      {menu.map((item) => (
        <li className={styles.menuItem} key={item.id} id="menuItem">
          <NavLink className={({ isActive }) => (isActive ? styles.activeMenu : styles.inactiveMenu)} to={item.link}>
            {item.name}
          </NavLink>
        </li>
      ))}

      <li className={styles.childrenItem}>{children}</li>
    </ul>
  );
};

export default Menu;
