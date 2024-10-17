const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const isAuth = require('../middleware/is-auth');


router.post('/create',isAuth,appointmentController.createAppointment);

router.get('/',appointmentController.getAppointments);

module.exports = router;