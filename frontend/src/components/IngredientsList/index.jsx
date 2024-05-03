import React, {useEffect, useState} from 'react';
import classes from "./styles.module.css";
import {dbUrl} from "../../config";
import axios from "axios";
import {getJwtAuthHeader} from "../../functions";

const IngredientsList = ({addedIngredients, allIngredients, label, setTarget, name, setAllIngredients}) => {
    const [calorieCounter, setCalorieCounter] = useState(0)
    const [menuStatus, setMenuStatus] = useState(false)
    const [searchRequest, setSearchRequest] = useState("")
    const [filteredIngredients, setFilteredIngredients] = useState([])
    const [blockAddButton, setBlockAddButton] = useState(false)


    const handleMenuButton = (e) => {
        e.preventDefault()
        setMenuStatus(prevState => !prevState)
    }

    const handleAddIngredientButton = (e, ingredient) => {
        e.preventDefault()
        setTarget({ currentTarget: {name, value: [...addedIngredients, {...ingredient, quantity: 100}]} })
        setAllIngredients(allIngredients.filter((i) => i !== ingredient))
    }

    const handleRemoveIngredientButton = (e, ingredient) => {
        e.preventDefault()
        setTarget({ currentTarget: {name, value: addedIngredients.filter((i) => i._id !== ingredient._id)}})
        setAllIngredients([...allIngredients, ingredient])
    }

    const handleChangeSearchRequest = (e) => {
        setSearchRequest(e.target.value)
    }

    useEffect(() => {
        if (allIngredients.length === 0) return
        setFilteredIngredients(allIngredients)
    }, [allIngredients])

    useEffect(() => {
        setFilteredIngredients(allIngredients.filter(ingredient =>  ingredient.name.toLowerCase().includes(searchRequest.toLowerCase())))
    }, [searchRequest, allIngredients])

    const handleAddOptionButton = async (e) => {
        e.preventDefault()
        setBlockAddButton(true)
        const url = dbUrl + '/ingredient';
        try {
            await axios.post(url, {name: searchRequest, calorieContent: 0, isAdult: false}, getJwtAuthHeader())
                .then((data) => {
                    setSearchRequest("")
                    let contains = false
                    for (let i = 0; i < addedIngredients.length; i++) {
                        if (addedIngredients[i]._id === data.data.object._id) {
                            contains = true
                            break
                        }
                    }
                    if (!contains) {
                        setTarget({ currentTarget: {name, value: [...addedIngredients, {...data.data.object, quantity: 100}]} })
                    }
                    setBlockAddButton(false)
                })
        } catch (error) {
            setBlockAddButton(false)
            if (error.response) {
                console.log(error.response.data.message);
            } else if (error.request) {
                console.log('Ошибка запроса:', error.request);
            } else {
                console.log('Ошибка:', error.message);
            }
        }
    }


    return (
        <>
            <p>{label}</p>
            <div className={classes.ingredients__wrapper}>
                <div className={classes.list__wrapper}>
                    {addedIngredients.map((ingredient) => (
                        <button
                            key={ingredient._id}
                            className={classes.item__wrapper}
                            onClick={(e) => handleRemoveIngredientButton(e, ingredient)}
                        >
                            <p>{ingredient.name}</p>
                            <p>{ingredient.quantity} г</p>
                        </button>
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
                            <input
                                className={classes.search__bar}
                                type={"text"}
                                placeholder={"Найти..."}
                                value={searchRequest}
                                onChange={handleChangeSearchRequest}
                            />
                            <div className={classes.options__wrapper}>
                                { filteredIngredients.length === 0 ?
                                    <div className={classes.add_option__wrapper}>
                                        <p>Ничего не найдено :(</p>
                                        <button
                                            className={classes.add__option__button}
                                            onClick={handleAddOptionButton}
                                            disabled={blockAddButton}
                                        >
                                            <p>Добавить свой вариант</p>
                                        </button>
                                        <p>*Модератор должен подтвердить добавлегние, до этого момента элемент будет считаться неопределенным</p>
                                    </div>
                                    :
                                    filteredIngredients.map((ingredient) => (
                                    <div key={ingredient._id}>
                                        <button className={classes.add__button} onClick={(e) => handleAddIngredientButton(e, ingredient)}>
                                            <p>{ingredient.name}</p>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    );
};

export default IngredientsList