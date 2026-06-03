// dice-roller.js - Komponen Dadu 3D Sederhana
export class DiceRoller {
    constructor(container) {
        this.container = container;
        this.isRolling = false;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="dice-roller">
                <div class="dice-display">
                    <div id="dice-result" class="dice-result">🎲</div>
                    <div id="dice-total" class="dice-total">0</div>
                </div>
                <div class="dice-controls">
                    <div class="dice-buttons">
                        <button class="dice-btn" data-dice="d4">d4</button>
                        <button class="dice-btn" data-dice="d6">d6</button>
                        <button class="dice-btn" data-dice="d8">d8</button>
                        <button class="dice-btn" data-dice="d10">d10</button>
                        <button class="dice-btn" data-dice="d12">d12</button>
                        <button class="dice-btn" data-dice="d20">d20</button>
                    </div>
                    <input type="text" id="custom-roll" placeholder="2d20+5" class="dice-input">
                    <button id="btn-roll" class="btn btn-primary">Roll!</button>
                </div>
                <div id="roll-history" class="roll-history"></div>
            </div>
        `;
        
        this.attachEvents();
    }

    attachEvents() {
        // Dice buttons
        this.container.querySelectorAll('.dice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const diceType = e.target.dataset.dice;
                this.rollDice(diceType);
            });
        });
        
        // Roll button
        this.container.querySelector('#btn-roll').addEventListener('click', () => {
            const customRoll = this.container.querySelector('#custom-roll').value;
            if (customRoll) {
                this.rollCustom(customRoll);
            }
        });
    }

    rollDice(diceType) {
        if (this.isRolling) return;
        this.isRolling = true;
        
        const sides = parseInt(diceType.replace('d', ''));
        const result = Math.floor(Math.random() * sides) + 1;
        
        this.animateRoll(diceType, result);
    }

    animateRoll(diceType, result) {
        const resultDiv = this.container.querySelector('#dice-result');
        const totalDiv = this.container.querySelector('#dice-total');
        
        // Simple rolling animation
        let rolls = 0;
        const maxRolls = 10;
        
        const rollInterval = setInterval(() => {
            const randomResult = Math.floor(Math.random() * parseInt(diceType.replace('d', ''))) + 1;
            resultDiv.textContent = this.getDiceEmoji(diceType);
            totalDiv.textContent = randomResult;
            
            rolls++;
            if (rolls >= maxRolls) {
                clearInterval(rollInterval);
                totalDiv.textContent = result;
                this.addToHistory(diceType, result);
                this.isRolling = false;
            }
        }, 100);
    }

    getDiceEmoji(diceType) {
        const emojis = {
            'd4': '🔺',
            'd6': '🎲',
            'd8': '💎',
            'd10': '🔟',
            'd12': '🔷',
            'd20': '🎯'
        };
        return emojis[diceType] || '🎲';
    }

    addToHistory(diceType, result) {
        const history = this.container.querySelector('#roll-history');
        const rollEntry = document.createElement('div');
        rollEntry.className = 'roll-entry';
        rollEntry.textContent = `${diceType}: ${result}`;
        history.prepend(rollEntry);
        
        // Keep only last 10 rolls
        if (history.children.length > 10) {
            history.removeChild(history.lastChild);
        }
    }

    rollCustom(rollString) {
        // Parse "2d20+5" format
        const match = rollString.match(/(\d+)?d(\d+)([+-]\d+)?/);
        if (!match) return;
        
        const count = parseInt(match[1] || 1);
        const sides = parseInt(match[2]);
        const modifier = parseInt(match[3] || 0);
        
        let total = 0;
        for (let i = 0; i < count; i++) {
            total += Math.floor(Math.random() * sides) + 1;
        }
        total += modifier;
        
        this.animateRoll(`d${sides}`, total);
    }
}
