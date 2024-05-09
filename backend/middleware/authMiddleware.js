const jwt = require('jsonwebtoken')
const {secret} = require('../config')
const User = require('../models/User')
const BlackListedToken = require('../models/BlackListedToken')

module.exports = async function (req, res, next) {
    let token = req.header('Authorization')
    if (token === "" || token == null) {
        res.status(401).send({ error: 'Authorization token is missing or invalid' });
        return;
    }
    token = token.replace('Bearer ', '')
    try {
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id);
        const blackListedToken = await BlackListedToken.find({"token" : token})
        if (!user || blackListedToken.length > 0) {
            res.status(403).send({ error: 'Access forbidden. Your token is invalid or has expired.' });
            return;
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(500).send({ error: 'Internal server error123' });
    }
}