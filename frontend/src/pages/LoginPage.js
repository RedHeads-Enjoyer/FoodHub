import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {currentUser, dbUrl} from "../config";
import {Link, useNavigate} from "react-router-dom";


const LoginPage = () => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState("")

    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name]: input.value})
    }

    axios.defaults.withCredentials = true;
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(dbUrl + '/auth/login', data)
                .then((data) => {
                    navigate('/user/' + data.data._id)
                })
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.message)
                setError(error.response.data.message)
            } else if (error.request.request.request) {
                console.log('Ошибка запроса:', error.request)
            } else {
                console.log('Ошибка:', error.message)
            }
        }
    }

    return (
        <>
            <Link to={'/registration'}>Регистрация</Link>
            <form onSubmit={handleSubmit}>
                <p>Вход</p>
                <p>{error}</p>
                <input
                    type={"text"}
                    placeholder={"Email"}
                    name={"email"}
                    onChange={handleChange}
                    value={data.email}
                    required
                />
                <input
                    type={"text"}
                    placeholder={"Пароль"}
                    name={"password"}
                    onChange={handleChange}
                    value={data.password}
                    required
                />
                <button type={"submit"}>Войти</button>
            </form>
        </>
    )
}

export default LoginPage