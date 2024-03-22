const mongoose = require('mongoose');
const logger = require('./utils/logger');

const connectDB = async () => {
    // Connect to the database if DB_STRING is defined and is a non-empty string
    if (process.env.DB_STRING && typeof process.env.DB_STRING === 'string' && process.env.DB_STRING.trim() !== '') {
        try {
            mongoose.connect(process.env.DB_STRING, { autoIndex: false });
            const db = mongoose.connection;

            db.on("error", (error) => {
                logger.logError(`Connection error: ${error}`);
            });

            db.once("open", () => {
                logger.logInfo("MongoDB connected successfully.");
            });
        } catch (error) {
            logger.logError(`Error connecting to MongoDB: ${error.message}`);
        }
    } else {
        // Log an error if DB_STRING is undefined, null, or not a string
        logger.logError("process.env.DB_STRING is not defined, null, or not a string. Database connection not established.");
    }
}

module.exports = connectDB;