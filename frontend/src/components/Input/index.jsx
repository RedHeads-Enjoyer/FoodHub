import classes from "./styles.module.css";

const Button = ({type, placeholder, name, onChange, value, required}) => {
      return (
          <button className={classes.btn} onClick={onClick}><p>{name}</p></button>
    );
};

export default Button