// === FILE: js/monster.js ===

// ==========================================
// 1. モンスター種族マスタ（MONSTER_MASTER）
// ==========================================
const MONSTER_MASTER = {
    "TAMA_MOUSE": {
        id: "TAMA_MOUSE",
        name: "タマウス",
        emoji: "🐭",
        type: ["NORMAL"],
        // 種族値（HP, こうげき, ぼうぎょ, とくこう, とくぼう, すばやさ）
        baseStats: { hp: 35, attack: 55, defense: 40, spAtk: 50, spDef: 50, speed: 90 },
        evolutionLvl: 16,
        evolutionTarget: "DEKA_MOUSE",
        // 🌟 先ほどの「わざマスタ」のIDと100%完全一致させた修得テーブル
        levelMoves: [
            { level: 1,  moveId: "TAIATARI" },
            { level: 1,  moveId: "NAKIGOE" },
            { level: 5,  moveId: "HIKKAKI" },
            { level: 7,  moveId: "QUICK_ATTACK" },
            { level: 10, moveId: "KUSO_TACKLE" },
            { level: 13, moveId: "ZUTSUKI" },
            { level: 18, moveId: "TSURUGI_NO_MAI" },
            { level: 25, moveId: "SUTEMI_TACKLE" },
            { level: 36, moveId: "EXTREME_SPEED" },
            { level: 45, moveId: "GIGA_IMPACT" }
        ]
    },
    "SHIKOSH": {
        id: "SHIKOSH",
        name: "シコッシュ",
        emoji: "🧻",
        type: ["MIZU"],
        baseStats: { hp: 44, attack: 48, defense: 65, spAtk: 50, spDef: 64, speed: 43 },
        evolutionLvl: 16,
        evolutionTarget: "MAX_SHIKOSH",
        levelMoves: [
            { level: 1,  moveId: "TAIATARI" },
            { level: 1,  moveId: "KARA_NI_KOMORU" },
            { level: 5,  moveId: "AWA" },
            { level: 8,  moveId: "MIZU_DEPPOU" },
            { level: 12, moveId: "WATER_PULSE" },
            { level: 15, moveId: "KAGE_BUNSHIN" },
            { level: 20, moveId: "CLAW_PUMP" },
            { level: 28, moveId: "SURF" },
            { level: 35, moveId: "HYDRO_PUMP" },
            { level: 42, moveId: "HYDRO_CANNON" }
        ]
    },
    "ANARU": {
        id: "ANARU",
        name: "アナルー",
        emoji: "🍑",
        type: ["ESP", "GHOST"],
        baseStats: { hp: 60, attack: 30, defense: 50, spAtk: 65, spDef: 65, speed: 40 },
        evolutionLvl: 18,
        evolutionTarget: "KURE_ANARU",
        levelMoves: [
            { level: 1,  moveId: "HIKKAKI" },
            { level: 1,  moveId: "SING" },
            { level: 5,  moveId: "NENRIKI" },
            { level: 9,  moveId: "CONFUSE_RAY" },
            { level: 14, moveId: "NIGHT_SHADE" },
            { level: 19, moveId: "SHADOW_CLAW" },
            { level: 24, moveId: "SHADOW_BALL" },
            { level: 30, moveId: "PSYCHOKINESIS" },
            { level: 38, moveId: "MIRACLE_EYE" },
            { level: 45, moveId: "RECOVER" }
        ]
    }
};

// 御三家選択配列をマスタから自動生成
const STARTER_MASTER = [
    MONSTER_MASTER.TAMA_MOUSE,
    MONSTER_MASTER.SHIKOSH,
    MONSTER_MASTER.ANARU
];

// ==========================================
// 2. 汎用データアクセスAPI
// ==========================================
function getMonsterRace(monsterId) {
    return MONSTER_MASTER[monsterId] || {
        id: "UNKNOWN", name: "???", emoji: "❓", type: ["NORMAL"],
        baseStats: { hp: 10, attack: 10, defense: 10, spAtk: 10, spDef: 10, speed: 10 },
        levelMoves: []
    };
}