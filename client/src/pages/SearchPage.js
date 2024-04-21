import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {dbUrl} from "../config";
import {Link} from "react-router-dom";

const SearchPage = () => {
    const [recipes, setRecipes] = useState([])
    const [recipesWithAuthor, setRecipesWithAuthor] = useState([])

    useEffect(() => {
        axios
            .get(dbUrl + '/recipe')
            .then(data => {
                    setRecipes(data.data)
                }
            )
    }, [])

    useEffect(() => {
        const fetchAuthors = async () => {
            const updatedRecipes = [];
            await Promise.all(
                recipes.map(async (recipe) => {
                    try {
                        const response = await axios.get(dbUrl + '/auth/user/' + recipe.authorID);
                        const recipeWithAuthor = { ...recipe, author: response.data };
                        updatedRecipes.push(recipeWithAuthor);
                    } catch (error) {
                        console.error('Error fetching author info:', error);
                        updatedRecipes.push(recipe);
                    }
                })
            );
            setRecipesWithAuthor(updatedRecipes);
        };
        fetchAuthors();
    }, [recipes]);

    const handleSubmit = async (e) => {
        e.preventDefault()
    }

    return (
        <>
            {recipesWithAuthor.map((recipe) => (
                <div key={recipe._id}>
                    <Link to={'/recipe/' + recipe._id}>
                        <p>{recipe.name}</p>
                        <p>{recipe.author.username}</p>
                    </Link>
                </div>
            ))}
        </>
    )
}

export default SearchPage