const frontendURL = "https://cf05-2400-adc1-41a-1000-6185-8f5-38b5-182b.ngrok.io";

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
