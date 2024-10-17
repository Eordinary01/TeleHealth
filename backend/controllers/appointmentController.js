const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");

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

    //adding the app id to the doc array 
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

exports.getAppointments = async (req, res) => {
  try {
    const { userId, role } = req.user;
    let appointments;

    if (role === "patient") {
      appointments = await Appointment.find({ patient: userId }).populate(
        "doctor"
      );
    } else {
      appointments = await Appointment.find({ doctor: userId }).populate(
        "patient"
      );
    }
    res.json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Appointments..", error: error.message });
  }
};
