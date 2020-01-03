const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req,res) => res.sendFile(__dirname + '/index.html'));
app.use('/static', express.static(__dirname + '/public'));

io.on('connection', function(socket){

    io.emit('user enter');

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

    socket.on('new user', function(){
        io.emit('user enter');
    })

})

http.listen(3000, () => console.log('listening on *:3000'));