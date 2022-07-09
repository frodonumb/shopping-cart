const User = require('../domain/user');
const sessionRepository = require('../domain/session');

exports.authenticate = (req, res) => {
    
    if (!req.body || !req.body.username) {
        res.status(400).json({ message: 'Validation error', fields: ['username'] });
        return;
    }

    const user = User.getUserByName(req.body.username);
    
    if (user) {
        try {
            const session = sessionRepository.authenticate(user, req.body.password);
            res.status(201).json({token: session});
        } catch (error) {
            res.status(403).json({ message: error.message });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
        return;
    }
}
