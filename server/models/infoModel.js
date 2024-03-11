const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    telephone: {
        type: String,
    },
    logo: {
        type: String,
    },
    seal1: {
        type: String,
    },
    seal2: {
        type: String,
    },
    code: {
        type: String,
    },
},
    { timestamps: true }
);

//Create Model
const Info = new mongoose.model("Info", infoSchema);

module.exports = Info;