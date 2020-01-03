const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req,res) => res.sendFile(__dirname + '/index.html'));
app.use('/static', express.static(__dirname + '/public'));

const users = {};

io.on('connection', function(socket){

    let user, code;

    socket.on('user enter', function(username){
        user = username;

        users[socket.id] = user;

        io.emit('user enter', username, users);
    });

    socket.on('chat message', function(msg, username){
        io.emit('chat message', msg, username);
    });

    socket.on('disconnect', function(){
        delete users[socket.id];
        io.emit('user exit', user, users);
    })

})

http.listen(3000, () => console.log('listening on *:3000'));