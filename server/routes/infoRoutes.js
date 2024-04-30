const router = require("express").Router();
const controller = require("../controllers/infoController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

// Images Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Photos/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, '-'));
    },
});

const upload = multer({ storage: storage });

router.put(
    "/update-company-info",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    upload.fields([{ name: 'logo' }, { name: 'seal1' }, { name: 'seal2' }]),
    controller.UpdateInfo
);
router.get(
    "/get-company-info",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.GetInfo
);

module.exports = router;
