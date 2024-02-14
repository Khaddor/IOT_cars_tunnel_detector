// Import the Express.js framework
const express = require('express');
// Create an instance of the Express application
const app = express();

// Define routes
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
