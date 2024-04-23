import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import {dbUrl, translit} from "../config";
import {getJwtAuthHeader} from "../functions";


const UserPage = () => {
    const [user, setUser] = useState({
        _id: 0,
        email: "",
        username: "",
        image: "",
        roles: []
    })

    const [currentUser, setCurrentUser] = useState("")
    const [needUpdate, setNeedUpdate] = useState(false)
    const [avatar, setAvatar] = useState("")
    const {id} = useParams()

    useEffect(() => {
        console.log()
        axios.get(dbUrl + `/user/me`,getJwtAuthHeader())
            .then(data => {
                setCurrentUser(data.data)
            })
            .catch(error => {
                console.error("Ошибка получения данных:", error.response.data.message);
            });
    }, [needUpdate])

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

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append('image', user.image);
        const response = await axios.put(dbUrl + '/user/' + currentUser._id, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response);
    }


    return (
        <>
            <p>{user._id}</p>
            <p>{user.username}</p>
            {user.roles.map((role) => (
                <p key={role}>role {role}</p>
            ))}
            {currentUser !== "" && currentUser._id=== user._id && <>
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