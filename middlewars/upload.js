import multer from "multer";
import path from "path";

const destination = path.resolve("temp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, bc) => {
    const prefix = Date.now();
    const filename = `${prefix}_${file.originalname}`;
    bc(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024,
};

const upload = multer({
  storage,
  limits,
});

export default upload;
