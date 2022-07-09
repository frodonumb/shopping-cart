const sessionRepository = require('../domain/session');
const User = require('../domain/user');

exports.checkSession = (req, res, next) => {

    if (!req.headers.session) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    if (!sessionRepository.getSession(req.headers.session)) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    next();
}

exports.getUserBySession = (req) => {
    const session = sessionRepository.getSession(req.headers.session);
    return User.getUserByName(session.session.split(':')[0]);  
}