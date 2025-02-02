const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const isAuth = require("../middleware/is-auth"); 

// Create a new appointment
router.get("/",  appointmentController.getAppointments);
router.post("/create", isAuth, appointmentController.createAppointment);

// Get appointments for the authenticated user

// Get appointments by user ID (specific patient)
router.get("/:userId", isAuth, appointmentController.getAppointmentsByUserId);

router.patch("/:appointmentId/status",isAuth,appointmentController.updateAppointmentStatus);

module.exports = router;
