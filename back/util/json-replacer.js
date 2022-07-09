exports.cartInfoReplacer = (key, value) => {
    switch (key) {
        case 'user':
        case 'img':
        case 'stock':
            return undefined;
        default:
            return value;
    }
}

exports.repace = (obj, replacer) => {
    return JSON.parse(JSON.stringify(obj, replacer));
}