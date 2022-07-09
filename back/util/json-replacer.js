exports.userReplacer = (key, value) => {
    switch (key) {
        case 'user':
            return undefined;
        default:
            return value;
    }
}

exports.repace = (obj, replacer) => {
    return JSON.parse(JSON.stringify(obj, replacer));
}