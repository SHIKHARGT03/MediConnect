import express from 'express';
import {
  getAllDoctors,
  getDoctorById,
  getDoctorsByDepartment,
  getDoctorsFiltered,
  getTopDoctorsBySymptom // ✅ import new controller
} from '../../controllers/Hospital&Doctor/doctorController.js';

const router = express.Router();

router.get('/', getDoctorsFiltered); // handles query params
router.get('/:id', getDoctorById);
router.get('/by-department/:dept', getDoctorsByDepartment);
router.get('/top-doctors/:symptom', getTopDoctorsBySymptom); // ✅ new route

export default router;
