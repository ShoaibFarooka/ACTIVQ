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
router.put(
    "/update-equipment-parameters/:equipmentId",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.UpdateEquipmentParameters
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

router.post(
    "/verify-equipment-report",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.VerifyEquipmentReport
);

router.post(
    "/generate-report-certificate",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.GenerateReportCertificate
);

module.exports = router;
