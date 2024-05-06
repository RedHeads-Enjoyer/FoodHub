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
import image_placeholder from '../images/image_placeholder.svg'

const ShowRecipePage = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    const [recipe, setRecipe] = useState({})
    const [ingredients, setIngredients] = useState([])
    const [calorieCount, setCalorieCount] = useState()
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
            console.log(recipe.authorID)
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
            <p className={classes.recipe__name}>{recipe ? recipe.name : <Loading/>}</p>
            <div className={classes.recipe__info__wrapper}>
                <img className={classes.recipe__avatar} src={image ? image : image_placeholder}/>
                <div className={classes.recipe__stats__wrapper}>
                    <div className={classes.box1}>
                        <BlobInfo label={"Просмотры"} value={recipe ? recipe.views : <Loading/>}/>
                    </div>
                    <div className={classes.box2}>
                        <BlobInfo label={"Длительность"} value={recipe ? duration : <Loading/>}/>
                    </div>
                    <div className={classes.box3}>
                        <BlobInfo label={"Сложность"} value={recipe ? recipe.difficult : <Loading/>}/>
                    </div>
                    <div className={classes.box4}>
                        <BlobInfo label={"Калорийность на 100 г"} value={recipe ? calorieCount : <Loading/>}/>
                    </div>
                    <div className={classes.box5}>
                        <BlobInfo label={"Кухня"} value={recipe ? kitchen.name : <Loading/>}/>
                    </div>
                    <div className={classes.box6}>
                        <BlobInfo label={"Тип блюда"} value={recipe ? type.name : <Loading/>}/>
                    </div>
                    <div className={classes.box7}>
                        <BlobInfo label={"Оценка"} value={recipe ? recipe.ratingVotes !== 0 ? recipe.ratingSum + recipe.ratingVotes : 0 : <Loading/>}/>
                    </div>
                    <UserImageName id={recipe.authorID}/>
                </div>
            </div>
        </div>
    )
}

export default ShowRecipePage