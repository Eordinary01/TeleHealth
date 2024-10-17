const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.post('/create-doctor',doctorController.createDoctors);
router.get('/',doctorController.getDoctors);
router.get('/:id',doctorController.getDoctorById);

module.exports = router;