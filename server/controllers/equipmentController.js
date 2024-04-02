const User = require("../models/userModel");
const Equipment = require("../models/equipmentModel");
const nodemailer = require("nodemailer"); 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD
    }
});


const GetEquipments = async (req, res) => {
    try {
        const operatorId = res.locals.payload.id;
        const operator = await User.findById(operatorId);
        if (operator?.role === 'admin' || operator?.role === 'manager' || operator?.role === 'employee') {
            const equipments = await Equipment.find({}, { createdAt: 0, updatedAt: 0 }).populate('owner')
                .populate({
                    path: 'claibrationDetails.calibratedBy',
                    select: 'name'
                });
            if (equipments && equipments.length > 0) {
                return res.status(200).json({ equipments });
            }
            return res.status(404).send('Equipments not found');
        }
        res.status(401).send('Unauthorized');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const DeleteEquipment = async (req, res) => {
    try {
        const operatorId = res.locals.payload.id;
        const equipmentId = req.params.equipmentId;
        const operator = await User.findById(operatorId);
        if (operator?.role === 'admin' || operator?.role === 'manager') {
            const deletedEquipment = await Equipment.findByIdAndDelete(equipmentId);
            if (deletedEquipment) {
                return res.status(200).send('Equipment deleted successfully');
            }
            return res.status(404).send('Equipment not found');
        }
        res.status(401).send('Unauthorized');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const AddEquipment = async (req, res) => {
    try {
        const { owner, code, description, manufacturer, model, serialNo, type } = req.body;
        if (!code || !description || !manufacturer || !model || !serialNo || !type) {
            return res.status(400).send('Invalid data');
        }
        const operatorId = res.locals.payload.id;
        const operator = await User.findById(operatorId);
        if (operator?.role === 'admin' || operator?.role === 'manager') {
            const existingEquipment = await Equipment.findOne({ code });
            if (existingEquipment) {
                return res.status(409).send("An equipment with that code has already been registered!");
            }
            else {
                const equipmentData = {
                    code,
                    description,
                    manufacturer,
                    model,
                    serialNo,
                    type
                };
                if (owner) {
                    equipmentData.owner = owner;
                }
                const newEquipment = await Equipment.create(equipmentData);
                if (newEquipment) {
                    return res.status(200).send('Equipment created successfully');
                }
                else {
                    return res.status(400).send('Unable to create equipment');
                }
            }
        }
        res.status(401).send('Unauthorized');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const UpdateEquipment = async (req, res) => {
    try {
        const { owner, code, description, manufacturer, model, serialNo, type, nextProposedCalibrationDuration } = req.body;
        const equipmentId = req.params.equipmentId;
        if (!code || !description || !manufacturer || !model || !serialNo || !type) {
            return res.status(400).send('Invalid data');
        }
        const operatorId = res.locals.payload.id;
        const operator = await User.findById(operatorId);
        if (operator?.role === 'admin' || operator?.role === 'manager') {
            const existingEquipment = await Equipment.findOne({ code });
            if (existingEquipment && existingEquipment._id.toString() !== equipmentId) {
                return res.status(409).send("An equipment with that code has already been registered!");
            }
            else {
                const equipmentData = {
                    code,
                    description,
                    manufacturer,
                    model,
                    serialNo,
                    type
                };
                if (owner) {
                    equipmentData.owner = owner;
                }
                const updatedEquipment = await Equipment.findByIdAndUpdate(equipmentId, equipmentData);
                if (nextProposedCalibrationDuration && updatedEquipment.claibrationDetails.length > 0) {
                    updatedEquipment.claibrationDetails[updatedEquipment.claibrationDetails.length - 1].nextProposedCalibrationDuration = nextProposedCalibrationDuration;
                    await updatedEquipment.save();
                }
                if (updatedEquipment) {
                    return res.status(200).send('Equipment updated successfully');
                }
                else {
                    return res.status(400).send('Unable to update equipment');
                }
            }
        }
        res.status(401).send('Unauthorized');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const GetEquipmentReport = async (req, res) => {
    try {
        const equipmentId = req.params.equipmentId;
        const operatorId = res.locals.payload.id;
        const operator = await User.findById(operatorId);
        if (operator?.role === 'admin' || operator?.role === 'manager' || operator?.role === 'employee') {
            const existingEquipment = await Equipment.findById(equipmentId).populate('claibrationDetails.calibratedBy');
            console.log('Equipment: ', existingEquipment);
            if (!existingEquipment) {
                return res.status(404).send("Equipment not found!");
            }
            else {
                const calibrationDetails = existingEquipment.claibrationDetails;
                return res.status(200).json({ calibrationDetails });
            }
        }
        res.status(401).send('Unauthorized');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const AddCalibrationDetails = async (req, res) => {
    try {
        const {
            certificateNo,
            dateOfReceipt,
            dateOfCalibration,
            dateOfIssue,
            workOrderNo,
            placeOfCalibration,
            nextProposedCalibrationDuration,
        } = req.body;
        if (!certificateNo ||
            !dateOfReceipt ||
            !dateOfCalibration ||
            !dateOfIssue ||
            !workOrderNo ||
            !placeOfCalibration ||
            !nextProposedCalibrationDuration) {
            return res.status(400).send('Invalid data');
        }
        const equipmentId = req.params.equipmentId;
        const operatorId = res.locals.payload.id;
        const operator = await User.findById(operatorId);
        if (operator?.role === 'admin' || operator?.role === 'manager' || operator?.role === 'employee') {
            const existingEquipment = await Equipment.findById(equipmentId);
            if (!existingEquipment) {
                return res.status(404).send("Equipment not found!");
            }
            else {
                const calibrationDetails = {
                    certificateNo,
                    dateOfReceipt,
                    dateOfCalibration,
                    dateOfIssue,
                    workOrderNo,
                    placeOfCalibration,
                    calibratedBy: operatorId,
                    nextProposedCalibrationDuration,
                }
                existingEquipment.claibrationDetails.push(calibrationDetails);
                await existingEquipment.save();
                return res.status(200).send('Calibration done!');
            }
        }
        res.status(401).send('Unauthorized');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const RemindOwnerViaMail = async (req, res) => {
    const { ownerName, nextCalibDate, code, manufacturer, model, serialNo, owner } = req.body;
    const formattedNextCallibrationDate = new Date(nextCalibDate).toDateString();
    
    let mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: owner.email,
        cc: 'darabmonib123@gmail.com',
        subject: 'Calibration Reminder for Equipment',
        text: 
        `
Dear ${ownerName},
        
Just a quick reminder that the calibration for the following equipment is due soon:
        
Equipment Code: ${code}
Manufacturer: ${manufacturer}
Model: ${model}
Serial No: ${serialNo}
Next Proposed Calibration Date: ${formattedNextCallibrationDate}
Please schedule calibration before the proposed date to ensure continued accuracy and reliability.
        
Best regards`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Mail error:', error);
            return res.status(502).send(`Something went wrong.. ${error}`)
        }
        return res.status(200).send('User notified Successfully!');
    });

};

module.exports = {
    GetEquipments,
    DeleteEquipment,
    AddEquipment,
    UpdateEquipment,
    GetEquipmentReport,
    AddCalibrationDetails,
    RemindOwnerViaMail
};
