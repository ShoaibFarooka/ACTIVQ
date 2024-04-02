const router = require("express").Router();
const multer = require("multer");
const controller = require("../controllers/qmsController");
const authMiddleware = require("../middleware/authMiddleware");

// Images Storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
    "/upload-report",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    upload.fields([{ name: 'file' }]),
    controller.uploadQmsReport
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

router.post(
    "/download-report",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.downloadQmsReport
);

module.exports = router;
