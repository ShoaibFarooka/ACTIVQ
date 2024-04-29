const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    code: {
        type: String,
        default: ''
    },
    permissions: {
        type: [String],
        default: []
    },
    role: {
        type: String,
        default: 'employee'
    },
    photoSignature: {
        type: String,
        default: null
    }
},
    { timestamps: true }
);

//Create Model
const Users = new mongoose.model("User", userSchema);

module.exports = Users;