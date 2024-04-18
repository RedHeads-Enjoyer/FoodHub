const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            return next();
        }

        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(403).json({ message: "Пользователь не авторизован" });
            }

            const decodedToken = jwt.verify(token, secret);
            // Получение ip отправителя и цели
            const userIdFromToken = decodedToken.id;
            const userIdFromParams = req.params.id;

            // Поиск роли у отправителя
            const userRoles = decodedToken.roles
            let hasRole = false
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true
                }
            })

            if (userIdFromToken !== userIdFromParams && !hasRole) {
                return res.status(403).json({ message: "У вас нет доступа"});
            }

            return next();
        } catch (e) {
            console.log(e);
            return res.status(403).json({ message: "Пользователь не авторизован" });
        }
    };
};