import React, {useState} from 'react';
import classes from "./styles.module.css";

const IngredientsList = ({addedIngredients, allIngredients, label, onChange}) => {
    const [calorieCounter, setCalorieCounter] = useState(0)

    return (
        <>
            <p>{label}</p>
            <div className={classes.ingredients__wrapper}>

                <div className={classes.list__wrapper}>
                    {addedIngredients.map((ingredient) => (
                        <div className={classes.item__wrapper}>
                            <p>Название</p>
                            <p>{ingredient.quantity} г</p>
                        </div>
                    ))}
                </div>
                <div className={classes.bottom__wrapper}>
                    <button className={classes.add__button}></button>
                    <div className={classes.calorie__wrapper}>
                        <p>Калорийность</p>
                        <p>{calorieCounter} ккал/100г</p>
                    </div>
                </div>

            </div>
        </>
    );
};

export default IngredientsList