const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        default: null
    },
    code: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    manufacturer: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    serialNo: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    referenceTable: {
        degreeC: [],
        correction: [],
        u2k: [],
    },
    claibrationDetails: [
        {
            certificateNo: {
                type: String,
                required: true
            },
            dateOfReceipt: {
                type: Date,
                required: true
            },
            dateOfCalibration: {
                type: Date,
                required: true
            },
            dateOfIssue: {
                type: Date,
                required: true
            },
            workOrderNo: {
                type: String,
                required: true
            },
            placeOfCalibration: {
                type: String,
                required: true
            },
            calibratedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            nextProposedCalibrationDuration: {
                type: String,
                required: true
            },
        }
    ],
},
    { timestamps: true }
);

//Create Model
const Equipments = new mongoose.model("Equipment", equipmentSchema);

module.exports = Equipments;