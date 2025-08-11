import express from 'express';
import {
  getAllHospitals,
  getHospitalById,
  getDoctorsByHospital
} from '../../controllers/Hospital&Doctor/hospitalController.js';

const router = express.Router();

router.get('/', getAllHospitals);
router.get('/:id', getHospitalById);
router.get('/:id/doctors', getDoctorsByHospital);

export default router;
