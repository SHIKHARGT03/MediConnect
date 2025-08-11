import Hospital from '../../models/Hospital&Doctor/Hospital.js';
import Doctor from '../../models/Hospital&Doctor/Doctor.js';

// Get all hospitals
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
};

// Get hospital by ID
export const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching hospital' });
  }
};

// Get doctors of a hospital
export const getDoctorsByHospital = async (req, res) => {
  try {
    const doctors = await Doctor.find({ hospitalId: req.params.id });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching doctors for hospital' });
  }
};
