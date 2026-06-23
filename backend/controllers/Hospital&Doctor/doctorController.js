import Doctor from '../../models/Hospital&Doctor/Doctor.js';

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('hospitalId', 'name location');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('hospitalId', 'name location');
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching doctor' });
  }
};

// Get doctors by department
export const getDoctorsByDepartment = async (req, res) => {
  try {
    const doctors = await Doctor.find({ department: req.params.dept });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching doctors by department' });
  }
};

// Get doctors by department and hospital (query params)
export const getDoctorsFiltered = async (req, res) => {
  try {
    const { department, hospital } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (hospital) filter.hospitalId = hospital;
    const doctors = await Doctor.find(filter);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching doctors with filters' });
  }
};

// ✅ NEW: Get top doctors by symptom (experience > 10, one per hospital)
export const getTopDoctorsBySymptom = async (req, res) => {
  const { symptom } = req.params;

  const symptomToDeptMap = {
    "Fever": "General OPD",
    "Chest Pain": "Cardiology",
    "Joint Pain": "Orthopedics",
    "Headache": "Neurology",
    "Sore Throat": "ENT",
    "Cough": "Pulmonology",
    "Anxiety": "Psychiatry"
  };

  const department = symptomToDeptMap[symptom];
  if (!department) return res.status(400).json({ error: "Invalid symptom" });

  console.log("Mapped department for symptom:", symptom, "→", department);

  try {
    const doctors = await Doctor.find({
      department,
      experience: { $gte: 5 }
    }).populate('hospitalId', 'name location');

    console.log("Doctors fetched:", doctors.length);

    const sortedDoctors = [...doctors].sort((a, b) => (b.experience || 0) - (a.experience || 0));

    // Pick one top doctor per hospital
    const topDoctors = [];
    const seenHospitals = new Set();

    for (const doc of sortedDoctors) {
      const hospitalId = doc.hospitalId?._id?.toString();
      if (hospitalId && !seenHospitals.has(hospitalId)) {
        seenHospitals.add(hospitalId);
        topDoctors.push(doc);
      }
    }

    console.log("Returning top doctors:", topDoctors.length);
    res.json(topDoctors);
  } catch (err) {
    console.error("Error fetching top doctors:", err);
    res.status(500).json({ error: "Error fetching top doctors by symptom" });
  }
};

// Get top doctors by department/category (experience > 5, one per hospital)
export const getTopDoctorsByDepartment = async (req, res) => {
  const { department } = req.params;

  try {
    const doctors = await Doctor.find({
      department,
      experience: { $gte: 5 }
    }).populate('hospitalId', 'name location');

    // Pick one top doctor per hospital
    const topDoctors = [];
    const seenHospitals = new Set();

    for (const doc of doctors) {
      const hospitalId = doc.hospitalId?._id?.toString();
      if (hospitalId && !seenHospitals.has(hospitalId)) {
        seenHospitals.add(hospitalId);
        topDoctors.push(doc);
      }
    }

    res.json(topDoctors);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching top doctors by department' });
  }
};
