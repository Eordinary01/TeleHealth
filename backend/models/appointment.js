const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ["virtual"],
    default: "virtual",
  },
  status: {
    type: String,
    enum: ["completed", "rejected", "pending"],
    default: "pending",
  },
},
{
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment",appointmentSchema);
