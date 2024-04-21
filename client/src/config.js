module.exports = {
    currentUser: JSON.parse(localStorage.getItem("currentUser")),
    dbUrl: "http://localhost:5000/api",
    jwtTokenHeader: {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    }
}