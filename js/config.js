// config.js - API Keys & Configuration
const CONFIG = {
    // Gemini AI
    GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY',
    GEMINI_MODEL: 'gemini-pro',
    
    // Server (nanti diganti WebSocket server beneran)
    WS_URL: 'ws://localhost:3001',
    
    // Voice Chat (WebRTC)
    VOICE_ENABLED: false, // Enable nanti
    
    // Game Settings
    MAX_PLAYERS: 10,
    DEFAULT_DICE: 'd20',
    TURN_TIMER: 60, // seconds
    
    // Local Storage Keys
    STORAGE_KEYS: {
        PLAYER: 'dnd_player',
        CHARACTER: 'dnd_character',
        ROOM: 'dnd_room',
        SETTINGS: 'dnd_settings'
    }
};

export default CONFIG;
