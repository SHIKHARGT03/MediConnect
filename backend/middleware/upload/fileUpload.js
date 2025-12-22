import multer from "multer";
import path from "path";

// Accept only PDF & JPG
const allowedTypes = ["application/pdf", "image/jpeg"];

const storage = multer.diskStorage({}); // memory storage, file removed after upload to cloudinary

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only .pdf and .jpg allowed"), false);
};

const upload = multer({ storage, fileFilter });

export default upload;
