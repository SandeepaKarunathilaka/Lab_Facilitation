const express = require("express");
const labServiceController = require("../controllers/labServiceController");
const authMiddleware = require("../middleware/authMiddleware");
const USER_ROLES = require("../constants/roles");

const router = express.Router();

router.post(
  "/",
  authMiddleware([USER_ROLES.ADMIN]),
  labServiceController.createLabService
);
router.get(
  "/",
  authMiddleware([USER_ROLES.ADMIN, USER_ROLES.PATIENT]),
  labServiceController.getLabServices
);
router.get(
  "/count",
  authMiddleware([USER_ROLES.ADMIN]),
  labServiceController.getLabServicesCount
);
router.get(
  "/:id",
  authMiddleware([USER_ROLES.ADMIN, USER_ROLES.PATIENT]),
  labServiceController.getLabServiceById
);
router.patch(
  "/:id",
  authMiddleware([USER_ROLES.ADMIN]),
  labServiceController.updateLabService
);
router.delete(
  "/:id",
  authMiddleware([USER_ROLES.ADMIN]),
  labServiceController.deleteLabService
);

module.exports = router;
