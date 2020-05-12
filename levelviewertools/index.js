const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

let objects = JSON.parse(fs.readFileSync('../assets/levelviewer/objects.json'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/gui.html');
});

app.use(express.static('../assets/levelviewer/'));

http.listen(3000, () => {
    console.log("Connected to port 3000");
});


io.on('connection', socket => {
    console.log("User connected");
    objects = JSON.parse(fs.readFileSync('../assets/levelviewer/objects.json'));
    if (!objects[1]) objects[1] = {layers: [], index: 1};
    setTimeout(() => socket.emit('object', objects[1]), 1000);
    fs.writeFileSync('../assets/levelviewer/objects.json', JSON.stringify(objects, null, 4));

    socket.on('object', id => {
        objects = JSON.parse(fs.readFileSync('../assets/levelviewer/objects.json'));
        if (!objects[id]) objects[id] = {layers: [], index: id};
        socket.emit('object', objects[id]);

        fs.writeFileSync('../assets/levelviewer/objects.json', JSON.stringify(objects, null, 4));
    })

    socket.on('saveObj', obj => {
        objects = JSON.parse(fs.readFileSync('../assets/levelviewer/objects.json'));
        objects[obj.index] = obj;
        fs.writeFileSync('../assets/levelviewer/objects.json', JSON.stringify(objects, null, 4));
    })
})
