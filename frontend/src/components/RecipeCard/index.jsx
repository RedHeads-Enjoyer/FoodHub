import React, { useState, useEffect } from 'react';
import classes from "./styles.module.css";
import axios from 'axios';
import {dbUrl} from "../../config";
import ImageTestPair from "../ImageTestPair";
import recipe_duration_clock from "../../images/recipe_duretion_clock.png"

const RecipeCard = ({recipe}) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get(dbUrl + '/image/' + recipe.image, {
                    responseType: 'blob'
                });
                const imageUrl = URL.createObjectURL(response.data);
                setImageUrl(imageUrl);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };
        fetchImage();

        return () => {
            URL.revokeObjectURL(imageUrl);
        };
    }, []);

    return (
        <div className={classes.card__wrapper}>
            <div className={classes.image__wrapper}>
                <img src={imageUrl} alt={recipe.name} />
            </div>
            <p className={classes.recipe__name}>{recipe.name}</p>
            <div className={classes.info__grid}>
                <p>{recipe.views} просмотра</p>
                <ImageTestPair image={recipe_duration_clock} text={"123"}/>
                <ImageTestPair text={"123"}/>
                <ImageTestPair text={"123"}/>
            </div>
        </div>
    );
};

export default RecipeCard