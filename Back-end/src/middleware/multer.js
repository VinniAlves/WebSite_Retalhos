const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    const folder = uuidv4();
    file.folderName = folder; 
    
    const uploadBase = process.env.NODE_ENV === 'production'
      ? "/server/ProjectRunning/Back-end/Uploads"
      : path.join(__dirname, "../../Uploads");
      
    const uploadPath = path.join(uploadBase, folder);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.uploadImages = multer({ storage });