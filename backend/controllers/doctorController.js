const Doctor = require('../models/doctor');
const User = require('../models/user');

exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('user', 'name'); // Populate only the name field
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Error Fetching doctors.. ', error });
    }
};

exports.createDoctors = async (req, res) => {
  try {
    const { userId, specialty } = req.body;

    console.log(req.body);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found!!' });
    }
    if (user.role !== 'doctor') {
      return res.status(404).json({ message: 'User is not a Doctor..' });
    }

    const doctor = new Doctor({
      user: userId,
      specialty: specialty,
    });

    await doctor.save();

    res.status(201).json({ message: 'Doctor created successfully..', doctor });
    
  } catch (error) {
    res.status(500).json({ message: 'Error creating doctor', error });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json({
      id: doctor._id,
      name: doctor.user.name, 
      specialty: doctor.specialty,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor', error });
  }
};
