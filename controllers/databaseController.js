const WebhookData = require('../schemas/webhookSchema');
const logger = require('../utils/logger')

async function parseWebhookData(req) {
    const host = req.headers['host']
    const user_agent = req.headers['user-agent']
    const content_type = req.headers['content-type']
    const content_length = req.headers['content-length']
    const clientid = req.headers['clientid']
    const authorization = req.headers['authorization']
    const x_zm_signature = req.headers['x-zm-signature']
    const x_zm_request_timestamp = req.headers['x-zm-request-timestamp']
    const x_zm_trackingid = req.headers['x-zm-trackingid']
    const event = req.body.event
    const payload = req.body.payload
    const event_ts = req.body.event_ts
    try {
        // Extract data from req object
        //logger.logInfo(`Headers: ${JSON.stringify(req.headers)}, Body: ${JSON.stringify(req.body)}`)
        // Create a new document based on the extracted data
        const webhookInstance = new WebhookData({
            headers: {
                host: host,
                user_agent: user_agent,
                content_type: content_type,
                content_length: content_length,
                clientid: clientid,
                authorization: authorization,
                x_zm_signature: x_zm_signature,
                x_zm_request_timestamp: x_zm_request_timestamp,
                x_zm_trackingid: x_zm_trackingid
            },
            body: {
                event: event,
                payload: JSON.stringify(payload),
                event_ts: event_ts
            }
        });

        // Save the new document to the database
        try {
            logger.logInfo(`WebhookData:  ${webhookInstance}`)
            await webhookInstance.save();
            logger.logInfo('Webhook data saved to the database successfully.');
        } catch (error) {
            logger.logError(`Error saving data to database: ${error}`)
        }




    } catch (error) {
        logger.logError('Error parsing or saving webhook data:', error);
        throw error; // Rethrow the error to handle it in the caller
    }
}

// Fetch all entries in the db that match a key:value pair

async function fetchDataByKeyValue(key, value) {
    logger.logInfo(`Fetching data from database: ${key}:${value}`)
    try {
        // Find documents in the WebhookData collection that match the key-value pair
        const data = await WebhookData.find({ [key]: value });
        logger.logInfo(`Response from Database: ${JSON.stringify(data)}`)
        return data; // Return the matched documents
    } catch (error) {
        logger.logError(`Error fetching data from the database: ${error}`);
        throw error; // Rethrow the error to handle it in the caller
    }
}

async function fetchAllData() {
    logger.logInfo('Fetching all data from the database');
    try {
        // Find all documents in the WebhookData collection
        const allData = await WebhookData.find({});
        logger.logInfo('Response from Database:', allData);
        return allData; // Return all documents
    } catch (error) {
        logger.logError('Error fetching data from the database:', error);
        throw error; // Rethrow the error to handle it in the caller
    }
}
//Sort returned data by timestamp :event_ts
function sortDataByTimestamp(data, sortOrder = 'asc') {
    try {
        // Validate the sortOrder parameter
        if (sortOrder !== 'asc' && sortOrder !== 'desc') {
            throw new Error('Invalid sortOrder. Must be either "asc" or "desc".');
        }

        // Sort the data based on the 'event_ts' field
        data.sort((a, b) => {
            const timestampA = new Date(a.body.event_ts);
            const timestampB = new Date(b.body.event_ts);

            if (sortOrder === 'asc') {
                return timestampA - timestampB; // Ascending order
            } else {
                return timestampB - timestampA; // Descending order
            }
        });

        return data; // Return the sorted data
    } catch (error) {
        logger.logError(`Error sorting data: ${error}`);
        throw error; // Rethrow the error to handle it in the caller
    }
}
module.exports = { parseWebhookData, fetchDataByKeyValue, sortDataByTimestamp, fetchAllData };