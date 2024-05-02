const User = require("../models/userModel");
const Info = require("../models/infoModel");
const Equipment = require("../models/equipmentModel");
const nodemailer = require("nodemailer"); 
const handlebars = require("handlebars");
const { generateCertificate, convertImageToBase64 } = require('../certificate-template/generate-certificate');

handlebars.registerHelper('truncateText', function(text) {
    if (text.length > 300) { 
        text = text.slice(0, 300) + '...'
    }
    return text;
});

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
                }).populate({
                    path: 'claibrationDetails.referenceEquipment',
                    select: '_id code parametersTable'
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
        const { owner, code, description, manufacturer, model, serialNo, category, parametersTable, type } = req.body;
        if (!code || !description || !manufacturer || !model || !serialNo || !category || !type) {
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
                    category,
                    parametersTable,
                    type
                };
                if (owner) {
                    equipmentData.owner = owner;
                }
                if (type == 'thermometer' && req.body.accuracyOfMeasurements) {
                    equipmentData.accuracyOfMeasurements = req.body.accuracyOfMeasurements;
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
        const { owner, code, description, manufacturer, model, serialNo, category, nextProposedCalibrationDuration, parametersTable } = req.body;
        const equipmentId = req.params.equipmentId;
        if (!code || !description || !manufacturer || !model || !serialNo || !category) {
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
                    category,
                    parametersTable
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

const UpdateEquipmentParameters = async (req, res) => {
    try {
        const { parameters } = req.body;
        const equipmentId = req.params.equipmentId;
        if (!parameters) {
            return res.status(400).send('Invalid data');
        }
        const operatorId = res.locals.payload.id;
        const operator = await User.findById(operatorId);

        if (operator?.role === 'admin' || operator?.role === 'manager') {
            const equipmentData = {
                parametersTable: parameters
            };
            console.log(equipmentId, equipmentData);
            const updatedEquipment = await Equipment.findByIdAndUpdate(equipmentId, equipmentData);
            if (updatedEquipment) {
                return res.status(200).send('Equipment parameters updated successfully');
            }
            else {
                return res.status(400).send('Unable to update equipment parameters');
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
            referenceEquipment,
            nextProposedCalibrationDuration,
            enviromentalConditions,
            calibrationTables,
            bathParameters
        } = req.body;
        if (!certificateNo ||
            !dateOfReceipt ||
            !dateOfCalibration ||
            !dateOfIssue ||
            !workOrderNo ||
            !placeOfCalibration ||
            !referenceEquipment ||
            !nextProposedCalibrationDuration ||
            !enviromentalConditions ||
            !calibrationTables ||
            !bathParameters
        ) {
            return res.status(400).send('Invalid data');
        }
        const equipmentId = req.params.equipmentId;
        const operatorId = res.locals.payload.id;
        const operator = await User.findById(operatorId);
        if (operator?.role === 'admin' || operator?.role === 'manager' || operator?.role === 'employee') {
            const existingEquipment = await Equipment.findById(equipmentId).populate('claibrationDetails.referenceEquipment');
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
                    referenceEquipment,
                    calibratedBy: operatorId,
                    nextProposedCalibrationDuration,
                    enviromentalConditions,
                    calibrationTables,
                    bathParameters,
                    reportVerification: {
                        status: false
                    }
                }
                if (req.body.comments) {
                    calibrationDetails.comments = req.body.comments;
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

const VerifyEquipmentReport = async (req, res) => {
    try {
        const { equipmentId, reportVerification } = req.body;
        if (!equipmentId) {
            return res.status(400).send('Invalid data');
        }
        const operatorId = res.locals.payload.id;
        const operator = await User.findById(operatorId);
        if (operator?.role === 'admin' || operator?.role === 'manager' || operator?.role == 'employee' && operator.permissions.includes("Photo signature")) {
            const updatedEquipment = await Equipment.findOneAndUpdate(
                { 'claibrationDetails._id': equipmentId },
                { $set: { 'claibrationDetails.$.reportVerification': {...reportVerification, approvedBy: operatorId} } },
                { new: true }
            );
            if (updatedEquipment) {
                return res.status(200).send('Verification status updated successfully');
            } else {
                return res.status(400).send('Unable to update verification status');
            }
        }
        res.status(401).send('Unauthorized');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
}

const GenerateReportCertificate = async (req, res) => {
    try {
        const equipemntData = await Equipment
            .findOne({ 'claibrationDetails._id': req.body.equipmentId })
            .populate('owner')
            .populate('claibrationDetails.calibratedBy')
            .populate({
                path: 'claibrationDetails.referenceEquipment',
                select: 'code description manufacturer model serialNo'
            })
            .populate({
                path: 'claibrationDetails.reportVerification.approvedBy',
                select: 'photoSignature'
            });

        const companyInfo = await Info.findOne({});

        if (equipemntData) {
            const equipmentOwner = equipemntData.owner;
            const claibrationDetails = equipemntData.claibrationDetails.find((item) => item._id == req.body.equipmentId);
            const refEquipment = claibrationDetails.referenceEquipment;
            const environmentalConditions = claibrationDetails.enviromentalConditions;
            const calcAverage = (numbers) => (numbers[0] !== undefined && numbers[1] !== undefined) ? ((numbers[0] + numbers[1]) / 2) : undefined;
            const calcDifference = (numbers) => (numbers[0] !== undefined && numbers[1] !== undefined) ? Math.max(numbers[0], numbers[1]) - Math.min(numbers[0], numbers[1]) : undefined;

            function findMinMax(array) {
                if (array.length === 0) return null;
                if (array.length === 1) return [array[0].calibrationTemperature, array[0].calibrationTemperature];
                let min = array[0].calibrationTemperature;
                let max = array[0].calibrationTemperature;
                for (let i = 1; i < array.length; i++) {
                    if (array[i].calibrationTemperature < min) {
                        min = array[i].calibrationTemperature;
                    } else if (array[i].calibrationTemperature > max) {
                        max = array[i].calibrationTemperature;
                    }
                }
                return [min, max];
            }
            
            let companyLogoImage = null;
            let authorizedSignatoryImage = null;
            if (companyInfo?.logo != null && companyInfo?.logo?.trim() != "") {
                companyLogoImage = convertImageToBase64(companyInfo.logo);
            }
            if (claibrationDetails?.reportVerification?.approvedBy?.photoSignature != null && claibrationDetails?.reportVerification?.approvedBy?.photoSignature?.trim() != "") {
                authorizedSignatoryImage = convertImageToBase64(claibrationDetails.reportVerification.approvedBy.photoSignature);
            }

            const pdfBuffer = await generateCertificate({
                certificateNumber: claibrationDetails.certificateNo,
                authorizedSignatory: authorizedSignatoryImage,
                companyLogo: companyLogoImage,
                companyName: companyInfo.name,
                contactInfo: companyInfo.telephone,
                customer: equipmentOwner?.name ?? 'N/A',
                address: equipmentOwner?.address ?? 'N/A',
                itemCode: equipemntData.code,
                description: equipemntData.description,
                manufacturer: equipemntData.manufacturer,
                type: "Thermometer",
                serialNo: equipemntData.serialNo,
                dateOfReceipt: claibrationDetails.dateOfReceipt.toLocaleDateString(),
                dateOfCalibration: claibrationDetails.dateOfCalibration.toLocaleDateString(),
                dateOfIssue: claibrationDetails.dateOfIssue.toLocaleDateString(),
                placeOfCalibration: claibrationDetails.placeOfCalibration,
                calibratedBy: claibrationDetails.calibratedBy.name,
                calibrationRange: findMinMax(claibrationDetails.calibrationTables),
                temperature: {
                    average: calcAverage(environmentalConditions.temperature),
                    tolerance: calcDifference(environmentalConditions.temperature)
                },
                relativeHumidity: {
                    average: calcAverage(environmentalConditions.relativeHumidity),
                    tolerance: calcDifference(environmentalConditions.relativeHumidity)
                },
                airPressure: {
                    average: calcAverage(environmentalConditions.atmosphericPressure),
                    tolerance: calcDifference(environmentalConditions.atmosphericPressure)
                },
                refEquipment: {
                    code: refEquipment.code,
                    description: refEquipment.description,
                    manufacturer: refEquipment.manufacturer,
                    model: refEquipment.model,
                    serialNo: refEquipment.serialNo
                },
                comments: claibrationDetails.comments
            });
            res.send(pdfBuffer);
        } else {
            res.status(400).send("Equipment Data not found")
        }
    } catch (error) {
        console.log(`${error}`);
        res.status(502).send("Internal Server Error");
    }
};


module.exports = {
    GetEquipments,
    DeleteEquipment,
    AddEquipment,
    UpdateEquipment,
    UpdateEquipmentParameters,
    GetEquipmentReport,
    AddCalibrationDetails,
    RemindOwnerViaMail,
    VerifyEquipmentReport,
    GenerateReportCertificate
};
