import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {dbUrl} from "../config";
import {useNavigate, useParams} from "react-router-dom";
import classes from './ShowRecipePage.module.css'
import {fetchImage} from "../functions";
import BlobInfo from "../components/BlobInfo";
import UserImageName from "../components/UserImageName";
import Loading from "../components/Loading";

const ShowRecipePage = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    const [recipe, setRecipe] = useState({})
    const [ingredients, setIngredients] = useState([])
    const [calorieCount, setCalorieCount] = useState(0)
    const [kitchen, setKitchen] = useState('')
    const [type, setType] = useState('')
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
            fetchImage(setImage, recipe.image);
            getIngredients()
            getKitchen()
            getType()
            setDuration(countDuration())



        }
    }, [recipe])

    const getKitchen = () => {
        axios
            .get(dbUrl + '/kitchen/' + recipe.kitchenID)
            .then(data => {
                setKitchen(data.data)
                }
            )
    }

    const getType = () => {
        axios
            .get(dbUrl + '/type/' + recipe.typeID)
            .then(data => {
                setType(data.data)
                }
            )
    }

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


    const getIngredients = () => {
        const tmpIngredients = []
        for (let i = 0; i < recipe.ingredients.length; i++) {
            axios
                .get(dbUrl + '/ingredient/' + recipe.ingredients[i]._id)
                .then(data => {
                    tmpIngredients.push(data.data)
                })
        }
        setIngredients(tmpIngredients)
    }

    useEffect(() => {
        let tmpCalorieCount = 0
        let weight = 0
        for (let i = 0; i < ingredients.length; i++) {
            weight += parseInt(ingredients[i].quantity)
            tmpCalorieCount += parseInt(ingredients[i].quantity) * ingredients[i].calorieContent
        }
        const result = Math.ceil(tmpCalorieCount/weight)
        if (result) setCalorieCount(result)
        else setCalorieCount(0)
    })

    return (
        <div className={classes.recipe__wrapper}>
            <p className={classes.recipe__name}>{recipe.name === "asd" ? recipe.name : <Loading/>}</p>
            {/*<div className={classes.recipe__info__wrapper}>*/}
            {/*    <img className={classes.recipe__avatar} src={image}/>*/}
            {/*    <div className={classes.recipe__stats__wrapper}>*/}
            {/*        <div className={classes.box1}>*/}
            {/*            <BlobInfo label={"Просмотры"} value={recipe.views}/>*/}
            {/*        </div>*/}
            {/*        <div className={classes.box2}>*/}
            {/*            <BlobInfo label={"Длительность"} value={duration}/>*/}
            {/*        </div>*/}
            {/*        <div className={classes.box3}>*/}
            {/*            <BlobInfo label={"Сложность"} value={recipe.difficult}/>*/}
            {/*        </div>*/}
            {/*        <div className={classes.box4}>*/}
            {/*            <BlobInfo label={"Калорийность на 100 г"} value={calorieCount}/>*/}
            {/*        </div>*/}
            {/*        <div className={classes.box5}>*/}
            {/*            <BlobInfo label={"Кухня"} value={kitchen.name}/>*/}
            {/*        </div>*/}
            {/*        <div className={classes.box6}>*/}
            {/*            <BlobInfo label={"Тип блюда"} value={type.name}/>*/}
            {/*        </div>*/}
            {/*        <div className={classes.box7}>*/}
            {/*            <BlobInfo label={"Оценка"} value={ recipe.ratingVotes !== 0 ? recipe.ratingSum + recipe.ratingVotes : 0}/>*/}
            {/*        </div>*/}
            {/*        <UserImageName id={recipe.author._id}/>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
}

export default ShowRecipePage