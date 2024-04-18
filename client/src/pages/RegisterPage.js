import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {dbUrl} from "../config";
import {Link, useNavigate} from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState([])

    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name]: input.value})
    }

    useEffect(() => {
        console.log(errors)
    }, [errors])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const url = dbUrl + '/auth/registration'
            const response = await axios.post(url, data)
            navigate("/login")
        } catch (error) {
            if (error.response) {
                setErrors([error.response.data.message])
                if (error.response.data.hasOwnProperty("errors")) {
                    error.response.data.errors.errors.map((err) => {
                        setErrors(errors => [...errors, err.msg])
                    })
                }
            } else if (error.request.request.request) {
                console.log('Ошибка запроса:', error.request)
            } else {
                console.log('Ошибка:', error.message)
            }
        }
    }

    return (
        <>
            <Link to={'/login'}>вход</Link>
            <form onSubmit={handleSubmit}>
                <p>Регистрация</p>
                <ul>
                    {errors &&  errors.map((err) =>
                        <li>{err}</li>)}
                </ul>
                <input
                    type={"text"}
                    placeholder={"Имя"}
                    name={"username"}
                    onChange={handleChange}
                    value={data.username}
                    required
                />
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
                <button type={"submit"}>Зарегистрироваться</button>
            </form>
        </>
    )
}

export default LoginPage