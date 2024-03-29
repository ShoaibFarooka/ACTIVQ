const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");

const Register = async (req, res) => {
    try {
        const { name, username, contact, age, gender, password } = req.body;
        let existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).send("A user with that username has already been registered!");
        } else {
            let passwordDigest = await authMiddleware.hashPassword(password);
            const userData = await User.create({
                name,
                username,
                contact,
                age,
                gender,
                password: passwordDigest,
            });
            res.status(201).json({ userData });
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const Login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send('Invalid data');
        }
        const user = await User.findOne({ username });
        if (user) {
            let passwordMatched = await authMiddleware.comparePassword(
                user.password,
                password
            );
            if (passwordMatched) {
                let payload = {
                    id: user.id,
                };
                let token = authMiddleware.createToken(payload);
                return res.status(200).json({ token });
            }
        }
        res.status(401).send('Invalid Credentials!');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const GetUserRole = async (req, res) => {
    try {
        const userId = res.locals.payload.id;
        const user = await User.findById(userId);
        if (user) {
            return res.status(200).json({ role: user.role });
        }
        res.status(404).send('User not found');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const GetUserName = async (req, res) => {
    try {
        const userId = res.locals.payload.id;
        const user = await User.findById(userId);
        if (user) {
            return res.status(200).json({ name: user.name });
        }
        res.status(404).send('User not found');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const GetUsers = async (req, res) => {
    try {
        const operatorId = res.locals.payload.id;
        const operator = await User.findById(operatorId);
        if (operator?.role === 'admin') {
            const users = await User.find({ role: { $in: ["employee", "manager"] } }, { password: 0, createdAt: 0, updatedAt: 0 });
            if (users && users.length > 0) {
                return res.status(200).json({ users });
            }
            return res.status(404).send('Users not found');
        }
        else if (operator.role === 'manager') {
            const users = await User.find({ role: { $in: ["employee"] } }, { password: 0, createdAt: 0, updatedAt: 0 });
            if (users && users.length > 0) {
                return res.status(200).json({ users });
            }
            return res.status(404).send('Users not found');
        }
        res.status(401).send('Unauthorized');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const DeleteUser = async (req, res) => {
    try {
        const operatorId = res.locals.payload.id;
        const userId = req.params.userId;
        const operator = await User.findById(operatorId);
        if (operator?.role === 'admin' || operator?.role === 'manager') {
            const deletedUser = await User.findByIdAndDelete(userId);
            if (deletedUser) {
                return res.status(200).send('User deleted successfully');
            }
            return res.status(404).send('User not found');
        }
        res.status(401).send('Unauthorized');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const AddUser = async (req, res) => {
    try {
        const { name, username, code, password, role, permissions } = req.body;
        if (!name || !username || !code || !password || !role) {
            return res.status(400).send('Invalid data');
        }
        const operatorId = res.locals.payload.id;
        const operator = await User.findById(operatorId);
        if (operator?.role === 'admin') {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(409).send("A user with that username has already been registered!");
            }
            else {
                const passwordDigest = await authMiddleware.hashPassword(password);
                const newUser = await User.create({
                    name,
                    username,
                    code,
                    password: passwordDigest,
                    role,
                    permissions
                });
                if (newUser) {
                    return res.status(200).send('User created successfully');
                }
                else {
                    return res.status(400).send('Unable to create user');
                }
            }
        }
        res.status(401).send('Unauthorized');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const UpdateUser = async (req, res) => {
    try {
        const { name, username, code, password, role, permissions } = req.body;
        const userId = req.params.userId;
        if (!name || !username || !code || !role) {
            return res.status(400).send('Invalid data');
        }
        const operatorId = res.locals.payload.id;
        const operator = await User.findById(operatorId);
        if (operator?.role === 'admin' || operator?.role === 'manager') {
            if (operator.role === 'admin' && role === 'admin') {
                return res.status(401).send('Unauthorized');
            }
            else if (operator.role === 'manager' && (role === 'manager' || role === 'admin')) {
                return res.status(401).send('Unauthorized');
            }
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(409).send("A user with that username has already been registered!");
            }
            else {
                const userData = {
                    name,
                    username,
                    code,
                    role,
                    permissions
                }
                if (password) {
                    const passwordDigest = await authMiddleware.hashPassword(password);
                    userData.password = passwordDigest;
                }
                const updatedUser = await User.findByIdAndUpdate(userId, userData);
                if (updatedUser) {
                    return res.status(200).send('User updated successfully');
                }
                else {
                    return res.status(400).send('Unable to update user');
                }
            }
        }
        res.status(401).send('Unauthorized');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

const GetUsersForCalibration = async (req, res) => {
    try {
        const operatorId = res.locals.payload.id;
        const operator = await User.findById(operatorId);
        if (operator?.role === 'admin' || operator?.role === 'manager') {
            const users = await User.find({}, { _id: 1, name: 1 });
            if (users && users.length > 0) {
                return res.status(200).json({ users });
            }
            return res.status(404).send('Users not found');
        }
        res.status(401).send('Unauthorized');
    } catch (error) {
        res.status(500).send('Internal Server Error');
        throw error;
    }
};

module.exports = {
    Login,
    Register,
    GetUserRole,
    GetUserName,
    GetUsers,
    DeleteUser,
    AddUser,
    UpdateUser,
    GetUsersForCalibration
};
