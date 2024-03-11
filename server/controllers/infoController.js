const Info = require("../models/infoModel");

const filterSensitiveFields = (data) => {
    const sensitiveFields = ['_id', 'createdAt', 'updatedAt'];
    const filteredData = { ...data._doc };
    sensitiveFields.forEach((field) => {
        if (filteredData[field]) {
            delete filteredData[field];
        }
    });
    return filteredData;
};

const UpdateInfo = async (req, res) => {
    try {
        const { name, address, telephone, code } = req.body;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const logoURL = req.files['logo'] ? `${baseUrl}/uploads/${req.files['logo'][0].filename}` : req.logo;
        const seal1URL = req.files['seal1'] ? `${baseUrl}/uploads/${req.files['seal1'][0].filename}` : req.seal1;
        const seal2URL = req.files['seal2'] ? `${baseUrl}/uploads/${req.files['seal2'][0].filename}` : req.seal2;
        const data = {
            name,
            address,
            telephone,
            code,
            logo: logoURL,
            seal1: seal1URL,
            seal2: seal2URL
        }
        const prevInfo = await Info.findOne();
        if (prevInfo) {
            const updatedInfo = await Info.findByIdAndUpdate(prevInfo._id, data, { new: true });
            if (updatedInfo) {
                res.status(200).send('Info updated successfully');
            }
        }
        else {
            const newInfo = await Info.create(data);
            if (newInfo) {
                res.status(200).send('Info saved successfully');
            }
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const GetInfo = async (req, res) => {
    try {
        const info = await Info.findOne();
        if (info) {
            const filteredInfo = filterSensitiveFields(info);
            res.status(200).json({ info: filteredInfo });
        }
        else {
            res.status(404).send('Info not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

module.exports = {
    UpdateInfo,
    GetInfo
};
