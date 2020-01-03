const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const App = {

    username: null,
    socket: null,

    init() {
        this.socket = io();
        this.bind();
        App.username = this.getUserName();
    },

    bind() {
        this.socket
            .on('chat message', function(msg){
                printMsg(`${localStorage.username} : ${msg}`);
                const chatArea = document.getElementById('msg_history');
                chatArea.scrollTop = chatArea.scrollHeight;
            })
            .on('user enter', function(){
                if (localStorage.hasOwnProperty('username')) {
                    printMsg(`system: ${localStorage.username}님이 입장하셨습니다.`);
                }
            })
            

        $('form').addEventListener('submit', Message.send, false);
    },

    getUserName() {
        if(!localStorage.hasOwnProperty('username')){
            
            const userInput = prompt('유저이름을 적어주세요.');
        
            if(userInput && userInput.trim() !== ''){
                localStorage.setItem('username', userInput);
                socket.emit('new user');
            }

        }

        return localStorage.getItem('username');
    }

}

const Message = {

    send(e) {
        e.preventDefault();

        socket.emit('chat message', msgInput.value);
        document.querySelector('form').value = '';
        return false;
    },

    print() {
        const html = document.createElement('li');
        html.innerText = msg;
        document.getElementById('msg_history').append(html);
    }

}

App.init();