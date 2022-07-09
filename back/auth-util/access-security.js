const sessionRepository = require('../domain/session');
const User = require('../domain/user');

exports.checkSession = (req, res, next) => {

    if (!req.headers.authorization) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const username = getUserNameFromSession(req);

    if (!User.getUserByName(username)) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    next();
}

exports.getUserBySession = (req) => {
    const username = getUserNameFromSession(req);
    return User.getUserByName(username);
}

function getUserNameFromSession(req) {
    return req.headers.authorization.replace('Bearer ', '').split(':').shift();
}