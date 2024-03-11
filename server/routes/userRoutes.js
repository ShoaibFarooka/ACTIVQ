const router = require("express").Router();
const controller = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

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
    controller.AddUser
);
router.put(
    "/update-user/:userId",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.UpdateUser
);
router.get(
    "/get-users-for-calibration",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.GetUsersForCalibration
);

module.exports = router;
