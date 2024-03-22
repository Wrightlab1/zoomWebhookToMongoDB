require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const webhooks = require('./routes/webhooks')
const connectDB = require('./db')


const app = express()
const port = process.env.PORT || 4001

app.use(bodyParser.json())

//INCLUDE ROUTES
app.use('/webhooks', webhooks)

// GET request to test webhook URL
app.get('/', (req, res) => {
  res.status(200).send('Zoom Webhook sample successfully running. Set this URL with the /webhook path as your apps Event notification endpoint URL. https://github.com/zoom/webhook-sample');
});



// Connect to the database
connectDB().then(() => {
  // Start the server after establishing the database connection
  if (!process.env.PORT) {
    logger.logInfo(`Using default port ${defaultPort} because PORT environment variable is not configured.`);
  }
  const server = app.listen(port, () => {
    logger.logInfo(`App is listening on port ${port}`);
    // Error handling for starting the server
    server.on('error', (error) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      switch (error.code) {
        case 'EACCES':
          logger.logError(`Port ${port} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.logError(`Port ${port} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });
  });

  // Graceful shutdown logic...
}).catch(error => {
  logger.logError('Failed to connect to the database. Exiting...');
  process.exit(1);
});


