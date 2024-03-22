// USAGE
// import logger into another file: const logger = require('../path/to/logger')
// To log  info: logger.logInfo('infoHere')
//To log debug data: logger.logDebug('debugDataHere')
//To log errors: logger.logError('errorHere')


// Import the Winston module for logging
const winston = require("winston");
// Import the path module for file paths
const path = require('path');



// Define logger configuration
const logger = winston.createLogger({
    // Set the logging level to the environment variable LOG_LEVEL or 'info' by default
    level: process.env.LOG_LEVEL || 'info',
    // Define the format of the log messages
    format: winston.format.combine(
        // Add a timestamp to each log message
        winston.format.timestamp(),
        // Print the log level, timestamp, and message in the specified format
        winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    // Define the transports (destinations) for log messages
    transports: [
        // Log to the console
        new winston.transports.Console(),
        // Log info messages to a file
        new winston.transports.File({
            name: 'info-file',
            filename: path.join(__dirname, '..', 'logs', 'filelog-info.log'),
            level: 'info',
            // Handle exceptions and format them in a human-readable way
            handleExceptions: true,
            humanReadableUnhandledException: true
        }),
        // Log error messages to a file
        new winston.transports.File({
            name: 'error-file',
            filename: path.join(__dirname, '..', 'logs', 'filelog-error.log'),
            level: 'error',
            // Handle exceptions and format them in a human-readable way
            handleExceptions: true,
            humanReadableUnhandledException: true
        })
    ],
    // Continue logging even if an error occurs
    exitOnError: false
});

// Log uncaught exceptions to error file
process.on('uncaughtException', (err) => {
    // Log uncaught exceptions to the console and error file
    console.error('Uncaught Exception:', err);
    logger.error('Uncaught Exception:', err);
});

// Log unhandled rejections to error file
process.on('unhandledRejection', (reason, promise) => {
    // Log unhandled rejections to the console and error file
    console.error('Unhandled Rejection:', reason);
    // Log unhandled promise as a custom error if it's detected
    if (reason && reason instanceof Error && reason.promise && reason.promise instanceof Promise) {
        logger.error('Unhandled Rejection: Unhandled Promise Error');
    } else {
        logger.error('Unhandled Rejection:', reason);
    }
});



// Function to log information messages
function logInfo(message) {
    // If the message is an object, stringify it before logging
    if (typeof message === 'object') {
        message = JSON.stringify(message);
    }
    // Log the message at the info level
    logger.info(message);
}

// Function to log debug data
function logDebug(data) {
    // If the data is an object, stringify it before logging
    if (typeof data === 'object') {
        data = JSON.stringify(data);
    }
    // Log the data at the debug level
    logger.debug(data);
}

// Function to log error messages
function logError(error) {
    // If the error is an object, stringify it before logging
    if (typeof error === 'object') {
        error = JSON.stringify(error);
    }
    // Log the error message at the error level
    logger.error(error);
}

// Export the logger and logging functions for use in other modules
module.exports = { logger, logError, logDebug, logInfo };