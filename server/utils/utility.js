function isValidURL(str) {
    try {
        new URL(str);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = {
    isValidURL
}