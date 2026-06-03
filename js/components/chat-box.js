// chat-box.js - Chat Component
export class ChatBox {
    constructor(container, socketService) {
        this.container = container;
        this.socket = socketService;
        this.messages = [];
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="chat-box">
                <div id="chat-messages" class="chat-messages"></div>
                
                <div id="emote-picker" class="emote-picker hidden">
                    ${this.getEmoteList()}
                </div>
                
                <div class="chat-input-area">
                    <button id="btn-emote-toggle" class="btn-icon">😊</button>
                    <input type="text" id="chat-input" placeholder="Type message..." maxlength="500">
                    <button id="btn-send-message" class="btn-icon">📤</button>
                </div>
            </div>
        `;
        
        this.attachEvents();
    }

    getEmoteList() {
        const emotes = ['😊','😂','🤣','😍','😎','🤩','😤','😢','😡','👍','👎','🎉','❤️','🔥','💯'];
        return emotes.map(emoji => 
            `<span class="emote-item" data-emote="${emoji}">${emoji}</span>`
        ).join('');
    }

    attachEvents() {
        const input = this.container.querySelector('#chat-input');
        const sendBtn = this.container.querySelector('#btn-send-message');
        const emoteBtn = this.container.querySelector('#btn-emote-toggle');
        
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        emoteBtn.addEventListener('click', () => {
            const picker = this.container.querySelector('#emote-picker');
            picker.classList.toggle('hidden');
        });
        
        // Emote picker events
        this.container.querySelectorAll('.emote-item').forEach(emote => {
            emote.addEventListener('click', (e) => {
                this.sendMessage(e.target.dataset.emote);
                this.container.querySelector('#emote-picker').classList.add('hidden');
            });
        });
    }

    sendMessage(content) {
        const input = this.container.querySelector('#chat-input');
        const message = content || input.value.trim();
        
        if (!message) return;
        
        const messageData = {
            type: message.length <= 2 && /[\u{1F600}-\u{1F64F}]/u.test(message) ? 'emote' : 'text',
            content: message,
            timestamp: Date.now(),
            sender: this.getCurrentPlayer()
        };
        
        this.addMessage(messageData);
        this.socket.send('chat-message', messageData);
        
        input.value = '';
    }

    addMessage(message) {
        const messagesContainer = this.container.querySelector('#chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.type}`;
        messageElement.innerHTML = `
            <span class="message-sender">${message.sender.name}</span>
            <span class="message-content">${message.content}</span>
            <span class="message-time">${new Date(message.timestamp).toLocaleTimeString()}</span>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    getCurrentPlayer() {
        return JSON.parse(localStorage.getItem('dnd_player')) || { name: 'Player' };
    }
}
