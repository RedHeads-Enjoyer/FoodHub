import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import {dbUrl, translit} from "../config";

const UserPage = () => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const [user, setUser] = useState({
        _id: 0,
        email: "",
        username: "",
        image: "",
        roles: []
    })
    const [avatar, setAvatar] = useState("")
    const {id} = useParams()

    useEffect(() => {
        axios
            .get(dbUrl + `/user/${id}`)
            .then(data => {
                setUser(data.data)
                console.log(data.data)
            })
            .catch(error => {
                console.error("Ошибка получения данных:", error.response.data.message);
            });
    }, [])

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Получаем выбранный файл изображения
        const newFileName = translit(file.name);
        const renamedFile = new File([file], newFileName, { type: file.type });

        if (file) {
            setUser(prevState => ({
                ...prevState,
                image: renamedFile // Обновляем состояние recipe, добавляя выбранный файл в качестве изображения
            }));

            let reader = new FileReader()
            reader.readAsDataURL(renamedFile)
            reader.onload = () => {
                setAvatar(reader.result)
            }
        }
    };

    const handleUpdate = () => {
    //     axios.put(dbUrl + '//' + id, changedData)
    //         .then(() => {
    //             setNeedData(prevState => !prevState);
    //         })
    //         .catch((error) => {
    //             // Обработка ошибок при удалении
    //             console.error('Error deleting recipe:', error);
    //         });
    }


    return (
        <>
            <p>{user._id}</p>
            <p>{user.username}</p>
            {user.roles.map((role) => (
                <p key={role}>role {role}</p>
            ))}
            {currentUser._id === user._id && <>
                <input
                    type="file"
                    accept={"image/*"}
                    onChange={handleImageChange}
                />
                {avatar === "" || avatar == null ? "" :
                    <img
                        style={{width: "200px"}}
                        src={avatar}
                    />
                }
                <button onClick={handleUpdate}>Сохранить изменения</button>
            </>}
        </>
    )
}

export default UserPage