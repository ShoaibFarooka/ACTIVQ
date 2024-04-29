const mongoose = require('mongoose');

// Define sub-schema for calibration table
const CalibrationTableSchema = new mongoose.Schema({
    calibrationTemperature: { type: Number },
    referenceTemperatureInitial: {
        type: [Number],
        default: Array(10).fill(null), // To initialize with null values
        required: true
    },
    calibratedTemperature: {
        type: [Number],
        default: Array(10).fill(null),
        required: true
    },
    referenceTemperatureFinal: {
        type: [Number],
        default: Array(10).fill(null),
        required: true
    }
});

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
    type: {
        type: String,
        required: true
    },
    accuracyOfMeasurements: {
        type: Number
    },
    category: {
        type: String,
        required: true
    },
    parametersTable: {
        degreeC: {
            type: [String],
            default: Array(6).fill(""),
            required: true
        },
        correction: {
            type: [String],
            default: Array(6).fill(""),
            required: true
        },
        u2k: {
            type: [String],
            default: Array(6).fill(""),
            required: true
        },
    },
    claibrationDetails: [
        {
            createdAt: {
                type: Number,
                default: Date.now,
                required: true
            },
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
            referenceEquipment: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Equipment',
                required: true,
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
            enviromentalConditions: {
                temperature:[
                    { type: Number, required: true },
                    { type: Number, required: true }
                ],
                relativeHumidity:[
                    { type: Number, required: true },
                    { type: Number, required: true }
                ],
                atmosphericPressure:[
                    { type: Number, required: true },
                    { type: Number, required: true }
                ]
            },
            bathParameters: {
                bathStability: [
                    { type: Number, required: true },
                    { type: Number, required: true }
                ],
                bathHomogeneousness: [
                    { type: Number, required: true },
                    { type: Number, required: true }
                ],
            },
            calibrationTables: [CalibrationTableSchema],
            comments: { type: String },
            reportVerification: { 
                status: { type: Boolean },
                approvedBy: { 
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    default: null
                }
            }
        }
    ],
},
    { timestamps: true }
);

//Create Model
const Equipments = new mongoose.model("Equipment", equipmentSchema);

module.exports = Equipments;