const messageTypes = { LEFT: 'left', RIGHT: 'right', LOGIN: 'login'};

//Chat vars
const chatWindow = document.getElementById('chat');
const messageList = document.getElementById('messageList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

//Login vars
let username = '';
const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');
const loginWindow = document.getElementById('login');

const messages = []; // {author, date, content, type}

var socket = io();


socket.on('message', message => {
    console.log(message);
    if (message.type !== messageTypes.LOGIN) {
        if (message.author === username) {
            message.type = messageTypes.RIGHT;
        }
        else {
            message.type = messageTypes.LEFT;
        }
    }

    messages.push(message);
    displayMessages();

    chatWindow.scrollTop = chatWindow.scrollHeight;
});


// Take in message object, and return corresponding message HTML
const createMessageHTML = message => {
    if(message.type == messageTypes.LOGIN) {
        return `
            <p class="secondary-text text-center mb-2">${
                message.author
            } has joined the chat...</chat></p>
        `;
    }

    return `
        <div class="message ${
            message.type === messageTypes.LEFT ? 'message-left' : 'message-right'
        }">
            <div class="message-details flex">
                <p class="flex-grow-1 message-author">${
                    message.type === messageTypes.RIGHT ? '' : message.author
                }</p>
                <p class="message-date">${message.date}</p>
            </div>
            <p class="message-content">${message.content}</p>
        </div>
    `;
};


const displayMessages = () => {
    const messagesHTML = messages
        .map((message) => createMessageHTML(message))
        .join('');
    messageList.innerHTML = messagesHTML;
};


//sendBtn callback
sendBtn.addEventListener('click', e => {
    //preventdefault of a form
    e.preventDefault();
    if (!messageInput.value){
        return console.log('must supply a message');
    }
    
    const date = new Date();
    const sendingTime = `${date.getHours()}:${date.getMinutes()}`;
    const sendingDate = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;

    const message = {
        author: username,
        date: `${sendingTime} ${sendingDate}`,
        content: messageInput.value
    }

    sendMessage(message);

    messageInput.value = '';
});


const sendMessage = message => {
    socket.emit('message', message);

};


//lohinBtn callback
loginBtn.addEventListener('click', e => {
    //preventdefault of a form
    e.preventDefault();
    //set the username adnd create logged in message
    if (!usernameInput.value){
        return console.log('must supply a username');
    }
    username = usernameInput.value;

    sendMessage({
        author: username,
        type: messageTypes.LOGIN
    });
    
    //hide login and show chat window
    loginWindow.classList.add('hidden')
    chatWindow.classList.remove('hidden')

});
