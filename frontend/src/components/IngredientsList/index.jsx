import React, {useState} from 'react';
import classes from "./styles.module.css";

const IngredientsList = ({addedIngredients, allIngredients, label, setTarget, name, setAllIngredients}) => {
    const [calorieCounter, setCalorieCounter] = useState(0)
    const [menuStatus, setMenuStatus] = useState(false)

    const handleMenuButton = (e) => {
        e.preventDefault()
        setMenuStatus(prevState => !prevState)
    }

    const handleAddIngredientButton = (e, ingredient) => {
        e.preventDefault()
        setTarget({ currentTarget: {name, value: [...addedIngredients, {...ingredient, quantity: 100}]} })
        setAllIngredients(allIngredients.filter((i) => i !== ingredient))
    }



    return (
        <>
            <p>{label}</p>
            <div className={classes.ingredients__wrapper}>
                <div className={classes.list__wrapper}>
                    {addedIngredients.map((ingredient) => (
                        <div key={ingredient._id} className={classes.item__wrapper}>
                            <p>{ingredient.name}</p>
                            <p>{ingredient.quantity} г</p>
                        </div>
                    ))}
                </div>
                <div className={classes.bottom__wrapper}>
                    <button onClick={handleMenuButton} className={menuStatus === false ? classes.open__menu__button : classes.close__menu__button}></button>
                    <div className={classes.calorie__wrapper}>
                        <p>Калорийность</p>
                        <p>{calorieCounter} ккал/100г</p>
                    </div>
                </div>
                <div className={classes.menu__wrapper}>
                    {menuStatus === true &&
                        <>
                        {allIngredients.map((ingredient) => (
                            <div key={ingredient._id}>
                                <button className={classes.add__button} onClick={(e) => handleAddIngredientButton(e, ingredient)}>
                                    <p>{ingredient.name}</p>
                                </button>
                            </div>
                        ))}
                        </>
                    }
                </div>

            </div>
        </>
    );
};

export default IngredientsList