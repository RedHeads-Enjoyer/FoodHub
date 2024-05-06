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
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingIngredients, setIsLoadingIngredients] = useState(false)
    const [isLoadingEquipment, setIsLoadingEquipment] = useState(false)
    const [equipment, setEquipment] = useState([])

    useEffect(() => {
        setIsLoading(true)
        axios
            .get(dbUrl + '/recipe/' + id)
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
        console.log(tmpEquipment)
        console.log(recipe)
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
            <p className={classes.recipe__name}>{isLoading ? <Loading/> : recipe.name}</p>
            <div className={classes.recipe__info__wrapper}>
                <img className={classes.recipe__avatar} src={isLoading ? image_placeholder : image}/>
                <div className={classes.grid__wrapper}>
                    <div className={classes.recipe__stats__wrapper}>
                        <div className={classes.box1}>
                            <BlobInfo label={"Просмотры"} value={isLoading ? <Loading/> : recipe.views}/>
                        </div>
                        <div className={classes.box2}>
                            <BlobInfo label={"Длительность"} value={isLoading ? <Loading/> : duration}/>
                        </div>
                        <div className={classes.box3}>
                            <BlobInfo label={"Сложность"} value={isLoading ? <Loading/> : recipe.difficult}/>
                        </div>
                        <div className={classes.box4}>
                            <BlobInfo label={"Калорийность на 100 г"} value={isLoading ?  <Loading/> : calorieCount}/>
                        </div>
                        <div className={classes.box5}>
                            <BlobInfo label={"Кухня"} value={isLoading ? <Loading/> : kitchen.name}/>
                        </div>
                        <div className={classes.box6}>
                            <BlobInfo label={"Тип блюда"} value={isLoading ?  <Loading/> : type.name}/>
                        </div>
                        <div className={classes.box7}>
                            <BlobInfo label={"Оценка"} value={recipe ? recipe.ratingVotes !== 0 ? recipe.ratingSum + recipe.ratingVotes : 0 : <Loading/>}/>
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
            </div>
        </div>
    )
}

export default ShowRecipePage