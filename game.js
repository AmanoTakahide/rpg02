// ==========================================
// 1. 基本設定と画面モード
// ==========================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 32;

let gameMode = "MAP"; 
let activeEnemy = null;

// ==========================================
// 2. ゲームのキャラクターデータ
// ==========================================
const player = {
    x: 4,
    y: 8,
    char: "👆🏻",
    hp: 100,
    maxHp: 100,
    atk: 15,
    def: 5,
    mp: 20,
    level: 1,
    exp: 0,
    nextExp: 20,
    spd: 12
};

const kintamaRight = {
    name: "右玉（みぎたま）",
    x: 3,
    y: 2,
    char: "🌕",
    hp: 50,
    maxHp: 50,
    atk: 12,
    isAlive: true,
    spd: 10,
    expReward: 20
};

const kintamaLeft = {
    name: "左玉（ひだりたま）",
    x: 6,
    y: 2,
    char: "🌕",
    hp: 60,
    maxHp: 60,
    atk: 15,
    isAlive: true,
    spd: 14,
    expReward: 30
};

// 🆕 メッセージを「STARTボタン」用に変更
let message = "玉に近づいて狩れ！ (Spaceでメニュー)";
let battleLog1 = "野生の玉が あらわれた！";
let battleLog2 = "Aボタンで こうどうを 決定せよ！";

let commandIndex = 0; 
let menuCommandIndex = 0; 

// ==========================================
// 3. 描画処理
// ==========================================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameMode === "MAP") {
        drawMapScene();
    } else if (gameMode === "BATTLE") {
        drawBattleScene();
    } else if (gameMode === "MENU") {
        drawMenuScene(); 
    } else if (gameMode === "GAMEOVER") {
        drawGameOverScene();
    }
}

// 🗺️ 【マップ画面】
function drawMapScene() {
    ctx.strokeStyle = "#222";
    for (let i = 0; i <= canvas.width; i += GRID_SIZE) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    ctx.font = "24px sans-serif";
    if (kintamaRight.isAlive) {
        ctx.fillText(kintamaRight.char, kintamaRight.x * GRID_SIZE + 4, kintamaRight.y * GRID_SIZE + 26);
    }
    if (kintamaLeft.isAlive) {
        ctx.fillText(kintamaLeft.char, kintamaLeft.x * GRID_SIZE + 4, kintamaLeft.y * GRID_SIZE + 26);
    }

    ctx.fillText(player.char, player.x * GRID_SIZE + 4, player.y * GRID_SIZE + 26);

    ctx.fillStyle = "white";
    ctx.font = "14px sans-serif";
    ctx.fillText(message, 10, canvas.height - 15);
}

// ⚙️ 【メニュー画面】
function drawMenuScene() {
    drawMapScene();
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    // 1. ステータスウィンドウ
    ctx.fillStyle = "#050505";
    ctx.fillRect(10, 10, 150, 180);
    ctx.strokeRect(10, 10, 150, 180);

    ctx.fillStyle = "#00FF00";
    ctx.font = "14px sans-serif";
    ctx.fillText(`📊 ステータス`, 20, 32);
    ctx.font = "12px 'Courier New'";
    ctx.fillText(`Lv  : ${player.level}`, 25, 58);
    ctx.fillText(`HP  : ${player.hp}/${player.maxHp}`, 25, 78);
    ctx.fillText(`MP  : ${player.mp}/${player.mp}`, 25, 98);
    ctx.fillText(`ATK : ${player.atk}`, 25, 118);
    ctx.fillText(`DEF : ${player.def}`, 25, 138);
    ctx.fillText(`SPD : ${player.spd}`, 25, 158);
    ctx.fillText(`EXP : ${player.exp}/${player.nextExp}`, 25, 178);

    // 2. アイテムウィンドウ
    ctx.fillStyle = "#050505";
    ctx.fillRect(170, 10, 140, 100);
    ctx.strokeRect(170, 10, 140, 100);

    ctx.fillStyle = "#00FF00";
    ctx.font = "14px sans-serif";
    ctx.fillText(`🧳 アイテム`, 180, 32);
    ctx.fillStyle = "#005500"; 
    ctx.font = "12px sans-serif";
    ctx.fillText("(からっぽ)", 185, 65);

    // 3. コマンドウィンドウ
    ctx.fillStyle = "#050505";
    ctx.fillRect(170, 120, 140, 70);
    ctx.strokeRect(170, 120, 140, 70);

    ctx.fillStyle = "#00FF00";
    ctx.font = "14px sans-serif";
    ctx.fillText("▶ とじる (START)", 182, 160);
}

// ⚔️ 【レトロゲーム風 バトル画面】
function drawBattleScene() {
    ctx.font = "72px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(activeEnemy.char, canvas.width / 2, 110);
    
    ctx.fillStyle = "white";
    ctx.font = "16px sans-serif";
    ctx.fillText(`${activeEnemy.name}  HP: ${activeEnemy.hp} / ${activeEnemy.maxHp}`, canvas.width / 2, 150);

    ctx.textAlign = "left";

    // 2. プレイヤーのステータスウィンドウ
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#050505";
    ctx.fillRect(10, 10, 140, 75);
    ctx.strokeRect(10, 10, 140, 75);
    
    ctx.fillStyle = "#00FF00";
    ctx.font = "12px 'Courier New'";
    ctx.fillText(`👆🏻 プレイヤー Lv.${player.level}`, 20, 26);
    ctx.fillText(`HP: ${player.hp}/${player.maxHp}`, 20, 42);
    ctx.fillText(`MP: ${player.mp}/${player.mp}`, 20, 58);
    ctx.fillText(`EX: ${player.exp}/${player.nextExp}`, 20, 74);

    // 3. バトルログウィンドウ
    ctx.fillStyle = "#050505";
    ctx.fillRect(10, 170, 300, 65);
    ctx.strokeRect(10, 170, 300, 65);
    
    ctx.fillStyle = "#00FF00";
    ctx.font = "13px sans-serif";
    ctx.fillText(battleLog1, 20, 195);
    ctx.fillText(battleLog2, 20, 218);

    // 4. コマンドウィンドウ
    ctx.fillStyle = "#050505";
    ctx.fillRect(10, 245, 300, 65);
    ctx.strokeRect(10, 245, 300, 65);

    const commands = ["たたかう", "アイテム", "ぼうぎょ", "にげる"];
    ctx.font = "14px sans-serif";
    
    for(let i = 0; i < 4; i++) {
        let col = i % 2;
        let row = Math.floor(i / 2);
        let x = 40 + col * 140;
        let y = 268 + row * 24;
        
        if (i === commandIndex) {
            ctx.fillStyle = "#00FF00";
            ctx.fillText("▶", x - 18, y);
        } else {
            ctx.fillStyle = "#005500";
        }
        ctx.fillText(commands[i], x, y);
    }
}

// 💀 【ゲームオーバー画面】
function drawGameOverScene() {
    ctx.fillStyle = "red";
    ctx.font = "30px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
    ctx.textAlign = "left";
}

// ==========================================
// 4. コマンドバトルのルール
// ==========================================
function selectCommand() {
    if (commandIndex === 1) {
        battleLog1 = "🧳 アイテムを もっていない！";
        battleLog2 = "こうどうを えらびなおしてください。";
        draw();
        return;
    }
    if (commandIndex === 2) {
        executeTurn(true); 
        return;
    }
    if (commandIndex === 3) {
        executeEscapeAction();
        return;
    }

    if (commandIndex === 0) {
        let playerGoesFirst = true;

        if (player.spd < activeEnemy.spd) {
            playerGoesFirst = false;
        } else if (player.spd === activeEnemy.spd) {
            playerGoesFirst = Math.random() < 0.5;
        }

        if (playerGoesFirst) {
            let enemyDead = executePlayerAttack();
            if (enemyDead) return;
            executeEnemyAttack(false);
        } else {
            executeEnemyAttack(false);
            if (player.hp <= 0) return;
            executePlayerAttack();
        }
    }
    draw();
}

// ⚔️ プレイヤーの攻撃処理
function executePlayerAttack() {
    let damage = player.atk;
    let isCritical = Math.random() < (1 / 16);

    if (isCritical) {
        damage *= 2;
        battleLog1 = `🔥 会心の一撃！！ ${activeEnemy.name}に ${damage} ダメージ！`;
    } else {
        battleLog1 = `👆🏻の攻撃！ ${activeEnemy.name}に ${damage} ダメージ！`;
    }

    activeEnemy.hp -= damage;

    if (activeEnemy.hp <= 0) {
        activeEnemy.hp = 0;
        activeEnemy.isAlive = false;
        gameMode = "MAP";
        
        player.exp += activeEnemy.expReward;
        let lvUpMessage = "";
        
        if (player.exp >= player.nextExp) {
            player.level++;
            player.exp -= player.nextExp;
            player.nextExp = Math.floor(player.nextExp * 1.5);
            player.maxHp += 15;
            player.hp = player.maxHp;
            player.atk += 3;
            player.spd += 2;
            lvUpMessage = ` ✨レベル ${player.level} にあがった！`;
        }

        message = `🎉 ${activeEnemy.name} を撃破！ ${activeEnemy.expReward}の経験値獲得！${lvUpMessage}`;
        
        if (!kintamaRight.isAlive && !kintamaLeft.isAlive) {
            message = "🏆 祝・完全撤去！すべての玉を狩り尽くした！";
        }
        draw();
        return true;
    }
    return false;
}

// 😈 敵の攻撃処理
function executeEnemyAttack(isPlayerDefending) {
    let enemyDamage = activeEnemy.atk;
    let isEnemyCritical = Math.random() < (1 / 16); 

    if (isEnemyCritical) {
        enemyDamage *= 2; 
        battleLog2 = `⚡ 痛恨の一撃！！ ${activeEnemy.name}の攻撃！ ${enemyDamage} のダメージ！`;
    } else {
        battleLog2 = `😈 ${activeEnemy.name}の攻撃！ ${enemyDamage} のダメージ！`;
    }

    if (isPlayerDefending) {
        enemyDamage = Math.max(1, Math.floor(enemyDamage - player.def * 2));
        if (isEnemyCritical) {
            battleLog2 = `⚡ 痛恨をガード！ ${activeEnemy.name}の攻撃！ ${enemyDamage} のダメージ！`;
        } else {
            battleLog2 = `😈 ガード！ ${activeEnemy.name}の攻撃！ ${enemyDamage} のダメージ！`;
        }
    }

    player.hp -= enemyDamage;

    if (player.hp <= 0) {
        player.hp = 0;
        gameMode = "GAMEOVER";
    }

    draw();
}

function executeTurn(isPlayerDefending) {
    battleLog1 = "👆🏻は 身をまもっている！";
    executeEnemyAttack(isPlayerDefending);
    draw();
}

// 💨 逃げる処理
function executeEscapeAction() {
    let escapeChance = 0.8 + (player.spd - activeEnemy.spd) * 0.05;
    escapeChance = Math.max(0.6, Math.min(1.0, escapeChance));

    if (Math.random() < escapeChance) {
        gameMode = "MAP";
        message = "💨 命からがら逃げ出した！";
    } else {
        battleLog1 = "💨 逃げ出すのに 失敗した！";
        executeEnemyAttack(false);
    }
    draw();
}

// ==========================================
// 5. 操作処理
// ==========================================
function move(direction) {
    if (gameMode === "GAMEOVER") return;

    // 🆕 どの画面モードでも、STARTボタンが押されたらメニューの開閉をおこなう
    if (direction === 'START') {
        if (gameMode === "MAP") {
            gameMode = "MENU"; // メニューを開く
        } else if (gameMode === "MENU") {
            gameMode = "MAP";  // メニューを閉じる
        }
        draw();
        return;
    }

    // 🟩 マップ画面での操作
    if (gameMode === "MAP") {
        let nextX = player.x;
        let nextY = player.y;

        if (direction === 'up' && player.y > 0) nextY--;
        if (direction === 'down' && player.y < 8) nextY++;
        if (direction === 'left' && player.x > 0) nextX--;
        if (direction === 'right' && player.x < 9) nextX++;

        if (kintamaRight.isAlive && nextX === kintamaRight.x && nextY === kintamaRight.y) {
            gameMode = "BATTLE";
            activeEnemy = kintamaRight;
            commandIndex = 0;
            battleLog1 = `野生の ${kintamaRight.name} があらわれた！`;
            battleLog2 = "Aボタンで決定 / Bボタンでにげる";
        } 
        else if (kintamaLeft.isAlive && nextX === kintamaLeft.x && nextY === kintamaLeft.y) {
            gameMode = "BATTLE";
            activeEnemy = kintamaLeft;
            commandIndex = 0;
            battleLog1 = `野生の ${kintamaLeft.name} があらわれた！`;
            battleLog2 = "Aボタンで決定 / Bボタンでにげる";
        } 
        else {
            player.x = nextX;
            player.y = nextY;
        }
    } 
    // 🟨 メニュー画面での操作
    else if (gameMode === "MENU") {
        // メニュー内は、AボタンやBボタンを押しても閉じられるように配慮
        if (direction === 'A' || direction === 'B') {
            gameMode = "MAP";
        }
    }
    // 🟥 バトル画面での操作
    else if (gameMode === "BATTLE") {
        if (direction === 'up') commandIndex = (commandIndex - 2 + 4) % 4;
        if (direction === 'down') commandIndex = (commandIndex + 2) % 4;
        if (direction === 'left') commandIndex = commandIndex % 2 === 1 ? commandIndex - 1 : commandIndex + 1;
        if (direction === 'right') commandIndex = commandIndex % 2 === 0 ? commandIndex + 1 : commandIndex - 1;

        if (direction === 'A') {
            selectCommand();
            return;
        }
        if (direction === 'B') {
            commandIndex = 3;
            selectCommand();
            return;
        }
    }
    draw();
}

// ⌨️ PCキーボード操作の受付
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') move('up');
    if (e.key === 'ArrowDown' || e.key === 's') move('down');
    if (e.key === 'ArrowLeft' || e.key === 'a') move('left');
    if (e.key === 'ArrowRight' || e.key === 'd') move('right');
    if (e.key === 'z' || e.key === 'Enter') move('A');
    if (e.key === 'x' || e.key === 'Escape') move('B');
    if (e.key === ' ' || e.key === 'p') move('START'); // 🆕 スペースキーかPキーをSTARTボタンにする
});

// 📱 画面ボタン（コントローラー）操作の受付
document.getElementById('btn-up').addEventListener('click', () => move('up'));
document.getElementById('btn-down').addEventListener('click', () => move('down'));
document.getElementById('btn-left').addEventListener('click', () => move('left'));
document.getElementById('btn-right').addEventListener('click', () => move('right'));
document.getElementById('btn-a').addEventListener('click', () => move('A'));
document.getElementById('btn-b').addEventListener('click', () => move('B'));
document.getElementById('btn-start').addEventListener('click', () => move('START')); // 🆕 メニューボタン連動

// 起動時にすぐ描画
draw();