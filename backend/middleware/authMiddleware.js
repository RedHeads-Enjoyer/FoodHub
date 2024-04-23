const jwt = require('jsonwebtoken')
const {secret} = require('../config')
const User = require('../models/User')

module.exports = async function (req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
}