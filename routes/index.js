const express = require('express');

const router = express.Router();

// redirect from index to catalog
router.get('/', (req, res) => res.redirect('/catalog'));

module.exports = router;
