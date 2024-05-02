const router = require("express").Router();
const controller = require("../controllers/userController");
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

router.post(
    "/register",
    controller.Register
);
router.post(
    "/login",
    controller.Login
);
router.get(
    "/get-user-role",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.GetUserRole
);
router.get(
    "/get-user-name",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.GetUserName
);
router.get(
    "/get-user-id",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.GetUserId
);
router.get(
    "/get-user-photo-signature",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.GetUserPhotoSignature
);
router.get(
    "/get-users",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.GetUsers
);
router.delete(
    "/delete-user/:userId",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.DeleteUser
);
router.post(
    "/add-user",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    upload.fields([{ name: 'photoSignature' }]),
    controller.AddUser
);
router.put(
    "/update-user/:userId",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    upload.fields([{ name: 'photoSignature' }]),
    controller.UpdateUser
);
router.get(
    "/get-users-for-calibration",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.GetUsersForCalibration
);

module.exports = router;
