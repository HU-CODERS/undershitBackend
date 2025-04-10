const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');

// Definí la ruta correctamente
router.get('/', getDashboardData);

// Exportá el router DIRECTO
module.exports = router;
