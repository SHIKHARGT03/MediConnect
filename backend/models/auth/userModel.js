import mongoose from 'mongoose';

// Helper to generate a unique patientId (could use uuid or similar in production)
function generatePatientId() {
  return 'PAT' + Math.floor(Math.random() * 1000000000);
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['hospital', 'visitor'],
    required: true,
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    default: null, // Only required for hospitals
  },
  patientId: {
    type: String,
    default: null, // Only for visitors
  }
}, { timestamps: true });

// Assign patientId on registration for visitors
userSchema.pre('save', function(next) {
  if (this.role === 'visitor' && !this.patientId) {
    this.patientId = generatePatientId();
  }
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
