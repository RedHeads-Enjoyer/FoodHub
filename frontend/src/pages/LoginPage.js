import {useState} from "react";
import axios from "axios";
import {dbUrl} from "../config";
import {Link, useNavigate} from "react-router-dom";
import classes from "./loginPage.module.css";
import Button from "../components/Button";


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
        <div className={classes.login__wrapper}>
            <Link to={'/registration'}>Регистрация</Link>
            <form onSubmit={handleSubmit}>
                <div className={classes.form__wrapper}>
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
                    <Button name={"Войти"} onClick={handleSubmit}/>
                </div>
            </form>
        </div>
    )
}

export default LoginPage