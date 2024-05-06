import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {dbUrl} from "../config";
import {Link} from "react-router-dom";
import classes from './SearchPage.module.css'
import RecipeCarp from "../components/RecipeCard";

const SearchPage = () => {
    const [recipes, setRecipes] = useState([])

    useEffect(() => {
        axios
            .get(dbUrl + '/recipe')
            .then(data => {
                    setRecipes(data.data)
                }
            )
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
    }

    return (
        <div className={classes.search__page__wrapper}>
            <div className={classes.filters__wrapper}>
                <p className={classes.filters__label}>Фильтры</p>
            </div>
            <div className={classes.recipes__wrapper}>
                {recipes.map((recipe) => (
                    <div key={recipe._id}>
                        <RecipeCarp recipe={recipe}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SearchPage