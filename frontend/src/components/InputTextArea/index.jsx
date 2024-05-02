import classes from "./styles.module.css";

const InputTextArea = ({label, placeholder, name, onChange, value, required}) => {

    const resizeOnChange = (e) => {
        onChange(e)
        e.target.style.height = `auto`
        e.target.style.height = `${e.target.scrollHeight}px`
    }

      return (
          <div>
              <label htmlFor={name}>{label}</label>
              <textarea
                  id = {name}
                  className={classes.input__class}
                  placeholder={placeholder}
                  name={name}
                  onChange={(e) => resizeOnChange(e)}
                  value={value}
                  required={required}

              />
          </div>
    );
};

export default InputTextArea