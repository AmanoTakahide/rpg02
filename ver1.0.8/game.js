// ==========================================
// game.js : 描画処理 & リアルタイムメインゲームループ（選択肢描画対応版）
// ==========================================

// 🟩 ゲージをCanvas内部に直接描画するための補助関数
function drawBar(x, y, w, h, current, max, color) {
    ctx.fillStyle = "#222"; 
    ctx.fillRect(x, y, w, h);
    const fillW = Math.max(0, (current / max) * w);
    ctx.fillStyle = color; 
    ctx.fillRect(x, y, fillW, h);
}

// 🎨 【メイン描画処理】状態に応じてシーンを切り替え
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🎭 CHOICEモードのときは、背景としてまずマップ画面を描画する
    if (gameMode === "MAP" || gameMode === "CHOICE") {
        drawMapScene();
        
        // 選択肢モードなら、さらに上に「はい・いいえ」ウィンドウを重ねる！
        if (gameMode === "CHOICE") {
            drawChoiceWindow();
        }
    } else if (gameMode === "BATTLE") {
        drawBattleScene();
    } else if (gameMode === "MENU") {
        drawMenuScene(); 
    } else if (gameMode === "GAMEOVER") {
        drawGameOverScene();
    }
}

// 🗺️ 【マップ画面の描画】
function drawMapScene() {
    const screenCenterX = 6;
    const screenCenterY = 8;
    
    // プレイヤーのなめらかな描画位置を計算
    let currentInterpX = player.x;
    let currentInterpY = player.y;

    if (player.isMoving) {
        currentInterpX = player.fromX + (player.toX - player.fromX) * player.moveProgress;
        currentInterpY = player.fromY + (player.toY - player.fromY) * player.moveProgress;
    }

    const offsetX = screenCenterX - currentInterpX;
    const offsetY = screenCenterY - currentInterpY;

    // 1. 地形（30x30）のドット単位描画
    for (let y = 0; y < mapData.length; y++) {
        for (let x = 0; x < mapData[y].length; x++) {
            const drawX = (x + offsetX) * GRID_SIZE;
            const drawY = (y + offsetY) * GRID_SIZE;

            if (drawX < -GRID_SIZE || drawX > canvas.width || drawY < -GRID_SIZE || drawY > canvas.height) {
                continue;
            }

            const tile = mapData[y][x];
            const tileConfig = TILE_TYPES[tile] || TILE_TYPES[0];

            ctx.fillStyle = tileConfig.color;
            ctx.fillRect(drawX, drawY, GRID_SIZE, GRID_SIZE);

            if (tileConfig.textChar) {
                ctx.font = tileConfig.font;
                ctx.fillStyle = tileConfig.textColor || "#000";
                
                if (tileConfig.font.includes("28px") || tileConfig.font.includes("24px")) {
                    ctx.fillText(tileConfig.textChar, drawX + 4, drawY + 30);
                } else {
                    ctx.fillText(tileConfig.textChar, drawX + 16, drawY + 24);
                }
            }

            ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
            ctx.lineWidth = 1;
            ctx.strokeRect(drawX, drawY, GRID_SIZE, GRID_SIZE);
        }
    }

    // 2. 【NPC描画処理】
    ctx.font = "32px sans-serif";
    const npcs = [kintamaRight, kintamaLeft, saoEnemy];

    npcs.forEach(npc => {
        if (!npc.isAlive) return;

        let npcInterpX = npc.x;
        let npcInterpY = npc.y;

        if (npc.isMoving) {
            npcInterpX = npc.fromX + (npc.toX - npc.fromX) * npc.moveProgress;
            npcInterpY = npc.fromY + (npc.toY - npc.fromY) * npc.moveProgress;
        }

        const drawX = (npcInterpX + offsetX) * GRID_SIZE;
        const drawY = (npcInterpY + offsetY) * GRID_SIZE;

        ctx.fillText(npc.char, drawX + 4, drawY + 32);
    });

    // 3. 【プレイヤーの描画】
    const pDrawX = screenCenterX * GRID_SIZE;
    const pDrawY = screenCenterY * GRID_SIZE;
    ctx.font = "32px sans-serif";

    let playerEmoji = "👇🏻"; 
    if (player.direction === "up")    playerEmoji = "👆🏻";
    if (player.direction === "down")  playerEmoji = "👇🏻";
    if (player.direction === "left")  playerEmoji = "👈🏻";
    if (player.direction === "right") playerEmoji = "👉🏻";

    ctx.fillText(playerEmoji, pDrawX + 4, pDrawY + 32);

    // 4. イベントメッセージウィンドウ（CHOICEモード時もセリフを維持して描画）
    if ((messageQueue.length > 0 && messageQueue[0] !== "玉に近づいて狩れ！") || gameMode === "CHOICE") {
        const msgBoxHeight = 65;
        ctx.fillStyle = "black";
        ctx.fillRect(0, canvas.height - msgBoxHeight, canvas.width, msgBoxHeight);
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, canvas.height - msgBoxHeight, canvas.width, msgBoxHeight);

        // CHOICEモードのときは、おばあさんの最後の質問（一晩泊まっていくかね？）で固定表示
        const currentMessage = (gameMode === "CHOICE") ? "👵 「一晩 泊まっていくかね？」" : (messageQueue[messageIndex] || "");

        ctx.fillStyle = "#00FF00";
        ctx.font = "16px sans-serif";
        ctx.fillText(currentMessage, 20, canvas.height - 28);

        // 通常セリフ送り中のみ ▼ マークを出す
        if (gameMode !== "CHOICE" && messageIndex < messageQueue.length - 1) {
            ctx.font = "14px sans-serif";
            ctx.fillText("▼", canvas.width - 30, canvas.height - 15);
        }
    }
}

// 🎭 【新設】「はい・いいえ」のポップアップウィンドウ描画
function drawChoiceWindow() {
    const boxW = 110;
    const boxH = 90;
    const boxX = canvas.width - boxW - 15; // 画面右下に配置
    const boxY = canvas.height - boxH - 80;

    // 黒いボックス框
    ctx.fillStyle = "black";
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.font = "18px sans-serif";

    // 🟢 「はい」の描画
    if (choiceIndex === 0) {
        ctx.fillStyle = "#00FF00";
        ctx.fillText("▶", boxX + 15, boxY + 35);
    } else {
        ctx.fillStyle = "#005500";
    }
    ctx.fillText("はい", boxX + 42, boxY + 35);

    // 🔴 「いいえ」の描画
    if (choiceIndex === 1) {
        ctx.fillStyle = "#00FF00";
        ctx.fillText("▶", boxX + 15, boxY + 68);
    } else {
        ctx.fillStyle = "#005500";
    }
    ctx.fillText("いいえ", boxX + 42, boxY + 68);
}

// ⚙️ 【メニュー画面の描画】
function drawMenuScene() {
    drawMapScene();
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    ctx.fillStyle = "#050505";
    ctx.fillRect(20, 20, 440, 320);
    ctx.strokeRect(20, 20, 440, 320);

    ctx.fillStyle = "#00FF00";
    ctx.font = "20px sans-serif";
    ctx.fillText(`📊 ステータス詳細`, 40, 55);
    
    ctx.font = "16px 'Courier New'";
    ctx.fillText(`Level : ${player.level}`, 50, 95);
    
    ctx.fillText(`HP    : ${player.hp} / ${player.maxHp}`, 50, 130);
    drawBar(50, 140, 380, 8, player.hp, player.maxHp, "#00FF00");

    ctx.fillText(`MP    : ${player.mp} / ${player.maxMp}`, 50, 180);
    drawBar(50, 190, 380, 8, player.mp, player.maxMp, "#00FFFF");

    ctx.fillText(`ATK   : ${player.atk}`, 50, 230);
    ctx.fillText(`DEF   : ${player.def}`, 240, 230);
    ctx.fillText(`SPD   : ${player.spd}`, 50, 260);
    ctx.fillText(`EXP   : ${player.exp} / ${player.nextExp}`, 50, 300);

    ctx.fillStyle = "#050505";
    ctx.fillRect(20, 360, 440, 140);
    ctx.strokeRect(20, 360, 440, 140);

    ctx.fillStyle = "#00FF00";
    ctx.font = "18px sans-serif";
    ctx.fillText(`🧳 アイテム`, 40, 395);
    ctx.fillStyle = "#005500"; 
    ctx.font = "16px sans-serif";
    ctx.fillText("(アイテムを もっていない！)", 50, 445);

    ctx.fillStyle = "#050505";
    ctx.fillRect(20, 520, 440, 80);
    ctx.strokeRect(20, 520, 440, 80);
    ctx.fillStyle = "#00FF00";
    ctx.font = "18px sans-serif";
    ctx.fillText("▶ とじる (STARTボタン)", 130, 568);
}

// ⚔️ 【レトロゲーム風 バトル画面の描画】
function drawBattleScene() {
    ctx.font = "120px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(activeEnemy.char, canvas.width / 2, 155);
    
    ctx.fillStyle = "white";
    ctx.font = "18px sans-serif";
    ctx.fillText(`${activeEnemy.name}`, canvas.width / 2, 205);
    ctx.font = "16px 'Courier New'";
    ctx.fillText(`HP: ${activeEnemy.hp} / ${activeEnemy.maxHp}`, canvas.width / 2, 230);
    drawBar(canvas.width / 2 - 120, 245, 240, 8, activeEnemy.hp, activeEnemy.maxHp, "#FF3333");

    ctx.textAlign = "left";

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#050505";
    ctx.fillRect(20, 320, 440, 130);
    ctx.strokeRect(20, 320, 440, 130);
    
    ctx.fillStyle = "#00FF00";
    ctx.font = "16px sans-serif";
    ctx.fillText(`👆🏻 プレイヤー 👑 Lv.${player.level}`, 40, 355);
    
    ctx.font = "14px 'Courier New'";
    ctx.fillText(`HP: ${player.hp} / ${player.maxHp}`, 40, 380);
    drawBar(40, 388, 400, 6, player.hp, player.maxHp, "#00FF00");

    ctx.fillText(`MP: ${player.mp} / ${player.maxMp}`, 40, 415);
    drawBar(40, 422, 400, 6, player.mp, player.maxMp, "#00FFFF");

    const bottomBoxY = 485;
    const bottomBoxHeight = 135;

    ctx.fillStyle = "#050505";
    ctx.fillRect(20, bottomBoxY, 440, bottomBoxHeight);
    ctx.strokeRect(20, bottomBoxY, 440, bottomBoxHeight);

    if (isBattleAnimating) {
        ctx.fillStyle = "#00FF00";
        ctx.font = "16px sans-serif";

        let line1 = battleLines[battleIndex] || "";
        let line2 = battleLines[battleIndex + 1] || "";
        
        if (line1 === "__ESCAPE_SUCCESS__") line1 = "";
        if (line2 === "__ESCAPE_SUCCESS__") line2 = "";

        ctx.fillText(line1, 40, bottomBoxY + 45);
        ctx.fillText(line2, 40, bottomBoxY + 90);

        if (battleIndex + 2 < battleLines.length) {
            ctx.font = "14px sans-serif";
            ctx.fillText("▼", canvas.width - 45, bottomBoxY + 115);
        }
    } 
    else {
        const commands = ["たたかう", "アイテム", "ぼうぎょ", "にげる"];
        ctx.font = "18px sans-serif";
        
        for(let i = 0; i < 4; i++) {
            let col = i % 2;
            let row = Math.floor(i / 2);
            let x = 70 + col * 220; 
            let y = (bottomBoxY + 50) + row * 45; 
            
            if (i === commandIndex) {
                ctx.fillStyle = "#00FF00";
                ctx.fillText("▶", x - 24, y);
            } else {
                ctx.fillStyle = "#005500";
            }
            ctx.fillText(commands[i], x, y);
        }
    }
}

// 💀 【ゲームオーバー画面の描画】
function drawGameOverScene() {
    ctx.fillStyle = "red";
    ctx.font = "40px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
    ctx.textAlign = "left";
}


// ========================================================
// ⏰ 【ゲーム心臓】メインリアルタイムループ（毎秒60回実行）
// ========================================================
function gameLoop() {
    if (player.isMoving) {
        player.moveProgress += 0.25; 
        if (player.moveProgress >= 1.0) {
            player.isMoving = false;
            player.moveProgress = 1.0;
            player.fromX = player.x;
            player.fromY = player.y;

            let metEnemy = null;
            if (kintamaRight.isAlive && player.x === kintamaRight.x && player.y === kintamaRight.y) metEnemy = kintamaRight;
            if (kintamaLeft.isAlive && player.x === kintamaLeft.x && player.y === kintamaLeft.y) metEnemy = kintamaLeft;
            if (saoEnemy.isAlive && player.x === saoEnemy.x && player.y === saoEnemy.y) metEnemy = saoEnemy;

            if (metEnemy) {
                startBattle(metEnemy);
            }
        }
    }

    const npcs = [kintamaRight, kintamaLeft, saoEnemy];
    npcs.forEach(npc => {
        if (npc.isMoving) {
            npc.moveProgress += 0.25;
            if (npc.moveProgress >= 1.0) {
                npc.isMoving = false;
                npc.moveProgress = 1.0;

                if (npc.isAlive && npc.x === player.x && npc.y === player.y && gameMode === "MAP") {
                    startBattle(npc);
                }
            }
        }
    });

    updateAllNPCsAI();
    draw();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);