import {useState} from "react";
import axios from "axios";
import {dbUrl} from "../config";
import {Link, useNavigate} from "react-router-dom";
import classes from "./loginPage.module.css";
import Button from "../components/Button";
import {getJwtAuthHeader} from "../functions";
import InputText from "../components/Input";


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

    const checkData = () => {
        let errors = []
        const password = data.password
        if (password.length < 8) {
            errors.push("Пароль должен содержать от 8 до 16 символов")
        }
        const symbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/
        if (!symbols.test(password)) {
            errors.push(`Пароль должен содержать минимум один из специальных символов !"#$%&'()*+,-./:;<=>?@[]^_{|}~`)
        }
        const numbers = /[0-9]/
        if (!numbers.test(password)) {
            errors.push(`Пароль должен содержать минимум одну цифру`)
        }
        const capitals = /[A-Z]/
        if (!capitals.test(password)) {
            errors.push(`Пароль должен содержать минимум одну заглавную букву`)
        }
        console.log(errors)
        return errors.length === 0
    }

    axios.defaults.withCredentials = true;
    const handleSubmit = async (e) => {
        // if (!checkData()) return false
        e.preventDefault()
        try {
            await axios.post(dbUrl + '/auth/login', data);
            const userResponse = await axios.get(dbUrl + '/user/me', getJwtAuthHeader());
            navigate('/user/' + userResponse.data._id);
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.message)
            } else if (error.request.request.request) {
                console.log('Ошибка запроса:', error.request)
            } else {
                console.log('Ошибка:', error.message)
            }
        }
    }

    return (
        <div className={classes.login__wrapper}>
            <form onSubmit={handleSubmit}>
                <div className={classes.label__wrapper}>
                    <p className={classes.label__text}>Вход</p>
                </div>
                <p>{error}</p>
                <div className={classes.form__wrapper}>
                    <div className={classes.input__text__wrapper}>
                        <InputText
                            label={"Email"}
                            type={"email"}
                            placeholder={"example@mail.ru"}
                            name={"email"}
                            onChange={handleChange}
                            value={data.email}
                        />
                    </div>
                    <div className={classes.input__text__wrapper}>
                        <InputText
                            label={"Пароль"}
                            type={"password"}
                            placeholder={"changeme!12_"}
                            name={"password"}
                            onChange={handleChange}
                            value={data.password}
                        />
                    </div>
                    <div className={classes.button__wrapper}>
                        <Button name={"Войти"} onClick={handleSubmit}/>
                    </div>
                </div>
                <div className={classes.link__wrapper}>
                    <Link to={'/registration'}><p className={classes.link__text}>Зарегистрироваться</p></Link>
                </div>
            </form>
        </div>
    )
}

export default LoginPage