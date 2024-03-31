const router = require("express").Router();
const controller = require("../controllers/equipmentController");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
    "/get-equipments",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.GetEquipments
);
router.delete(
    "/delete-equipment/:equipmentId",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.DeleteEquipment
);
router.post(
    "/add-equipment",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.AddEquipment
);
router.put(
    "/update-equipment/:equipmentId",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.UpdateEquipment
);
router.get(
    "/get-equipment-report/:equipmentId",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.GetEquipmentReport
);
router.post(
    "/add-calibration-details/:equipmentId",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.AddCalibrationDetails
);

router.post(
    "/remind-owner",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.RemindOwnerViaMail
);

module.exports = router;
