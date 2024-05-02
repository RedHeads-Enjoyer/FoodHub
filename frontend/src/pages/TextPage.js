import React, {useState} from "react";
import InputTextArea from "../components/InputTextArea";


const UserPage = () => {
    const [recipe, setRecipe] = useState({
        name: "",
        description: "",
        image: "",
        difficult: 1,
        ingredients: [],
        kitchenID: "",
        typeID: "",
        equipment: [],
        steps: []
    })

    const handleChangeRecipe = ({currentTarget: input}) => {
        setRecipe({...recipe, [input.name]: input.value})
    }
    return (
        <>
            <InputTextArea
                label={"Описание рецепта"}
                placeholder={"Описание"}
                name={"description"}
                onChange={handleChangeRecipe}
                value={recipe.description}
                required/>
        </>
    )
}

export default UserPage