const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./src/api/auth");
const userRoutes = require("./src/api/user");
const conversationRoutes = require("./src/api/conversation");
const messageRoutes = require("./src/api/message");

const app = express();

// Connect DB
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/user/", userRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message/", messageRoutes);

// upload folder public
app.use('/uploads', express.static('uploads'));
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
