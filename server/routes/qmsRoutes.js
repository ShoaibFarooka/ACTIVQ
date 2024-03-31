const router = require("express").Router();
const multer = require("multer");
const controller = require("../controllers/qmsController");
const authMiddleware = require("../middleware/authMiddleware");

// Images Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Photos/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post(
    "/upload-report",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    upload.fields([{ name: 'file' }]),
    controller.uploadFilesToGoogleCloud
);
router.post(
    "/get-reports",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.fetchQmsReports
);

router.post(
    "/delete-report",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.deleteQmsReport
);

module.exports = router;
