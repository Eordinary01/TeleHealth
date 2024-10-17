const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");
const User = require("../models/user");

exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, dateTime, type } = req.body;

    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      dateTime,
      type,
    });

    await appointment.save();

    await Doctor.findByIdAndUpdate(doctorId, {
      $push: { appointments: appointment._id },
    });

    res.status(202).json(appointment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating appointment..", error: error.message });
  }
};

exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .populate("patient");

    console.log("Fetched Appointments:", appointments);

    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    next(err);
  }
};
