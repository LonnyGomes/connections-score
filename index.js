const express = require('express');

// Start the http server
const app = express();
global.port = 8000;
const server = app.listen(port, () => {
    console.log('Express Server Started')
})

// Serve the api
const apiRoutes = require('./routes/api.js');
app.use('/api',apiRoutes.router);