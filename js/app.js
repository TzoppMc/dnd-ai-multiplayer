// app.js - Main Application
import { DiceRoller } from './components/dice-roller.js';
import { ChatBox } from './components/chat-box.js';
import { GeminiService } from './services/gemini.js';
import CONFIG from './config.js';

class DnDApp {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.gemini = new GeminiService();
        this.initialize();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('game.html')) return 'game';
        if (path.includes('character.html')) return 'character';
        return 'lobby';
    }

    initialize() {
        switch(this.currentPage) {
            case 'lobby':
                this.initLobby();
                break;
            case 'game':
                this.initGame();
                break;
            case 'character':
                this.initCharacter();
                break;
        }
    }

    initLobby() {
        console.log('🎲 DnD Lobby Initialized');
        // Room creation logic
        document.querySelector('#form-create-room')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createRoom();
        });
    }

    initGame() {
        console.log('🎮 Game Room Initialized');
        
        // Initialize Dice Roller
        const diceContainer = document.querySelector('#dice-area');
        if (diceContainer) {
            new DiceRoller(diceContainer);
        }
        
        // Initialize Chat
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            // Placeholder socket service
            const mockSocket = {
                send: (event, data) => console.log('Socket send:', event, data),
                on: (event, callback) => console.log('Socket listener:', event)
            };
            new ChatBox(chatContainer, mockSocket);
        }
        
        // Test AI DM
        this.testAIDM();
    }

    initCharacter() {
        console.log('📋 Character Creation Initialized');
    }

    async testAIDM() {
        const testAction = {
            playerName: 'Aragorn',
            action: 'I want to check the room for traps and hidden doors'
        };
        
        const gameState = {
            location: 'Ancient Dungeon',
            party: ['Aragorn', 'Gandalf', 'Legolas', 'Gimli'],
            activeQuests: ['Find the lost artifact'],
            inCombat: false
        };
        
        console.log('🤖 Testing AI DM...');
        const response = await this.gemini.getDMResponse(testAction, gameState);
        console.log('📜 DM Response:', response);
    }

    createRoom() {
        const roomName = document.querySelector('#room-name').value;
        const maxPlayers = document.querySelector('#max-players').value;
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        console.log('Room Created:', { roomName, maxPlayers, roomCode });
        window.location.href = `game.html?room=${roomCode}`;
    }
}

// Start App
document.addEventListener('DOMContentLoaded', () => {
    window.dndApp = new DnDApp();
});
