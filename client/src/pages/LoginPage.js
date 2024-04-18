import React from "react";
import {useState} from "react";
import axios from "axios";
import {currentUser, dbUrl, jwtToken} from "../config";
import {Link, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const url = dbUrl + '/auth/login'
            const response = await axios.post(url, data)
            localStorage.setItem("token", response.data.token)
            navigate(`/profile/${currentUser._id}`)
        } catch (error) {
            if (error.response) {
                // Здесь обрабатываем ошибку на уровне ответа от сервера
                console.log(error.response.data.message)
                setError(error.response.data.message)
            } else if (error.request.request.request) {
                // Здесь обрабатываем ошибку на уровне запроса
                console.log('Ошибка запроса:', error.request)
            } else {
                // Здесь обрабатываем другие типы ошибок
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