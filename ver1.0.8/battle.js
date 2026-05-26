// ==========================================
// battle.js : 戦闘処理 & NPCリアルタイム個別タイマー駆動システム
// ==========================================

let activeEnemy = null;
let commandIndex = 0;
let isBattleAnimating = false;
let battleLines = [];
let battleIndex = 0;

// バトルの開始
function startBattle(enemy) {
    gameMode = "BATTLE";
    activeEnemy = enemy;
    commandIndex = 0;
    isBattleAnimating = false;
    battleLines = [];
    battleIndex = 0;
}

// コマンド選択時の処理
function selectCommand() {
    if (commandIndex === 0) { // たたかう
        executeTurn("ATTACK");
    } else if (commandIndex === 3) { // にげる
        executeTurn("ESCAPE");
    } else {
        isBattleAnimating = true;
        battleLines = ["🛠️ そのコマンドはまだ未実装だ！", "Aボタンで もどる"];
        battleIndex = 0;
    }
}

// ターン全体の攻防戦
function executeTurn(playerAction) {
    isBattleAnimating = true;
    battleLines = [];
    battleIndex = 0;

    if (playerAction === "ESCAPE") {
        const escapeChance = Math.random();
        if (escapeChance < 0.6) {
            battleLines.push("__ESCAPE_SUCCESS__");
            return;
        } else {
            battleLines.push("🏃‍♂️ 👆🏻は 逃げ出そうとした！");
            battleLines.push("💨 しかし 回り込まれてしまった！");
            enemyTurn();
            return;
        }
    }

    // 👆🏻 プレイヤーの先制攻撃
    if (player.spd >= activeEnemy.spd) {
        playerTurn();
        if (activeEnemy.hp > 0) {
            enemyTurn();
        }
    } 
    // エネミーの先制攻撃
    else {
        enemyTurn();
        if (player.hp > 0) {
            playerTurn();
        }
    }
}

function playerTurn() {
    const damage = Math.max(1, player.atk);
    activeEnemy.hp -= damage;
    battleLines.push(`⚔️ 👆🏻の こうげき！`);
    battleLines.push(`💥 ${activeEnemy.name}に ${damage}の ダメージ！`);

    if (activeEnemy.hp <= 0) {
        activeEnemy.hp = 0;
        activeEnemy.isAlive = false;
        player.exp += activeEnemy.expReward;
        battleLines.push(`💀 ${activeEnemy.name}を 倒した！`);
        battleLines.push(`✨ ${activeEnemy.expReward}の けいけんちを 獲得。`);

        if (player.exp >= player.nextExp) {
            levelUp();
        }
    }
}

function enemyTurn() {
    const damage = Math.max(1, activeEnemy.atk - player.def);
    player.hp -= damage;
    battleLines.push(`💥 ${activeEnemy.name}の こうげき！`);
    battleLines.push(`😢 👆🏻は ${damage}の ダメージをうけた！`);

    if (player.hp <= 0) {
        player.hp = 0;
        battleLines.push("💀 👆🏻は 力尽きてしまった……");
    }
}

function levelUp() {
    player.level++;
    player.exp -= player.nextExp;
    player.nextExp = Math.floor(player.nextExp * 1.5);
    player.maxHp += 15;
    player.hp = player.maxHp;
    player.atk += 4;
    player.def += 2;
    player.spd += 3;
    battleLines.push(`👑 👆🏻は レベルアップした！`);
    battleLines.push(`💖 HPが全回復し、ステータスが上昇した！`);
}

// ========================================================
// 🛠️ 【人工知能システム】リアルタイム個別クロック駆動
// ========================================================
function updateAllNPCsAI() {
    if (gameMode !== "MAP") return;

    const npcs = [kintamaRight, kintamaLeft, saoEnemy];

    npcs.forEach(npc => {
        if (!npc.isAlive) return;

        if (!npc.isMoving) {
            npc.tickCount++;
        }

        if (npc.tickCount < npc.interval) return;

        npc.tickCount = 0;

        let nextX = npc.x;
        let nextY = npc.y;

        // 🧠 【AI：RANDOM】のんきにランダムうろつき（右玉）
        if (npc.aiType === "RANDOM") {
            const dirs = ['up', 'down', 'left', 'right', 'stay'];
            const chosen = dirs[Math.floor(Math.random() * dirs.length)];
            if (chosen === 'up') nextY--;
            if (chosen === 'down') nextY++;
            if (chosen === 'left') nextX--;
            if (chosen === 'right') nextX++;
        }

        // 🧠 【AI：FLEE】近づくと必死に逃げる（左玉：自身の sight マス以内）
        else if (npc.aiType === "FLEE") {
            const distX = npc.x - player.x;
            const distY = npc.y - player.y;
            const distance = Math.abs(distX) + Math.abs(distY);

            if (distance <= npc.sight) {
                if (Math.abs(distX) > Math.abs(distY)) {
                    nextX += (distX > 0) ? 1 : -1; 
                } else {
                    nextY += (distY > 0) ? 1 : -1; 
                }
            } else {
                if (Math.random() < 0.3) {
                    const dirs = ['up', 'down', 'left', 'right'];
                    const chosen = dirs[Math.floor(Math.random() * dirs.length)];
                    if (chosen === 'up') nextY--; if (chosen === 'down') nextY++;
                    if (chosen === 'left') nextX--; if (chosen === 'right') nextX++;
                }
            }
        }

        // 🧠 【AI：CHASE】視界に入ったらロックオン追跡（竿：自身の sight マス以内）
        else if (npc.aiType === "CHASE") {
            const distX = player.x - npc.x;
            const distY = player.y - npc.y;
            const distance = Math.abs(distX) + Math.abs(distY);

            if (distance <= npc.sight) {
                if (Math.abs(distX) > Math.abs(distY)) {
                    nextX += (distX > 0) ? 1 : -1; 
                } else {
                    nextY += (distY > 0) ? 1 : -1; 
                }
            }
        }

        // 範囲外チェック
        if (nextX < 0 || nextX > 29 || nextY < 0 || nextY > 29) return;

        // 🧱 【新設計】マスター辞書を参照して、移動先が「歩けないタイル」ならキャンセル
        const targetTile = mapData[nextY][nextX];
        if (TILE_TYPES[targetTile] && TILE_TYPES[targetTile].walkable === false) {
            return;
        }

        // なめらかスライド移動アニメーションを予約
        npc.isMoving = true;
        npc.moveProgress = 0;
        npc.fromX = npc.x;
        npc.fromY = npc.y;
        npc.toX = nextX;
        npc.toY = nextY;
        
        npc.x = nextX;
        npc.y = nextY;
    });
}