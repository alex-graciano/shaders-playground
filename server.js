const express = require('express');
const app = express();
const path = require('path');

const port = 8080;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sketch.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
