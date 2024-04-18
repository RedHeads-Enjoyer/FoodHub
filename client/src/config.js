const {jwtDecode} = require("jwt-decode");

const jwtToken = localStorage.getItem("token")
const decodedJwtToken = jwtDecode(jwtToken)

module.exports = {
    secret: "random_key_for_jwt_9461@2l",
    dbUrl: "http://localhost:5000/api",
    currentUser: {
        _id: decodedJwtToken.id,
        roles: decodedJwtToken.roles,
        username: decodedJwtToken.username
    },
    jwtTokenHeader: {
        headers: {
            Authorization: "Bearer " + jwtToken
        }
    }
}