let sessions = [];

function addSession(username) {
    const session = new Session(username);
    const index = sessions.findIndex(item => item.session.split(':')[0] === username);
    sessions.splice(index, 1, session);

    return session;
}

let Session = class Session {
    constructor(username) {
        this.session = username + ':' + Date.now();
    }
}

exports.authenticate = (user, password) => {
    if (user.password !== password) {
        throw Error('Password does not match!');
    }
    return addSession(user.username);
};

exports.getSession = (session) => {
    let activeSession;

    activeSession = sessions.find(item => item.session === session);

    return activeSession;
}

let session = new Session('');
session.session = 'tina:1657338128492';
sessions.push(session);
