import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {currentUser, dbUrl} from "../config";
import {Link, useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";

const CreateRecipePage = () => {
    const [recipe, setRecipe] = useState({
        name: "",
        description: "",
        // image: "",
        difficult: 1,
        ingredients: [],
        comments: [],
        kitchen: "",
        type: "",
        equipment: [],
    })

    const [selectedIngredients, setSelectedIngredients] = useState([])
    const [ingredients, setIngredients] = useState([])
    const [equipment, setEquipment] = useState([])
    const [selectedEquipment, setSelectedEquipment] = useState([])
    const [kitchens, setKitchens] = useState([])
    const [types, setTypes] = useState([])

    const handleChangeRecipe = ({currentTarget: input}) => {
        setRecipe({...recipe, [input.name]: input.value})
    }

    const handleChangeSelectedIngredients = (e, ingId) => {
        const { name, value } = e.target;
        // Обновляем состояние компонента, включая новое значение quantity для соответствующего ингредиента
        setSelectedIngredients(prevIngredients => {
            return prevIngredients.map(ing => {
                if (ing._id === ingId) {
                    return { ...ing, [name]: value };
                }
                return ing;
            });
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(recipe)
        // try {
        //     const url = dbUrl + '/auth/login'
        //     const response = await axios.post(url, data)
        //     localStorage.setItem("token", response.data.token)
        //     navigate(`/profile/${currentUser._id}`)
        // } catch (error) {
        //     if (error.response) {
        //         // Здесь обрабатываем ошибку на уровне ответа от сервера
        //         console.log(error.response.data.message)
        //         setError(error.response.data.message)
        //     } else if (error.request.request.request) {
        //         // Здесь обрабатываем ошибку на уровне запроса
        //         console.log('Ошибка запроса:', error.request)
        //     } else {
        //         // Здесь обрабатываем другие типы ошибок
        //         console.log('Ошибка:', error.message)
        //     }
        // }
    }

    useEffect(() => {
        axios
            .get('http://localhost:5000/api/ingredient')
            .then(data => {
                setIngredients(data.data)
                }
            )

        axios
            .get('http://localhost:5000/api/kitchen')
            .then(data => {
                    setKitchens(data.data)
                }
            )

        axios
            .get('http://localhost:5000/api/type')
            .then(data => {
                    setTypes(data.data)
                }
            )

        axios
            .get('http://localhost:5000/api/equipment')
            .then(data => {
                    setEquipment(data.data)
                }
            )
    }, [])

    const addIngredient = (e) => {
        setIngredients(ingredients.filter(ing => ing._id !== e._id))
        setSelectedIngredients([...selectedIngredients, {...e, quantity: 0}])
    }

    const removeIngredient = (e) => {
        setSelectedIngredients(selectedIngredients.filter(ing => ing._id !== e._id))
        setIngredients([...ingredients, e])
    }

    const addEquipment = (e) => {
        setEquipment(equipment.filter(eq => eq._id !== e._id))
        setSelectedEquipment([...selectedEquipment, e])
    }

    const removeEquipment = (e) => {
        setSelectedEquipment(selectedEquipment.filter(eq => eq._id !== e._id))
        setEquipment([...equipment, e])
    }


    // useEffect(() => {
    //     axios
    //         .get(`http://localhost:5000/api/auth/users/${id}`)
    //         .then(data => {
    //             setData(data.data)
    //             console.log(data.data)
    //         })
    //         .catch(error => {
    //             console.error("Ошибка получения данных:", error.response.data.message);
    //         });
    // }, [])

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p>Вход</p>
                <input
                    type={"text"}
                    placeholder={"Название"}
                    name={"name"}
                    onChange={handleChangeRecipe}
                    value={recipe.name}
                    required
                />
                <textarea
                    rows="5"
                    cols="40"
                    placeholder={"Описание"}
                    name={"description"}
                    onChange={handleChangeRecipe}
                    value={recipe.description}
                    required
                />
                <input
                    min={1}
                    max={10}
                    type={"number"}
                    placeholder={"Сложность"}
                    name={"difficult"}
                    onChange={handleChangeRecipe}
                    value={recipe.difficult}
                    required
                />

                <p>Все ингредиенты</p>
                {ingredients.map((ing) => (
                    <div key={ing._id}>
                        <button onClick={() => {addIngredient(ing)}}>{ing.name}</button>
                    </div>
                ))}
                {/* выбор ингредиентов */}
                <p>Добавленные ингредиенты</p>
                {   selectedIngredients.length === 0 ? (
                        <p>Нет добавленных ингредиентов</p>
                    ) : (
                    selectedIngredients.map((ing) => (
                        <div key={ing._id} >
                            <button onClick={() => removeIngredient(ing)}>{ing.name}</button>
                            <input
                                min={1}
                                max={100000}
                                type={"number"}
                                placeholder={"Количество"}
                                name={"quantity"}
                                onChange={(e) => handleChangeSelectedIngredients(e, ing._id)}
                                value={ing.quantity}
                                required
                            />
                        </div>
                    )))
                }
                {/* выбор оборудования */}
                <p>Все оборудование</p>
                {equipment.map((eq) => (
                    <div key={eq._id}>
                        <button onClick={() => {addEquipment(eq)}}>{eq.name}</button>
                    </div>
                ))}
                <p>Добавленное оборужование</p>
                {   selectedIngredients.length === 0 ? (
                    <p>Нет добавленных ингредиентов</p>
                ) : (
                    selectedIngredients.map((ing) => (
                        <div key={ing._id} >
                            <button onClick={() => removeIngredient(ing)}>{ing.name}</button>
                            <input
                                min={1}
                                max={100000}
                                type={"number"}
                                placeholder={"Количество"}
                                name={"quantity"}
                                onChange={(e) => handleChangeSelectedIngredients(e, ing._id)}
                                value={ing.quantity}
                                required
                            />
                        </div>
                    )))
                }
                <p>Тип кухни</p>
                <select name={"kitchen"} onChange={handleChangeRecipe} defaultValue="">
                    <option disabled value="">Выберите кухню</option>
                    {kitchens.map((kitchen) => (
                        <option key={kitchen._id}>{kitchen.name}</option>
                    ))}
                </select>
                <p>Тип блюда</p>
                <select name={"type"} onChange={handleChangeRecipe} defaultValue="">
                    <option disabled value="">Выберите тип</option>
                    {types.map((type) => (
                        <option key={type._id}>{type.name}</option>
                    ))}
                </select>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <button type={"submit"}>Создать</button>
            </form>
        </div>
    )
}

export default CreateRecipePage