import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {dbUrl} from "../config";
import {Link} from "react-router-dom";
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
        <>
            asd
            {recipes.map((recipe) => (
                <div key={recipe._id}>
                    <RecipeCarp recipe={recipe}/>
                </div>
            ))}
        </>
    )
}

export default SearchPage