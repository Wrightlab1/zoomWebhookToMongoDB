const logger = require('../utils/logger')

/**
 * Middleware to validate required fields in the request body based on multiple keys.
 * @param {...string} keys - The keys for the required fields.
 * @returns {Function} - Express middleware function.
 */
function validateFields(...keys) {
    return (req, res, next) => {
        try {
            const missingKeys = [];

            // Check if all specified keys exist in the request body
            for (const key of keys) {
                if (!(key in req.body)) {
                    missingKeys.push(key);
                }
            }

            // If any keys are missing, return 400 with a list of missing keys
            if (missingKeys.length > 0) {
                return res.status(400).json({ error: `Missing fields: ${missingKeys.join(', ')}` });
            }

            // If all keys are present, proceed to the next middleware
            next();
        } catch (error) {
            logger.logError(`Error validating fields: ${error}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}

// Middleware to check if request body is JSON
function checkJSON(req, res, next) {
    if (req.is('json')) {
        next(); // Proceed to the next middleware or route handler
    } else {
        res.status(400).json({ error: 'Request body must be JSON.' }); // Send a 400 Bad Request response
    }
}

module.exports = { validateFields, checkJSON };