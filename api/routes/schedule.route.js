const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Add a schedule
router.post('/schedule', scheduleController.addSchedule);

// Update a slot
router.put('/schedule/:id/slot', scheduleController.updateSlot);

// Get schedules
router.get('/schedules', scheduleController.getSchedules);

module.exports = router;
