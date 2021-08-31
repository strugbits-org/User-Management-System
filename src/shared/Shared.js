const frontendURL = "https://e484-2400-adc1-41a-1000-6029-fb80-f539-4f5f.ngrok.io";

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
