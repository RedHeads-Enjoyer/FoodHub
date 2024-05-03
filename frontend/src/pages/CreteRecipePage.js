import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {dbUrl, translit} from "../config";
import classes from "./CreateRecipePage.module.css"
import InputText from "../components/InputText";
import InputTextArea from "../components/InputTextArea";
import Select from "../components/Select";
import InputNumber from "../components/InputNumber";
import Switch from "../components/Switch";
import IngredientsList from "../components/IngredientsList";
import EquipmentList from "../components/EquipmentList";


const CreateRecipePage = () => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const [recipe, setRecipe] = useState({
        name: "",
        description: "",
        image: "",
        difficult: 5,
        ingredients: [],
        kitchenID: "",
        typeID: "",
        equipment: [],
        authorID: currentUser._id,
        steps: [],
        visible: true
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

    const handleChangeRecipeType = (id) => {
        setRecipe({
            ...recipe,
            typeID: id,
        })
    }

    const handleChangeRecipeKitchen = (id) => {
        setRecipe({
            ...recipe,
            kitchenID: id,
        })
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
            formData.append('ingredients', recipe.ingredients);
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
        <div className={classes.createRecipePage__wrapper}>
            <form onSubmit={handleSubmit}>
                <p className={classes.page__label}>Создание рецепта</p>
                <div className={classes.recipe__info__wrapper}>
                    <div className={classes.main__info__wrapper}>
                        <InputText
                            label={"Название рецепта"}
                            type={"text"}
                            placeholder={"Введите название"}
                            name={"name"}
                            onChange={handleChangeRecipe}
                            value={recipe.name}
                        />
                        <InputTextArea
                            label={"Описание рецепта"}
                            placeholder={"Описание"}
                            name={"description"}
                            onChange={handleChangeRecipe}
                            value={recipe.description}
                            required
                        />
                        <div className={classes.flex__wrapper}>
                            <Select
                                label={"Тип кухни"}
                                name={"kitchenID"}
                                onChange={handleChangeRecipeKitchen}
                                options={kitchens}
                                link = '/kitchen'
                            />
                            <Select
                                label={"Тип блюда"}
                                name={"typeID"}
                                onChange={handleChangeRecipeType}
                                options={types}
                                link = '/type'
                            />
                        </div>
                        <div className={classes.flex__wrapper}>
                            <InputNumber
                                max={10}
                                min={1}
                                label={"Сложность"}
                                name={"difficult"}
                                value={recipe.difficult}
                                onChange={handleChangeRecipe}
                                required
                            />
                            <Switch
                                label={"Доступ"}
                                first={"Для всех"}
                                second={"Только мне"}
                                name={"visible"}
                                onChange={handleChangeRecipe}
                                value={recipe.visible}
                            />
                        </div>
                    </div>
                    <div className={classes.ingredients__wrapper}>
                        <IngredientsList
                            label={"Ингредиенты"}
                            addedIngredients={recipe.ingredients}
                            allIngredients={ingredients}
                            setTarget={handleChangeRecipe}
                            setAllIngredients={setIngredients}
                            name={"ingredients"}
                        />
                    </div>
                    <div className={classes.equipment__wrapper}>
                        <EquipmentList
                            label={"Оборудование"}
                            addedEquipment={recipe.equipment}
                            allEquipment={equipment}
                            setTarget={handleChangeRecipe}
                            setAllEquipment={setEquipment}
                            name={"equipment"}
                        />
                    </div>
                </div>


                {/*<input*/}
                {/*    type="file"*/}
                {/*    accept={"image/*"}*/}
                {/*    onChange={handleImageChange}*/}
                {/*/>*/}
                {/*{image === "" || image == null ? "" :*/}
                {/*    <img*/}
                {/*        style={{width: "200px"}}*/}
                {/*        src={image}*/}
                {/*    />*/}
                {/*}*/}

                {/*<p>Все ингредиенты</p>*/}
                {/*{ingredients.map((ing) => (*/}
                {/*    <div key={ing._id}>*/}
                {/*        <button onClick={() => {addIngredient(ing)}}>{ing.name}</button>*/}
                {/*    </div>*/}
                {/*))}*/}
                {/*/!* выбор ингредиентов *!/*/}
                {/*<p>Добавленные ингредиенты</p>*/}
                {/*{   selectedIngredients.length === 0 ? (*/}
                {/*        <p>Нет добавленных ингредиентов</p>*/}
                {/*    ) : (*/}
                {/*    selectedIngredients.map((ing) => (*/}
                {/*        <div key={ing._id} >*/}
                {/*            <button onClick={() => removeIngredient(ing)}>{ing.name}</button>*/}
                {/*            <input*/}
                {/*                min={1}*/}
                {/*                max={100000}*/}
                {/*                type={"number"}*/}
                {/*                placeholder={"Количество"}*/}
                {/*                name={"quantity"}*/}
                {/*                onChange={(e) => handleChangeSelectedIngredientsQuantity(e, ing._id)}*/}
                {/*                value={ing.quantity}*/}
                {/*                required*/}
                {/*            />*/}
                {/*        </div>*/}
                {/*    )))*/}
                {/*}*/}
                {/*/!* выбор оборудования *!/*/}
                {/*<p>Все оборудование</p>*/}
                {/*{equipment.map((eq) => (*/}
                {/*    <div key={eq._id}>*/}
                {/*        <button onClick={() => {addEquipment(eq)}}>{eq.name}</button>*/}
                {/*    </div>*/}
                {/*))}*/}
                {/*<p>Добавленное оборужование</p>*/}
                {/*{   selectedEquipment.length === 0 ? (*/}
                {/*    <p>Нет добавленного оборудования</p>*/}
                {/*) : (*/}
                {/*    selectedEquipment.map((eq) => (*/}
                {/*        <div key={eq._id} >*/}
                {/*            <button onClick={() => removeEquipment(eq)}>{eq.name}</button>*/}
                {/*        </div>*/}
                {/*    )))*/}
                {/*}*/}

                {/*/!* Создание этапов *!/*/}
                {/*{recipe.steps.map((step, index) => (*/}
                {/*    <div key={`step${index}`}>*/}
                {/*        <p>{`Этап ${index + 1}`}</p>*/}
                {/*        <input*/}
                {/*            min={1}*/}
                {/*            max={100000}*/}
                {/*            type={"number"}*/}
                {/*            placeholder={"Количество"}*/}
                {/*            name={"duration"}*/}
                {/*            onChange={(e) => handleChangeRecipeStepDuration(e, index)}*/}
                {/*            value={step.duration}*/}
                {/*            required*/}
                {/*        />*/}
                {/*        <textarea*/}
                {/*            rows="5"*/}
                {/*            cols="40"*/}
                {/*            placeholder={"Описание"}*/}
                {/*            name={"description"}*/}
                {/*            onChange={(e) => handleChangeRecipeStepDescription(e, index)}*/}
                {/*            value={step.description}*/}
                {/*            required*/}
                {/*        />*/}
                {/*        <button onClick={(e) => handleRecipeStepDelete(e, index)}>Удалить этап</button>*/}
                {/*    </div>*/}
                {/*))}*/}
                {/*<div>*/}
                {/*    <button onClick={addRecipeStep}>Добавить этап</button>*/}
                {/*</div>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<button type={"submit"}>Создать</button>*/}
            </form>
        </div>
    )
}

export default CreateRecipePage