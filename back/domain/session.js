exports.authenticate = (user, password) => {
    if (user.password !== password) {
        throw Error('Password does not match!');
    }
    return `Bearer ${user.username}:${Date.now()}`;
};