import React, { useState, useEffect } from 'react';
import classes from "./styles.module.css";
import axios from 'axios';
import {dbUrl} from "../../config";
import ImageTestPair from "../ImageTestPair";
import recipe_duration_clock from "../../images/recipe_duration_clock.png"
import recipe_rating from "../../images/recipe_rating.svg"
import recipe_view from "../../images/recipe_view.png"
import recipe_difficult from "../../images/recipe_difficult.png"
import UserImageName from "../UserImageName";
import steps from "../Steps";
import {Link} from "react-router-dom";

const RecipeCard = ({recipe}) => {
    const [imageUrl, setImageUrl] = useState('');
    const [duration, setDuration] = useState(0)

    useEffect(() => {
        let tmpDuration = 0
        console.log(recipe)
        for (let i = 0; i < recipe.steps; i++) {
            tmpDuration += parseInt(recipe.steps[i].duration)
        }
        setDuration(tmpDuration)

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
            <Link to={'/recipe/' + recipe._id}>
                <div className={classes.image__wrapper}>
                    <img src={imageUrl} alt={recipe.name} />
                </div>
                <p className={classes.recipe__name}>{recipe.name}</p>
                <div className={classes.info__grid}>
                    <ImageTestPair image={recipe_rating} text={recipe.ratingVotes !== 0 ? recipe.ratingSum / recipe.ratingVotes : "0"}/>
                    <ImageTestPair image={recipe_view} text={recipe.views}/>
                    <ImageTestPair image={recipe_difficult} text={recipe.difficult}/>
                    <ImageTestPair image={recipe_duration_clock} text={duration}/>
                </div>
            </Link>
            <div className={classes.user__wrapper}>
                <UserImageName id={recipe.authorID}/>
            </div>
        </div>
    );
};

export default RecipeCard