const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req,res) => res.sendFile(__dirname + '/index.html'));
app.use('/static', express.static(__dirname + '/public'));

io.on('connection', function(socket){

    socket.on('user enter', function(username){
        io.emit('user enter', username)
    });

    socket.on('chat message', function(msg, username){
        io.emit('chat message', msg, username);
    });

    socket.on('disconnect', function(){
        io.emit('user exit');
    })

})

http.listen(3000, () => console.log('listening on *:3000'));