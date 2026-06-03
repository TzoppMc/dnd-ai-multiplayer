// gemini.js - Gemini AI Service
import CONFIG from '../config.js';

export class GeminiService {
    constructor() {
        this.apiKey = CONFIG.GEMINI_API_KEY;
        this.context = [];
        this.initContext();
    }

    initContext() {
        this.context = [
            {
                role: "user",
                parts: "You are a professional DnD 5e Dungeon Master. Be creative, fair, and engaging."
            },
            {
                role: "model", 
                parts: "I am an experienced DnD Dungeon Master. I create immersive stories, manage combat fairly, and ensure all players have fun."
            }
        ];
    }

    async getDMResponse(playerAction, gameState) {
        const prompt = `
            As the Dungeon Master, respond to this player action:
            
            Player: ${playerAction.playerName}
            Action: ${playerAction.action}
            
            Current Game State:
            - Location: ${gameState.location}
            - Party Members: ${gameState.party.join(', ')}
            - Active Quests: ${gameState.activeQuests.join(', ')}
            - Combat Status: ${gameState.inCombat ? 'In Combat' : 'Not in Combat'}
            
            Respond naturally as a DM would. Include:
            1. Narrative description
            2. Any dice rolls needed (specify DC if applicable)
            3. NPC reactions if present
            4. Consequences of the action
        `;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [...this.context, { role: "user", parts: prompt }],
                        generationConfig: {
                            temperature: 0.8,
                            maxOutputTokens: 500,
                        }
                    })
                }
            );

            const data = await response.json();
            const dmResponse = data.candidates[0].content.parts[0].text;
            
            // Save context
            this.context.push(
                { role: "user", parts: prompt },
                { role: "model", parts: dmResponse }
            );
            
            // Keep context manageable
            if (this.context.length > 10) {
                this.context = this.context.slice(-10);
            }
            
            return dmResponse;
        } catch (error) {
            console.error('Gemini API Error:', error);
            return "The Dungeon Master seems to be contemplating... (AI Error)";
        }
    }
}
