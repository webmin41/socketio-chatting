
if(!localStorage.hasOwnProperty('username')){
            
    const userInput = prompt('유저이름을 적어주세요.');

    if(userInput){
        localStorage.setItem('username', userInput).trim();
    }
    else{
        document.getElementById('block').style.display = 'flex';
    }

}

const socket = io();
const msgInput = document.getElementById('message');

function printMsg(msg){
    const html = document.createElement('li');
    html.innerText = msg;
    document.getElementById('msg_history').append(html);
}

document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault();

    socket.emit('chat message', msgInput.value);
    msgInput.value = '';
    return false;
}, false);

socket.on('chat message', function(msg){
    printMsg(`${localStorage.username} : ${msg}`);
})