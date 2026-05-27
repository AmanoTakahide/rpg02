// ==========================================
// キーボード入力バインディング
// ==========================================
document.addEventListener("keydown", (e) => {
    let command = null;
    switch (e.key) {
        case "ArrowUp":    command = "UP"; break;
        case "ArrowDown":  command = "DOWN"; break;
        case "ArrowLeft":  command = "LEFT"; break;
        case "ArrowRight": command = "RIGHT"; break;
        case "z": case "Z": command = "A"; break;
        case "x": case "X": command = "B"; break;
        case "Enter":      command = "START"; break;
        case "Shift":      command = "SELECT"; break;
    }
    if (command) {
        e.preventDefault();
        handleInput(command);
    }
});

// ==========================================
// 状態型ルーティングコントローラ
// ==========================================
function handleInput(command) {
    switch (gameState) {
        case GAME_STATE.MAP:
            if (command === "START") { openStartMenu(); return; }
            if (command === "A") { checkAction(); return; }
            handleMapInput(command);
            break;
            
        case GAME_STATE.MESSAGE:
            if (command === "A") advanceMessage();
            break;
            
        case GAME_STATE.CHOICE:
            if (command === "UP") choiceIndex = (choiceIndex - 1 + STARTER_MASTER.length) % STARTER_MASTER.length;
            if (command === "DOWN") choiceIndex = (choiceIndex + 1) % STARTER_MASTER.length;
            if (command === "A") confirmChoice();
            break;
            
        case GAME_STATE.MENU:
            if (command === "UP") menuIndex = (menuIndex - 1 + START_MENU_ITEMS.length) % START_MENU_ITEMS.length;
            if (command === "DOWN") menuIndex = (menuIndex + 1) % START_MENU_ITEMS.length;
            if (command === "A") confirmMenuSelection();
            if (command === "B") closeMenu();
            break;
            
        case GAME_STATE.MENU_PARTY:
            // 🌟新規仕様：てもち画面内の並び替え＆カーソルロジック
            if (command === "UP") {
                partyCursor = (partyCursor - 1 + player.party.length) % player.party.length;
            }
            if (command === "DOWN") {
                partyCursor = (partyCursor + 1) % player.party.length;
            }
            if (command === "A") {
                if (player.party.length < 2) return; // 1匹しかいない場合は機能させない
                
                if (switchTargetIndex === null) {
                    // 1回目の押下：現在位置を入れ替え元としてキープ（黄色反転）
                    switchTargetIndex = partyCursor;
                } else {
                    // 2回目の押下：キープしていた要素と現在位置の要素をスワップ交換
                    const temp = player.party[switchTargetIndex];
                    player.party[switchTargetIndex] = player.party[partyCursor];
                    player.party[partyCursor] = temp;
                    
                    // 選択状態の初期化
                    switchTargetIndex = null;
                }
            }
            if (command === "B") {
                if (switchTargetIndex !== null) {
                    // 入れ替え元選択中なら、ホールド状態のみキャンセル
                    switchTargetIndex = null;
                } else {
                    // 通常時ならスタートメニューの階層に戻る
                    gameState = GAME_STATE.MENU;
                }
            }
            break;
            
        case GAME_STATE.MENU_BAG:
        case GAME_STATE.MENU_STATUS:
            if (command === "B") gameState = GAME_STATE.MENU;
            break;
    }
}

function handleMapInput(command) {
    switch (command) {
        case "UP":    player.direction = "up"; break;
        case "DOWN":  player.direction = "down"; break;
        case "LEFT":  player.direction = "left"; break;
        case "RIGHT": player.direction = "right"; break;
    }

    let nextX = player.x;
    let nextY = player.y;
    switch (command) {
        case "UP":    nextY--; break;
        case "DOWN":  nextY++; break;
        case "LEFT":  nextX--; break;
        case "RIGHT": nextX++; break;
    }

    const npcs = NPCS[currentMapKey];
    if (npcs) {
        for (const npc of npcs) {
            if (npc.x === nextX && npc.y === nextY) return;
        }
    }

    if (isPassable(nextX, nextY)) {
        player.x = nextX;
        player.y = nextY;
    }
}

function checkAction() {
    let targetX = player.x;
    let targetY = player.y;
    
    if (player.direction === "up") targetY--;
    if (player.direction === "down") targetY++;
    if (player.direction === "left") targetX--;
    if (player.direction === "right") targetX++;

    const npcs = NPCS[currentMapKey];
    if (npcs) {
        npcs.forEach(npc => {
            if (npc.x === targetX && npc.y === targetY && npc.type === "MOM") {
                if (player.hasStarter) {
                    showMessage(TEXT_MASTER.MOM_AFTER_STARTER);
                } else {
                    showMessage(TEXT_MASTER.MOM_FIRST, GAME_STATE.CHOICE);
                    choiceTargetType = "STARTER";
                    choiceIndex = 0;
                }
            }
        });
    }
}