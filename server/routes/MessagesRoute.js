const express = require("express");
const MessageRoutes = express.Router();
const { getMessages, uploadFile } = require("../controllers/MessagesController");
const { verifyToken } = require("../middleware/AuthMiddleware");
const multer = require("multer");

const upload = multer({dest: "uploads/files"})
MessageRoutes.post('/get-messages', verifyToken, getMessages);
MessageRoutes.post('/upload-file', verifyToken, upload.single("file"), uploadFile);

module.exports = MessageRoutes;