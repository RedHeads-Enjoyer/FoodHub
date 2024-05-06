import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {dbUrl} from "../config";
import {Link} from "react-router-dom";
import classes from './SearchPage.module.css'
import RecipeCarp from "../components/RecipeCard";

const SearchPage = () => {
    const [recipes, setRecipes] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [fetching, setFetching] = useState(true)
    const [totalCount, setTotalCount] = useState(0)

    useEffect(() => {
        if (!fetching) return
        axios
            .get(dbUrl + `/recipe?_limit=20&_page=${currentPage}`)
            .then(response => {
                setRecipes([...recipes, ...response.data.recipes]);
                setCurrentPage(currentPage + 1);
                setTotalCount(response.data.totalCount);
            }).finally(() => setFetching(false))
    }, [fetching])

    useEffect(() => {
        console.log(totalCount)
    }, [totalCount])

    useEffect(() => {
        const recipesWrapper = document.querySelector(`.${classes.recipes__wrapper}`);
        recipesWrapper.addEventListener('scroll', scrollHandler)
        return function () {
            recipesWrapper.removeEventListener('scroll', scrollHandler)
        }
    }, [recipes, totalCount])

    const scrollHandler = (e) => {
        if (e.target.scrollHeight - (e.target.scrollTop + e.target.offsetHeight) < 100 && recipes.length < totalCount) {
            setFetching(true)
        }
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