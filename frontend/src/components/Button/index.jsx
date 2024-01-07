import styles from "./style.module.css";

const Button = ({ children, className, onClick, ...props }) => {
  return (
    <button className={[styles.button, className].join(" ")} {...props} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
