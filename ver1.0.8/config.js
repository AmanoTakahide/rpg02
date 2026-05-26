// ==========================================
// config.js : ゲームの基本設定・定数
// ==========================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 1マスのサイズ
const GRID_SIZE = 40;

// ゲームの画面モード ("MAP", "BATTLE", "MENU", "GAMEOVER")
let gameMode = "MAP";