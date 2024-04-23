import React, {useEffect, useState} from 'react';
import classes from "./styles.module.css";
import UserImageName from "../UserImageName";
import axios from "axios";
import {dbUrl} from "../../config";
import {getJwtAuthHeader, fetchImage} from "../../functions";

const Header = () => {
    const [currentUser, setCurrentUser] = useState('')
    const [image, setImage] = useState('')

    useEffect(() => {
        console.log()
        axios.get(dbUrl + `/user/me`,getJwtAuthHeader())
            .then(data => {
                setCurrentUser(data.data)
            })
            .catch(error => {
                console.error("Ошибка получения данных:", error.response.data.message);
            });
    }, [])

    useEffect(() => {
        if (currentUser !== '') {
            fetchImage(setImage, currentUser.image)
        }
    }, [currentUser])

      return (
          <header>
              <h1 className={classes.name}>ЗРЯТЬ ЕДА</h1>
          </header>
    );
};

export default Header