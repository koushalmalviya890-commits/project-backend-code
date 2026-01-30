const Cryptr = require("cryptr");
const env = require('dotenv').config();
const secret_key = "b238fe7be931a046f99053a6a82c25eadb647dbc6354eebf2b8e7ef4ed1f91f7";
const cryptr = new Cryptr(secret_key, { pbkdf2Iterations: 10000, saltLength: 10 });

function encrypt(value) {
    return cryptr.encrypt(value);
}

function decrypt(value) {
    return parseInt(cryptr.decrypt(value));
}

module.exports = {
    encrypt,
    decrypt,
};
