// ==========================================
// 共通定数・グローバル設定
// ==========================================
const TILE_SIZE = 48; 

// ==========================================
// GAME STATE DEFINITION
// ==========================================
const GAME_STATE = {
    MAP: "MAP",
    MESSAGE: "MESSAGE",
    CHOICE: "CHOICE",
    MENU: "MENU",
    MENU_PARTY: "MENU_PARTY",
    MENU_BAG: "MENU_BAG",
    MENU_STATUS: "MENU_STATUS"
};

let gameState = GAME_STATE.MAP;

// ▼ 手持ち画面用のグローバル変数を安全に初期化
let partyCursor = 0;        
let switchTargetIndex = null;