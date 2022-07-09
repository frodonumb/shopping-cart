const User = require('../domain/user');
const sessionRepository = require('../domain/session');

exports.authenticate = (req, res) => {
    let user;
    try {
        user = User.getUserByName(req.body.username);
    } catch (error) {
        res.status(404).json({ message: error.message });
        return;
    }

    if (user) {
        try {
            const session = sessionRepository.authenticate(user, req.body.password);
            res.status(201).json(session);
        } catch (error) {
            res.status(403).json({ message: error.message });
        }
    }
}
