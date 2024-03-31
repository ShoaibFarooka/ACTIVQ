const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    generalInfo: {
        type: String,
        default: ''
    },
},
    { timestamps: true }
);

//Create Model
const Clients = new mongoose.model("Client", clientSchema);

module.exports = Clients;