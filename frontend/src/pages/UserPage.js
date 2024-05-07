import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import {dbUrl} from "../config";
import classes from "./UserPage.module.css";
import image_placeholder from "../images/image_placeholder.svg"


const UserPage = () => {
    const [user, setUser] = useState({
        username: "",
        image: "",

    })

    const [avatar, setAvatar] = useState("")
    const {id} = useParams()

    useEffect(() => {
        axios
            .get(dbUrl + `/user/${id}`)
            .then(data => {
                setUser(data.data)
            })
            .catch(error => {
                console.error("Ошибка получения данных:", error.response.data.message);
            });
    }, [])

    useEffect(() => {
        if (user.image !== "") {
            const fetchImage = async () => {
                try {
                    const response = await axios.get(dbUrl + '/image/' + user.image, {
                        responseType: 'blob'
                    });
                    const avatar = URL.createObjectURL(response.data);
                    setAvatar(avatar);
                } catch (error) {
                    console.error('Error fetching image:', error);
                }
            };
            fetchImage();

            return () => {
                URL.revokeObjectURL(avatar);
            };
        }
    }, [user]);


    return (
        <div className={classes.profile__wrapper}>
            <p className={classes.page__label}>Профиль</p>
            <div className={classes.user__info__wrapper}>
                <div className={classes.avatar__wrapper}>
                    {avatar === "" || avatar == null ?
                        <img
                            src={image_placeholder}
                        />
                        :
                        <img
                            src={avatar}
                        />
                    }
                </div>
                <p>{user.username}</p>
            </div>
            <p className={classes.recipes__label}>Рецепты пользователя</p>

        </div>
    )
}

export default UserPage

