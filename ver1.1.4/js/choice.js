// ==========================================
// 選択肢システム
// ==========================================
let choiceIndex = 0;
let choiceTargetType = null;

const CHOICE_EVENTS = {
    STARTER: {
        getChoices() { return STARTER_MASTER; },
        onSelect(index) {
            const starter = STARTER_MASTER[index];
            
            // 🌟 汎用ファクトリー関数で個体データを安全に生成
            addMonster(starter.id, 5); 
            
            player.hasStarter = true;
            return TEXT_MASTER.STARTER_SELECT[starter.id];
        }
    }
};

function startChoice(type) {
    choiceTargetType = type;
    choiceIndex = 0;
    gameState = GAME_STATE.CHOICE;
}

function getCurrentChoices() {
    if (!choiceTargetType) return [];
    return CHOICE_EVENTS[choiceTargetType].getChoices();
}

function drawChoiceWindow() {
    const choices = getCurrentChoices();
    ctx.fillStyle = "white";
    ctx.fillRect(260, 200, 200, 160);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeRect(260, 200, 200, 160);

    ctx.fillStyle = "black";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    choices.forEach((choice, index) => {
        const y = 240 + index * 45;
        if (index === choiceIndex) {
            ctx.fillText("▶", 280, y);
        }
        ctx.fillText(`${choice.emoji} ${choice.name}`, 310, y);
    });
}

function confirmChoice() {
    const event = CHOICE_EVENTS[choiceTargetType];
    const resultMessages = event.onSelect(choiceIndex);
    choiceTargetType = null;
    showMessage(resultMessages, GAME_STATE.MAP);
}