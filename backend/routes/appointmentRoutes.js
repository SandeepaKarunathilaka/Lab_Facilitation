const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");
const USER_ROLES = require("../constants/roles");

const router = express.Router();

router.post(
  "/",
  authMiddleware([USER_ROLES.PATIENT]),
  appointmentController.createAppointment
);
router.get(
  "/",
  authMiddleware([USER_ROLES.ADMIN, USER_ROLES.PATIENT]),
  appointmentController.getAppointments
);
router.get(
  "/count",
  authMiddleware([USER_ROLES.ADMIN]),
  appointmentController.getAppointmentsCount
);
// getAppointmentsByPatient
router.get(
  "/patient",
  authMiddleware([USER_ROLES.PATIENT]),
  appointmentController.getAppointmentsByPatient
);
// getAppointmentsCountByPatient
router.get(
  "/patient/count",
  authMiddleware([USER_ROLES.PATIENT]),
  appointmentController.getAppointmentsCountByPatient
);
router.get(
  "/:id",
  authMiddleware([USER_ROLES.ADMIN, USER_ROLES.PATIENT]),
  appointmentController.getAppointmentById
);
router.patch(
  "/:id",
  authMiddleware([USER_ROLES.ADMIN, USER_ROLES.PATIENT]),
  appointmentController.updateAppointment
);
router.delete(
  "/:id",
  authMiddleware([USER_ROLES.ADMIN, USER_ROLES.PATIENT]),
  appointmentController.deleteAppointment
);

module.exports = router;
