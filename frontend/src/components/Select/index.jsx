import classes from "./styles.module.css";
import {useEffect, useState} from "react";

const Select = ({name, onChange, options, label}) => {
    const [selected, setSelected] = useState({})
    const [isOptionsVisible, setIsOptionsVisible] = useState(false)
    const [filteredOptions, setFilteredOptions] = useState(options)
    const [searchRequest, setSearchRequest] = useState("")

    useEffect(() => {
        if (options.length !== 0) {
            setSelected(options[0])
        }
    }, [options])

    const handleSelectorButton = () => {
        setIsOptionsVisible((prevState) => !prevState)
    }

    const handleSearchRequest = (e) => {
        setSearchRequest(e.target.value)
    }


    return (
    <div className={classes.select__wrapper}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.selector__button} onClick={handleSelectorButton}>
          <p className={classes.selected__option}>{Object.keys(selected).length !== 0 ? selected.name : ""}</p>
          <div className={classes.button__arrow}>
              <span className={isOptionsVisible === false ? classes.arrow__left__down : classes.arrow__left__up}></span>
              <span className={isOptionsVisible === false ? classes.arrow__right__down : classes.arrow__right__up}></span>
          </div>
      </div>
        { isOptionsVisible &&
            <>
                <input
                    className={classes.search__bar}
                    type={"text"}
                    value={searchRequest}
                    onChange={handleSearchRequest}
                />
                <div className={classes.options__wrapper}>
                    {options.map((option) => (
                        <button key={option._id} className={classes.option__button}>{option.name}</button>
                    ))}
                </div>
            </>
        }
    </div>
    );
};

export default Select