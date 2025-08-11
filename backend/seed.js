import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Hospital from './models/Hospital&Doctor/Hospital.js';
import Doctor from './models/Hospital&Doctor/Doctor.js';
import User from './models/auth/userModel.js';
import faker from 'faker';
import bcrypt from 'bcryptjs';

dotenv.config();
await connectDB();

await Doctor.deleteMany();
await Hospital.deleteMany();
await User.deleteMany(); // ✅ Clean old users

const commonDepartments = ["Cardiology", "Orthopedics", "General OPD", "Pulmonology", "Neurology"];

const hospitalData = [
  {
    name: "MediCare Multispeciality",
    location: "Delhi",
    hasLab: true,
    uniqueDepartment: "Pediatrics",
    email: "medicare@hospital.com",
    password: "MediCare@123"
  },
  {
    name: "City Health Hospital",
    location: "Mumbai",
    hasLab: false,
    uniqueDepartment: "Radiology",
    email: "cityhealth@hospital.com",
    password: "CityHealth@123"
  },
  {
    name: "Sunrise Wellness Clinic",
    location: "Bangalore",
    hasLab: true,
    uniqueDepartment: "ENT",
    email: "sunrise@hospital.com",
    password: "Sunrise@123"
  }
];

const degreePool = [["MBBS", "MD"], ["MBBS", "MS"], ["MBBS", "DNB"], ["MBBS", "MD", "DM"]];
const nativeLanguages = ["Bengali", "Marathi", "Kannada", "Tamil", "Telugu", "Punjabi", "Gujarati"];
const experienceGroups = [
  [12, 7, 2],
  [15, 9, 3],
  [10, 6, 1]
];

for (const h of hospitalData) {
  const departments = [...commonDepartments, h.uniqueDepartment];

  const hospital = new Hospital({
    name: h.name,
    location: h.location,
    hasLab: h.hasLab,
    departments,
    description: `${h.name} is a reputed institution in ${h.location}, known for its specialized care.`,
    contact: faker.phone.phoneNumber('+91-##########'),
  });

  await hospital.save();

  // ✅ Create hospital's login User
  const hashedPassword = await bcrypt.hash(h.password, 10);
  await new User({
    name: h.name,
    email: h.email,
    password: hashedPassword,
    role: "hospital",
    hospitalId: hospital._id
  }).save();

  // ✅ Create doctors
  for (const dept of departments) {
    const expSet = experienceGroups[Math.floor(Math.random() * experienceGroups.length)];
    
    for (let i = 0; i < 3; i++) {
      const doctor = new Doctor({
        name: `Dr. ${faker.name.findName()}`,
        specialization: dept,
        department: dept,
        experience: expSet[i],
        degrees: degreePool[Math.floor(Math.random() * degreePool.length)],
        languages: ["English", "Hindi", ...(Math.random() > 0.5 ? [nativeLanguages[Math.floor(Math.random() * nativeLanguages.length)]] : [])],
        bio: `Specialist in ${dept.toLowerCase()} with ${expSet[i]} years of clinical experience.`,
        hospitalId: hospital._id
      });

      await doctor.save();
    }
  }
}

console.log("\n✅ Seed data created successfully.\n");
process.exit();
