const frontendURL = "https://7ad7-2400-adc1-1bd-5500-1813-1f8e-bf7e-6d31.ngrok.io";

const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, req.user.id + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

module.exports = {
    frontendURL,
    upload: upload,
};
