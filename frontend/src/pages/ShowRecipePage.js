import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {currentUser, dbUrl} from "../config";
import {useNavigate, useParams} from "react-router-dom";

const ShowRecipePage = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    const [recipe, setRecipe] = useState({})
    const [recipeWithAuthor, setRecipeWithAuthor] = useState({})
    const [changedData, setChangedData] = useState({})
    const [needData, setNeedData] = useState(false)

    useEffect(() => {
        axios
            .get(dbUrl + '/recipe/' + id)
            .then(data => {
                    setRecipe(data.data)
                }
            )
    }, [needData])

    useEffect(() => {
        if (Object.keys(recipe).length !== 0) {
            axios
                .get(dbUrl + '/auth/user/' + recipe.authorID)
                .then(data => {
                    setRecipeWithAuthor({...recipe, author: data.data})
                })
        }
    }, [recipe])

    const handleChange = ({currentTarget: input}) => {
        setChangedData({...changedData, [input.name]: input.value})
    }


    const handleDelete = () => {
        axios.delete(dbUrl + '/recipe/' + id)
            .then(() => {
                navigate("/search/");
            })
            .catch((error) => {
                // Обработка ошибок при удалении
                console.error('Error deleting recipe:', error);
            });
    }

    const handleUpdate = () => {
        axios.put(dbUrl + '/recipe/' + id, changedData)
            .then(() => {
                setNeedData(prevState => !prevState);
            })
            .catch((error) => {
                // Обработка ошибок при удалении
                console.error('Error deleting recipe:', error);
            });
    }

    return (
        <>
            {Object.keys(recipeWithAuthor).length !== 0 ? (
                <>
                    <p>{recipeWithAuthor.name}</p>
                    <p>{recipeWithAuthor.description}</p>
                    <p>{recipeWithAuthor.author.username}</p>
                    {recipeWithAuthor.authorID === currentUser._id || currentUser.roles.indexOf('admin') !== -1 ?
                        <>
                            <input
                                type={"text"}
                                placeholder={"Название"}
                                name={"name"}
                                onChange={handleChange}
                                value={changedData.name}
                            />
                            <input
                                type={"text"}
                                placeholder={"Описание"}
                                name={"description"}
                                onChange={handleChange}
                                value={changedData.description}
                            />
                            <button onClick={handleUpdate}>Изменить рецепт</button>
                            <button onClick={handleDelete}>Удалить рецепт</button>
                        </> : ""}
                </>
            ) : "Загрузка"}
        </>
    )
}

export default ShowRecipePage