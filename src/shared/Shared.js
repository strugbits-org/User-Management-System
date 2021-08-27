const frontendURL = "https://8519-2400-adc1-1bd-5500-5ced-cc9d-ffce-b404.ngrok.io";

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
