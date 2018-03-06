var path = require('path');
var express = require('express');

var port = process.env.PORT || 3000;
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.listen(port, () => console.log(`Server started on port ${port}`));