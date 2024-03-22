const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
    headers: {
        'host': String,
        'user_agent': String,
        'content_type': String,
        'content_length': String,
        'clientid': String,
        'authorization': String,
        'x_zm_signature': String,
        'x_zm_request_timestamp': String,
        'x_zm_trackingid': String
    },
    body: {
        'event': String,
        'payload': mongoose.Schema.Types.Mixed,
        'event_ts': Date
    }
});

const Webhook = mongoose.model('Webhook', webhookSchema, process.env.DB_NAME);

module.exports = Webhook;