const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const App = {

    randomCode: null,
    username: null,
    socket: null,

    init() {
        this.socket = io();
        this.bind();
        App.username = this.getUserName();

        if(App.username){
            this.socket.emit('user enter', App.username);
        }
        else{
            $('#block').style.display = "flex";
        }
    },

    bind() {
        this.socket
            .on('chat message', function(msg, username){
                Message.print(`${username} : ${msg}`);

                const chatArea = document.getElementById('msg_history');
                chatArea.scrollTop = chatArea.scrollHeight;
            })
            .on('user enter', function(username){
                Message.print(`system: ${username}님이 입장하셨습니다.`);
            })
    
        $('form').addEventListener('submit', Message.send, false);
    },

    getUserName() {
        if(!localStorage.hasOwnProperty('username')){
            
            const userInput = prompt('유저이름을 적어주세요.');
        
            if(userInput && userInput.trim() !== ''){
                localStorage.setItem('username', userInput);
                App.socket.emit('new user');
            }

        }

        return localStorage.getItem('username');
    },

    printUserList(type, username) {
        const elem = document.createElement("P");
    }

}

const Message = {

    send(e) {
        const msgInput = $('input');
        e.preventDefault();

        App.socket.emit('chat message', msgInput.value, App.username);
        msgInput.value = '';
        return false;
    },

    print(msg) {
        const html = document.createElement('li');
        html.innerText = msg;
        document.getElementById('msg_history').append(html);
    }

}

App.init();