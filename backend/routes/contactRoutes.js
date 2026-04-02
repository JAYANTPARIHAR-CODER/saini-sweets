const express = require('express');
const router = express.Router();

const { createContact, getContacts } = require('../controllers/contactController');

router.post('/', createContact);   // POST /api/contact
router.get('/',  getContacts);     // GET  /api/contact

module.exports = router;