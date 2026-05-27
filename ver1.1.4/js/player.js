// === FILE: js/player.js ===

// ==========================================
// プレイヤーデータ
// ==========================================
const player = {
    name: "クソオス",
    x: 7,
    y: 7,
    drawX: 7,
    drawY: 7,
    direction: "down",
    moveSpeed: 0.18,
    isMoving: false,
    money: 3000,
    badges: 0,
    playTime: 0,
    party: [],
    hasStarter: false,
    maxPartySize: 6,
    bag: [
        { id: "BALL", name: "ボール", count: 5 },
        { id: "GOLD_BALL", name: "ゴールデンボール", count: 1 },
        { id: "POTION", name: "きんぱぶ", count: 2 }
    ]
};

// ==========================================
// 🌟 汎用モンスター追加関数（進化版ファクトリーパターン）
// ==========================================
function addMonster(monsterId, level = 5) {
    // text.js からではなく、新しい monster.js のマスタから取得
    const race = MONSTER_MASTER[monsterId];
    if (!race) {
        console.error(`Monster ID "${monsterId}" はマスタに存在しません。`);
        return false;
    }

    if (player.party.length >= player.maxPartySize) {
        alert("手持ちが いっぱいです！"); 
        return false;
    }

    // 経験値計算
    const currentExp = Math.pow(level, 3);
    const nextExp = Math.pow(level + 1, 3);

    // 🌟 新仕様：レベルに応じて覚えているわざ（最大4つ）をマスタから自動抽出
    const myMoves = [];
    // レベル以下のわざをフィルターして、設定順に取得
    const availableMoves = race.levelMoves.filter(m => m.level <= level);
    
    // 直近のわざを最大4つ取り出す（本家のレベルアップ初期技ロジック）
    const startIdx = Math.max(0, availableMoves.length - 4);
    for (let i = startIdx; i < availableMoves.length; i++) {
        myMoves.push(availableMoves[i].moveId);
    }
    
    // 4つに満たない場合は空文字で埋める
    while (myMoves.length < 4) {
        myMoves.push("");
    }

    // 個体（インスタンス）を生成して手持ちへプッシュ
    player.party.push({
        id: race.id,
        name: race.name,
        emoji: race.emoji,
        level: level,
        hp: race.baseStats.hp,     // マスタの種族値ベース
        maxHp: race.baseStats.hp,
        exp: currentExp,
        nextExp: nextExp,
        moves: myMoves             // 100大わざのID配列が格納される
    });

    return true;
}