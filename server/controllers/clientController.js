const User = require("../models/userModel");
const Client = require("../models/clientModel");

const GetClients = async (req, res) => {
    try {
        const operatorId = res.locals.payload.id;
        const operator = await User.findById(operatorId);
        if (operator?.role === 'admin' || operator?.role === 'manager') {
            const clients = await Client.find({}, { createdAt: 0, updatedAt: 0 });
            if (clients && clients.length > 0) {
                return res.status(200).json({ clients });
            }
            return res.status(404).send('Clients not found');
        }
        res.status(401).send('Unauthorized');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const DeleteClient = async (req, res) => {
    try {
        const operatorId = res.locals.payload.id;
        const clientId = req.params.clientId;
        const operator = await User.findById(operatorId);
        if (operator?.role === 'admin' || operator?.role === 'manager') {
            const deletedClient = await Client.findByIdAndDelete(clientId);
            if (deletedClient) {
                return res.status(200).send('Client deleted successfully');
            }
            return res.status(404).send('Client not found');
        }
        res.status(401).send('Unauthorized');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const AddClient = async (req, res) => {
    try {
        const { name, code, address, generalInfo } = req.body;
        if (!name || !code || !address) {
            return res.status(400).send('Invalid data');
        }
        const operatorId = res.locals.payload.id;
        const operator = await User.findById(operatorId);
        if (operator?.role === 'admin' || operator?.role === 'manager') {
            const existingClient = await Client.findOne({ code });
            if (existingClient) {
                return res.status(409).send("A client with that code has already been registered!");
            }
            else {
                const newClient = await Client.create({
                    name,
                    code,
                    address,
                    generalInfo
                });
                if (newClient) {
                    return res.status(200).send('Client created successfully');
                }
                else {
                    return res.status(400).send('Unable to create client');
                }
            }
        }
        res.status(401).send('Unauthorized');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const UpdateClient = async (req, res) => {
    try {
        const { name, code, address, generalInfo } = req.body;
        const clientId = req.params.clientId;
        if (!name || !code || !address) {
            return res.status(400).send('Invalid data');
        }
        const operatorId = res.locals.payload.id;
        const operator = await User.findById(operatorId);
        if (operator?.role === 'admin' || operator?.role === 'manager') {
            const existingClient = await User.findOne({ code });
            if (existingClient && existingClient._id.toString() !== clientId) {
                return res.status(409).send("A client with that code has already been registered!");
            }
            else {
                const clientData = {
                    name,
                    code,
                    address,
                    generalInfo
                }
                const updatedClient = await Client.findByIdAndUpdate(clientId, clientData);
                if (updatedClient) {
                    return res.status(200).send('Client updated successfully');
                }
                else {
                    return res.status(400).send('Unable to update client');
                }
            }
        }
        res.status(401).send('Unauthorized');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

module.exports = {
    GetClients,
    DeleteClient,
    AddClient,
    UpdateClient
};
