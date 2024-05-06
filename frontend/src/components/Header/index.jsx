import React, {useEffect, useState} from 'react';
import classes from "./styles.module.css";
import axios from "axios";
import {dbUrl} from "../../config";
import {getJwtAuthHeader, fetchImage} from "../../functions";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {changeStatus} from "../../slices/userSlice";

const Header = () => {
    const navigate = useNavigate()

    const dispatch = useDispatch();
    const userStatus = useSelector((state)=>state.user.status);

    useEffect(() => {
        console.log(userStatus)
    }, [userStatus])

    const [currentUser, setCurrentUser] = useState('')
    const [image, setImage] = useState('')
    const [menuStatus, setMenuStatus] = useState(false)

    useEffect(() => {
        if (userStatus === true) {
            axios.get(dbUrl + `/user/me`,getJwtAuthHeader())
                .then(data => {
                    setCurrentUser(data.data)
                })
                .catch(error => {
                    console.error("Ошибка получения данных:", error.response.data.message);
                });
        }
    }, [userStatus])

    useEffect(() => {
        if (currentUser !== '') {
            fetchImage(setImage, currentUser.image)
        }
    }, [currentUser])

    const changeMenuStatus = () => {
        setMenuStatus(prevState => !prevState)
    }

    const handleMenuExit = () => {
        axios.post(dbUrl + `/auth/logout`, {}, getJwtAuthHeader())
            .then(data => {
                console.log(data, 'ass')
                if (data.status === 200) {
                    setMenuStatus(false)
                    dispatch(changeStatus(false))
                    navigate('/login')
                }
            })
            .catch(error => {
                console.error("Ошибка при выходе: ", error.response.data.message);
            });
    }

    const handleMenuProfile = () => {
        setMenuStatus(false)
        navigate('/user/' + currentUser._id)
    }

    const handleMenuAddRecipe = () => {
        setMenuStatus(false)
        navigate('/createRecipe')
    }

      return (
          <header className={classes.header__wrapper}>
              <div className={classes.logo__wrapper}>
                  <h1 className={classes.name}>ЗРЯТЬ ЕДА</h1>
              </div>
              <div className={classes.search__bar__wrapper}>
                  <input
                      type={"text"}
                      placeholder={"Найти..."}
                      className={classes.search__bar}
                  />
                  <button>
                      <p>Найти</p>
                  </button>
              </div>

              {userStatus !== false ? <>
                  <div className={classes.user__wrapper} onClick={changeMenuStatus}>
                      <img className={classes.user__avatar} src={image}/>
                      <p className={classes.user__username}>{currentUser.username}</p>
                  </div>
                  {menuStatus === true &&
                      <div className={classes.menu__wrapper}>
                          <ul className={classes.list__wrapper}>
                              <li className={classes.menu__item__wrapper}>
                                  <div className={classes.menu__item}>
                                      <button onClick={handleMenuProfile}>Мой профиль</button>
                                  </div>
                              </li>
                              <li className={classes.menu__item__wrapper}>
                                  <div className={classes.menu__item}>
                                      <button onClick={handleMenuAddRecipe}>Добавить рецепт</button>
                                  </div>
                              </li>
                              <li className={classes.menu__item__wrapper}>
                                  <div className={classes.menu__item}>
                                      <button>Настройки</button>
                                  </div>
                              </li>
                              <li className={classes.menu__item__wrapper}>
                                  <div className={classes.menu__item}>
                                      <button onClick={handleMenuExit}>Выйти</button>
                                  </div>
                              </li>
                          </ul>
                      </div>
                  }
              </>: ""}

          </header>
    );
};

export default Header