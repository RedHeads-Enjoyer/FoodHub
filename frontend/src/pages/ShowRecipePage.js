import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {dbUrl} from "../config";
import {useNavigate, useParams} from "react-router-dom";
import classes from './ShowRecipePage.module.css'
import {fetchImage, getJwtAuthHeader} from "../functions";
import BlobInfo from "../components/BlobInfo";
import UserImageName from "../components/UserImageName";
import Loading from "../components/Loading";
import image_placeholder from '../images/image_placeholder.svg'
import StepsWithTimer from "../components/StepsWithTimer";

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
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingIngredients, setIsLoadingIngredients] = useState(true)
    const [isLoadingEquipment, setIsLoadingEquipment] = useState(true)
    const [equipment, setEquipment] = useState([])
    const [recipeRating, setRecipeRating] = useState(0)

    useEffect(() => {
        setIsLoading(true)
        axios
            .get(dbUrl + '/recipe/' + id, getJwtAuthHeader())
            .then(data => {
                    setRecipe(data.data)
                }
            )
    }, [])

    useEffect(() => {
        if (Object.keys(recipe).length !== 0) {
            setIsLoading(false)
            fetchImage(setImage, recipe.image);
            getIngredients()
            getEquipment()
            getKitchen()
            getType()
            setRating()
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

    const setRating = () => {
        if (recipe.ratingVotes === 0) setRecipeRating(0)
        else setRecipeRating(recipe.ratingSum / recipe.ratingVotes)
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
        setIsLoadingIngredients(true);
        const requests = recipe.ingredients.map(ingredient =>
            axios.get(dbUrl + '/ingredient/' + ingredient._id)
        );

        Promise.all(requests).then(responses => {
            const tmpIngredients = responses.map(response => response.data);
            setIngredients(tmpIngredients);
            setIsLoadingIngredients(false);
        });
    }

    const getSteps = () => {

    }

    const getEquipment = () => {
        setIsLoadingEquipment(true)
        const tmpEquipment = []
        for (let i = 0; i < recipe.equipment.length; i++) {
            axios
                .get(dbUrl + '/equipment/' + recipe.equipment[i])
                .then(data => {
                    tmpEquipment.push(data.data)
                })
        }
        setEquipment(tmpEquipment)
        setIsLoadingEquipment(false)
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
           {isLoading ? <Loading/> :  <p className={classes.recipe__name}>{recipe.name}</p>}
            <div className={classes.recipe__info__wrapper}>
                <img className={classes.recipe__avatar} src={isLoading ? image_placeholder : image}/>
                <div className={classes.grid__wrapper}>
                    <div className={classes.recipe__stats__wrapper}>
                        <div className={classes.box1}>
                            {isLoading ? <Loading/> : <BlobInfo label={"Просмотры"} value={recipe.views}/>}
                        </div>
                        <div className={classes.box2}>
                            {isLoading ? <Loading/> : <BlobInfo label={"Длительность"} value={duration}/>}
                        </div>
                        <div className={classes.box3}>
                            {isLoading ? <Loading/> : <BlobInfo label={"Сложность"} value={recipe.difficult}/>}
                        </div>
                        <div className={classes.box4}>
                            {isLoading ? <Loading/> : <BlobInfo label={"Калорийность на 100 г"} value={calorieCount}/>}
                      </div>
                        <div className={classes.box5}>
                            {isLoading ? <Loading/> : <BlobInfo label={"Кухня"} value={kitchen.name}/>}
                        </div>
                        <div className={classes.box6}>
                            {isLoading ? <Loading/> : <BlobInfo label={"Тип блюда"} value={type.name}/>}
                        </div>
                        <div className={classes.box7}>
                            {isLoading ? <Loading/> : <BlobInfo label={"Оценка"} value={recipeRating}/>}
                        </div>
                        <div className={classes.box8}>
                            {isLoading ? <Loading/> : <UserImageName id={recipe.authorID}/>}
                        </div>
                    </div>
                </div>
                <div className={classes.lists__wrapper}>
                    <div className={classes.ingredients__wrapper}>
                        <p className={classes.list__label}>Ингредиенты</p>
                        {isLoadingIngredients ? <Loading/> : (
                            ingredients.map((ingredient, index) => (
                                <div className={classes.list__item} key={recipe.ingredients[index]._id}>
                                    <p>{ingredient.name}</p>
                                    <p>{recipe.ingredients[index].quantity} г</p>
                                </div>
                            ))
                        )}
                    </div>
                    <div className={classes.equipment__wrapper}>
                        <p className={classes.list__label}>Оборудование</p>
                        {isLoadingEquipment ? <Loading/> : (
                            equipment.map((eq, index) => (
                                <p key={recipe.equipment[index]}>{eq.name}</p>
                            ))
                        )}
                    </div>
                </div>
                {isLoading ? <Loading/> : <StepsWithTimer steps={recipe.steps}/> }
            </div>
        </div>
    )
}

export default ShowRecipePage