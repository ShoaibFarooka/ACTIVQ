const router = require("express").Router();
const controller = require("../controllers/clientController");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
    "/get-clients",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.GetClients
);
router.delete(
    "/delete-client/:clientId",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.DeleteClient
);
router.post(
    "/add-client",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.AddClient
);
router.put(
    "/update-client/:clientId",
    authMiddleware.stripToken,
    authMiddleware.verifyToken,
    controller.UpdateClient
);

module.exports = router;
