const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const App = {
    randomCode: null,
    username: null,
    socket: null,

    async init() {
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
            .on('user enter', function(username, userlist){
                Message.print(`system: ${username}님이 입장하셨습니다.`);
                App.showUserList(userlist);
            })
            .on('user exit', function(username, userlist){
                Message.print(`system: ${username}님이 퇴장하셨습니다.`);
                App.showUserList(userlist);
            })
            .on('show typing userlist', App.showTypers)
    
        $('form').addEventListener('submit', Message.send, false);
        $('input').addEventListener('input', Message.detectTyping)
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

    showUserList(userlist) {
        $('#users').innerHTML = '';

        Object.values(userlist).forEach(x => {
            const elem = document.createElement('li');
            elem.innerText = x.username;
            $('#users').appendChild(elem);
        })
    },

    showTypers(userlist) {
        const typers = Object.values(userlist).filter(x => x.is_typing).map(x => x.username);

        const text = typers.join(', ') + '님이 입력중입니다...';
        $('#typing_indicator').innerText = typers.length ? text : '';
    }
}

const Message = {
    typing: false,

    send(e) {
        const msgInput = $('input');
        e.preventDefault();

        App.socket.emit('chat message', msgInput.value, App.username);
        App.socket.emit('change typing status', false);

        msgInput.value = '';
        Message.typing = false;
        return false;
    },

    print(msg) {
        const html = document.createElement('li');
        html.innerText = msg;
        document.getElementById('msg_history').append(html);
    },

    detectTyping(e) {
        const typingContent = this.value;
        const was_typing = Message.typing;

        console.log(was_typing, !!typingContent);

        if( (!!typingContent) !== was_typing ){
            Message.typing = !Message.typing;
            App.socket.emit('change typing status', Message.typing);
        }
    }
}

App.init();