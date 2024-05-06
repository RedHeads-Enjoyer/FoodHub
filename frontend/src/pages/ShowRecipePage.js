import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {dbUrl} from "../config";
import {useNavigate, useParams} from "react-router-dom";
import classes from './ShowRecipePage.module.css'
import {fetchImage} from "../functions";
import BlobInfo from "../components/BlobInfo";

const ShowRecipePage = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    const [recipe, setRecipe] = useState({})
    const [author, setAuthor] = useState({})
    const [ingredients, setIngredients] = useState({})
    const [calorieCount, setCalorieCount] = useState(0)
    const [image, setImage] = useState("")
    const [duration, setDuration] = useState(false)

    useEffect(() => {
        axios
            .get(dbUrl + '/recipe/' + id)
            .then(data => {
                    setRecipe(data.data)
                }
            )
    }, [])

    useEffect(() => {
        if (Object.keys(recipe).length !== 0) {
            axios
                .get(dbUrl + '/user/' + recipe.authorID)
                .then(data => {
                    setAuthor(data.data)
                })

            setDuration(countDuration())
            // let calories = 0
            // let weight = 0
            // for (let i = 0; i < addedIngredients.length; i++) {
            //     weight += parseInt(addedIngredients[i].quantity)
            //     calories += parseInt(addedIngredients[i].quantity) * addedIngredients[i].calorieContent
            // }
            // const result = Math.ceil(calories/weight)
            // if (result) setCalorieCounter(result)
            // else setCalorieCounter(0)
        }
    }, [recipe])

    const countDuration = () => {
        let tmpDuration = 0
        for (let i = 0; i < recipe.steps.length; i++) {
            tmpDuration += recipe.steps[i].duration
        }
        const hours = Math.floor(tmpDuration / 3600)
        const minutes = Math.ceil((tmpDuration - hours * 3600) / 60)
        if (hours === 0) return (`${minutes} мин`)
        return  `${hours} ч ${minutes} мин`
    }

    useEffect(() => {
        if (Object.keys(author).length !== 0) {
            fetchImage(setImage, recipe.image);
        }
    }, [author])

    return (
        <div className={classes.recipe__wrapper}>
            {Object.keys(author).length !== 0 ? (
                <>
                    <p className={classes.recipe__name}>{recipe.name}</p>
                    <img className={classes.recipe__avatar} src={image}/>
                    <div className={classes.recipe__main__info__wrapper}>
                        <BlobInfo label={"Просмотры"} value={recipe.views}/>
                        <BlobInfo label={"Длительность"} value={duration}/>
                        <BlobInfo label={"Сложность"} value={recipe.difficult}/>
                        <BlobInfo label={"Калорийность"} value={recipe.difficult}/>
                        <BlobInfo label={"Кухня"} value={duration}/>
                        <BlobInfo label={"Тип блюда"} value={duration}/>
                    </div>
                </>
                ) : "Загрузка"}
                    {/*{recipeWithAuthor.authorID === currentUser._id || currentUser.roles.indexOf('admin') !== -1 ?*/}
                    {/*    <>*/}
                    {/*        <input*/}
                    {/*            type={"text"}*/}
                    {/*            placeholder={"Название"}*/}
                    {/*            name={"name"}*/}
                    {/*            onChange={handleChange}*/}
                    {/*            value={changedData.name}*/}
                    {/*        />*/}
                    {/*        <input*/}
                    {/*            type={"text"}*/}
                    {/*            placeholder={"Описание"}*/}
                    {/*            name={"description"}*/}
                    {/*            onChange={handleChange}*/}
                    {/*            value={changedData.description}*/}
                    {/*        />*/}
                    {/*        <button onClick={handleUpdate}>Изменить рецепт</button>*/}
                    {/*        <button onClick={handleDelete}>Удалить рецепт</button>*/}
                    {/*    </> : ""}*/}

        </div>
    )
}

export default ShowRecipePage