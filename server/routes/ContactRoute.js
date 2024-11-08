const express = require("express");
const ContactRoutes = express.Router();
const { searchContacts, getContactsForDMList, getAllContacts } = require("../controllers/ContactController");
const { verifyToken } = require("../middleware/AuthMiddleware");

ContactRoutes.post('/search', verifyToken, searchContacts)
ContactRoutes.get('/get-contacts-for-dm', verifyToken, getContactsForDMList)
ContactRoutes.get('/get-all-contacts', verifyToken, getAllContacts)
module.exports = ContactRoutes;