// ==========================================
// メッセージシステム
// ==========================================
let messageQueue = [];
let nextGameState = null;
const messageBox = document.getElementById("message-box");

function showMessage(messages, nextState = null) {
    messageQueue = Array.isArray(messages) ? [...messages] : [messages];
    nextGameState = nextState;
    gameState = GAME_STATE.MESSAGE;
    messageBox.style.display = "block";
    advanceMessage();
}

function advanceMessage() {
    if (gameState !== GAME_STATE.MESSAGE) return;

    if (messageQueue.length > 0) {
        messageBox.innerHTML = messageQueue.shift();
    } else {
        messageBox.style.display = "none";
        gameState = nextGameState ? nextGameState : GAME_STATE.MAP;
        nextGameState = null;
    }
}