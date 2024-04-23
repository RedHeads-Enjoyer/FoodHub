import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {dbUrl, translit} from "../config";


const CreateRecipePage = () => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const [recipe, setRecipe] = useState({
        name: "",
        description: "",
        image: "3",
        difficult: 1,
        ingredients: [],
        // comments: [],
        kitchenID: "",
        typeID: "",
        equipment: [],
        authorID: currentUser._id,
        steps: []
    })

    const [selectedIngredients, setSelectedIngredients] = useState([])
    const [ingredients, setIngredients] = useState([])
    const [equipment, setEquipment] = useState([])
    const [selectedEquipment, setSelectedEquipment] = useState([])
    const [kitchens, setKitchens] = useState([])
    const [types, setTypes] = useState([])
    const [image, setImage] = useState("")


    useEffect(() => {
        axios
            .get(dbUrl + '/ingredient')
            .then(data => {
                setIngredients(data.data)
                }
            )

        axios
            .get(dbUrl + '/kitchen')
            .then(data => {
                    setKitchens(data.data)
                }
            )

        axios
            .get(dbUrl + '/type')
            .then(data => {
                    setTypes(data.data)
                }
            )

        axios
            .get(dbUrl + '/equipment')
            .then(data => {
                    setEquipment(data.data)
                }
            )

        console.log(recipe.authorID)
    }, [])


    const handleChangeRecipe = ({currentTarget: input}) => {
        setRecipe({...recipe, [input.name]: input.value})
    }

    const handleChangeSelectedIngredientsQuantity = (e, ingId) => {
        const { name, value } = e.target;
        setSelectedIngredients(prevIngredients => {
            return prevIngredients.map(ing => {
                if (ing._id === ingId) {
                    return { ...ing, [name]: value };
                }
                return ing;
            });
        });
    };



    const handleChangeSelectedIngredients = () => {
        let recipeIngredients = []
        selectedIngredients.forEach((ingredient) => {
            recipeIngredients.push({
                ingredientID: ingredient._id,
                quantity: parseInt(ingredient.quantity)
            })
        })
        setRecipe({
            ...recipe,
            ingredients: recipeIngredients,
        })
    }

    const handleChangeSelectedEquipment = () => {
        let recipeEquipment = []
        selectedEquipment.forEach((equipment) => {
            recipeEquipment.push(String(equipment._id))
        })
        setRecipe({
            ...recipe,
            equipment: recipeEquipment,
        })
    }

    const handleChangeRecipeType = (e) => {
        const selectedType = types.find(type => type.name === e.target.value);
        setRecipe({
            ...recipe,
            typeID: selectedType._id,
        })
    }

    const handleChangeRecipeKitchen = (e) => {
        let selectedKitchen = kitchens.find(kitchen => kitchen.name === e.target.value)
        setRecipe({
            ...recipe,
            kitchenID:  selectedKitchen._id,
        })
    }

    const addIngredient = (e) => {
        setIngredients(ingredients.filter(ing => ing._id !== e._id))
        setSelectedIngredients([...selectedIngredients, {...e, quantity: 1}])
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

    const addRecipeStep = (e) => {
        e.preventDefault()
        setRecipe({...recipe, steps: [...recipe.steps, {
                description: "",
                duration: ""
            }]})
    }

    const handleChangeRecipeStepDescription = (e, index) => {
        const { name, value } = e.target;
        setRecipe(prevRecipe => {
            const updatedSteps = [...prevRecipe.steps];
            updatedSteps[index][name] = value;
            return { ...prevRecipe, steps: updatedSteps };
        });
    }

    const handleChangeRecipeStepDuration = (e, index) => {
        const { name, value } = e.target;
        setRecipe(prevRecipe => {
            const updatedSteps = [...prevRecipe.steps];
            updatedSteps[index][name] = parseInt(value);
            return { ...prevRecipe, steps: updatedSteps };
        });
    };

    const handleRecipeStepDelete = (e, index) => {
        e.preventDefault()
        setRecipe(prevRecipe => {
            let updatedSteps = [...prevRecipe.steps];
            updatedSteps.splice(index, 1)
            return { ...prevRecipe, steps: updatedSteps };
        });
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Получаем выбранный файл изображения
        const newFileName = translit(file.name);
        const renamedFile = new File([file], newFileName, { type: file.type });

        if (file) {
            setRecipe(prevRecipe => ({
                ...prevRecipe,
                image: renamedFile // Обновляем состояние recipe, добавляя выбранный файл в качестве изображения
            }));

            let reader = new FileReader()
            reader.readAsDataURL(renamedFile)
            reader.onload = () => {
                setImage(reader.result)
            }
        }
    };

    useEffect(() => {
        console.log(recipe)
    }, [recipe])

    useEffect(() => {
        handleChangeSelectedIngredients()
    }, [selectedIngredients])

    useEffect(() => {
        handleChangeSelectedEquipment()
    }, [selectedEquipment])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('image', recipe.image); // Используем выбранный файл из состояния recipe
            formData.append('name', recipe.name);
            formData.append('description', recipe.description);
            formData.append('difficult', recipe.difficult);
            formData.append('kitchenID', recipe.kitchenID);
            formData.append('typeID', recipe.typeID);
            formData.append('equipment', recipe.equipment);
            formData.append('steps', recipe.steps);
            formData.append('authorID', recipe.authorID);


            const url = dbUrl + '/recipe';
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response);
        } catch (error) {
            if (error.response) {
                // Здесь обрабатываем ошибку на уровне ответа от сервера
                console.log(error.response.data.message);
            } else if (error.request) {
                // Здесь обрабатываем ошибку на уровне запроса
                console.log('Ошибка запроса:', error.request);
            } else {
                // Здесь обрабатываем другие типы ошибок
                console.log('Ошибка:', error.message);
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p>Создание рецепта</p>
                <input
                    type={"text"}
                    placeholder={"Название"}
                    name={"name"}
                    onChange={handleChangeRecipe}
                    value={recipe.name}
                    required
                />
                <input
                    type="file"
                    accept={"image/*"}
                    onChange={handleImageChange}
                />
                {image === "" || image == null ? "" :
                    <img
                        style={{width: "200px"}}
                        src={image}
                    />
                }

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
                                onChange={(e) => handleChangeSelectedIngredientsQuantity(e, ing._id)}
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
                {   selectedEquipment.length === 0 ? (
                    <p>Нет добавленного оборудования</p>
                ) : (
                    selectedEquipment.map((eq) => (
                        <div key={eq._id} >
                            <button onClick={() => removeEquipment(eq)}>{eq.name}</button>
                        </div>
                    )))
                }
                <p>Тип кухни</p>
                <select name={"kitchenID"} onChange={handleChangeRecipeKitchen} defaultValue="">
                    <option disabled value="">Выберите кухню</option>
                    {kitchens.map((kitchen) => (
                        <option key={kitchen._id}>{kitchen.name}</option>
                    ))}
                </select>
                <p>Тип блюда</p>
                <select name={"typeID"} onChange={handleChangeRecipeType} defaultValue="">
                    <option disabled value="">Выберите тип</option>
                    {types.map((type) => (
                        <option key={type._id}>{type.name}</option>
                    ))}
                </select>
                {/* Создание этапов */}
                {recipe.steps.map((step, index) => (
                    <div key={`step${index}`}>
                        <p>{`Этап ${index + 1}`}</p>
                        <input
                            min={1}
                            max={100000}
                            type={"number"}
                            placeholder={"Количество"}
                            name={"duration"}
                            onChange={(e) => handleChangeRecipeStepDuration(e, index)}
                            value={step.duration}
                            required
                        />
                        <textarea
                            rows="5"
                            cols="40"
                            placeholder={"Описание"}
                            name={"description"}
                            onChange={(e) => handleChangeRecipeStepDescription(e, index)}
                            value={step.description}
                            required
                        />
                        <button onClick={(e) => handleRecipeStepDelete(e, index)}>Удалить этап</button>
                    </div>
                ))}
                <div>
                    <button onClick={addRecipeStep}>Добавить этап</button>
                </div>
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