let db = [];


const User = class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    static getUserByName(username) {
        return db.find(user => user.username === username);
    }
}

db.push(new User('tina', '1111'));
db.push(new User('john', '1234'));
db.push(new User('user', 'qwer'));
db.push(new User('admin', 'qwer'));


module.exports = User;