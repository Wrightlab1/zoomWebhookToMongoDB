// webhookController.js

const crypto = require('crypto');
const logger = require('../utils/logger');
const databaseController = require('./databaseController')

// Handle webhook POST requests
async function handleWebhook(req, res) {
    try {
        var response;
        var responseHeaders = req.headers;
        logger.logInfo(`headers: ${JSON.stringify(responseHeaders)}`);
        const hooksResponse = JSON.stringify(req.body, null, 2);
        logger.logInfo(`Response : ${hooksResponse}`);

        // Construct the message string
        const message = `v0:${req.headers['x-zm-request-timestamp']}:${JSON.stringify(req.body)}`;

        // Hash the message string with the Webhook Secret Token
        const hashForVerify = crypto.createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET_TOKEN).update(message).digest('hex');
        const signature = `v0=${hashForVerify}`;

        // Validate the request signature
        if (req.headers['x-zm-signature'] === signature) {
            // Validate the webhook endpoint
            if (req.body.event === 'endpoint.url_validation') {
                const hashForValidate = crypto.createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET_TOKEN).update(req.body.payload.plainToken).digest('hex');
                response = {
                    message: {
                        plainToken: req.body.payload.plainToken,
                        encryptedToken: hashForValidate
                    },
                    status: 200
                };
            } else {
                // Authorized request
                response = { message: 'Authorized request to Zoom Webhook sample.', status: 200 };
                // Call the function to parse and save webhook data to the database
                await databaseController.parseWebhookData(req);
                // Business logic here
            }
        } else {
            // Unauthorized request
            response = { message: 'Unauthorized request to Zoom Webhook sample.', status: 401 };
        }

        logger.logInfo(response.message);
        res.status(response.status).json(response.message);
    } catch (error) {
        // Log and handle errors
        logger.logError(`Error handling webhook: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { handleWebhook };
