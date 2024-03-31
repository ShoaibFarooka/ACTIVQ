const express = require('express');
const cors = require('cors');
const path = require("path");
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit')
require('dotenv').config();

const userRoutes = require("./routes/userRoutes");
const infoRoutes = require("./routes/infoRoutes");
const clientRoutes = require("./routes/clientRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const qmsRoutes = require("./routes/qmsRoutes");

//Express Server Setup
const app = express();
const port = process.env.PORT || 5005;

// Apply the rate limiting middleware to all requests.
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

//Express Middlewares
app.use(express.json());
app.use(cors());
app.use(limiter)

// Connection URL
const DB = process.env.DB_URI;
mongoose.connect(DB)
    .then(() => {
        console.log('Connected to MongoDB Atlas');

        //Server status endpoint
        app.get('/', (req, res) => {
            res.send('Server is Up!');
        });

        //Serve Images
        app.use('/uploads', express.static(path.join(__dirname, 'Photos')));
        app.use('/photo-signatures', express.static(path.join(__dirname, 'photo-signatures')));

        // Routes
        app.use("/users", userRoutes);
        app.use("/info", infoRoutes);
        app.use("/clients", clientRoutes);
        app.use("/equipments", equipmentRoutes);
        app.use("/qms", qmsRoutes);

        app.listen(port, () => {
            console.log(`Node/Express Server is Up......\nPort: localhost:${port}`);
        });
    })
    .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));