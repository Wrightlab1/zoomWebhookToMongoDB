const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');
const databaseController = require('../controllers/databaseController')
const logger = require('../utils/logger')
const { validateFields, checkJSON } = require('../middleware/middleware')


// POST request to handle webhook events
router.post('/', webhookController.handleWebhook);

// Route to fetch data based on key-value pair
router.get('/', checkJSON, validateFields('key', 'value'), async (req, res) => {
    logger.logInfo('GET /webhooks')
    try {
        const key = req.query.key;
        const value = req.query.value;
        const response = await databaseController.fetchDataByKeyValue(key, value);
        res.status(200).json(response);
    } catch (error) {
        logger.logError(`Error fetching data: ${error}`);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// Route to fetch all data
router.get('/all', checkJSON, async (req, res) => {
    try {
        const response = await databaseController.fetchAllData();
        res.status(200).json(response); // Sending data as JSON
    } catch (error) {
        logger.logError(`Error fetching data: ${error}`);
        res.status(500).json({ error: 'An error occurred while fetching data.' }); // Sending error response
    }
});
module.exports = router;