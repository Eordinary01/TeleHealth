const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");

// Create a new appointment
exports.createAppointment = async (req, res, next) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Only patients can book appointments" });
    }

    const { patientId, doctorId, dateTime, type } = req.body;

    if (req.user.id !== patientId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    const doctorExists = await Doctor.findById(doctorId);
    if (!doctorExists) {
      return res.status(404).json({ message: "Doctor not found" });
    }

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

    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};


// Fetch appointments based on user role (doctor or patient)
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

// Fetch appointments for a specific patient
exports.getAppointmentsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Ensure the authenticated user matches the requested user
    if (req.user.role !== "patient" || req.user.id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const appointments = await Appointment.find({ patient: userId })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .populate("patient");

    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    // Ensure only doctors can update status
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can update appointment status" });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Validate status
    const validStatuses = ["completed", "rejected", "pending"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment
    });
  } catch (error) {
    next(error);
  }
};

