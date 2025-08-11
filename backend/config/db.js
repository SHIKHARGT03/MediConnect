// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('\n==============================');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log('==============================\n');
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed:', error.message);
    console.log('==============================\n');
    process.exit(1);
  }
};

export default connectDB;
