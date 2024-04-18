import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {currentUser} from "../config";
import {Link, useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";

const LoginPage = () => {
    const [data, setData] = useState({
        _id: 0,
        email: "",
        username: "",
        roles: []
    })
    const {id} = useParams()

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/auth/users/${id}`)
            .then(data => {
                setData(data.data)
                console.log(data.data)
            })
            .catch(error => {
                console.error("Ошибка получения данных:", error.response.data.message);
            });
    }, [])

    return (
        <>
            <p>{data._id}</p>
            <p>{data.username}</p>
            {data.roles.map((role) => (
                <p key={role}>role {role}</p>
            ))}
            {currentUser._id === data._id && <p>Это твоя страничка</p>}
        </>
    )
}

export default LoginPage