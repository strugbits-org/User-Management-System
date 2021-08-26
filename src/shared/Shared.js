const frontendURL = "http://localhost:3000";

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
    frontendURL: frontendURL,
    upload: upload,
};
