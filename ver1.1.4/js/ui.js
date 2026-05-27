// ==========================================
// 総合描画エンジン
// ==========================================
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayerAnimation();
    updateCamera();

    // 地形とキャラクターの基本描画
    drawMap();
    drawPlayer();

    // 状態に応じたウィンドウのオーバーレイ描画
    if (gameState === GAME_STATE.CHOICE) {
        drawChoiceWindow();
    } else if (gameState === GAME_STATE.MENU) {
        drawStartMenu();
    } else if (gameState === GAME_STATE.MENU_PARTY) {
        drawPartyMenu();
    } else if (gameState === GAME_STATE.MENU_BAG) {
        drawBagMenu();
    } else if (gameState === GAME_STATE.MENU_STATUS) {
        drawStatusMenu();
    }
}

function updatePlayerAnimation() {
    const speed = player.moveSpeed;
    if (Math.abs(player.drawX - player.x) > 0.01) player.drawX += (player.x - player.drawX) * speed;
    else player.drawX = player.x;
    if (Math.abs(player.drawY - player.y) > 0.01) player.drawY += (player.y - player.drawY) * speed;
    else player.drawY = player.y;
}

function drawMap() {
    const map = getCurrentMap();
    for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
            drawTile(map.tiles[y][x], x, y);
        }
    }
    drawNPCs();
}

function drawTile(tile, tileX, tileY) {
    const worldX = tileX * TILE_SIZE;
    const worldY = tileY * TILE_SIZE;
    const screenX = worldToScreenX(worldX);
    const screenY = worldToScreenY(worldY);

    if (screenX < -TILE_SIZE || screenY < -TILE_SIZE || screenX > canvas.width || screenY > canvas.height) return;

    if (tile === TILE_TYPE.FLOOR) ctx.fillStyle = "#cfe8c8";
    else if (tile === TILE_TYPE.WALL) ctx.fillStyle = "#666666";
    else if (tile === TILE_TYPE.WATER) ctx.fillStyle = "#4a90e2";
    else if (tile === TILE_TYPE.TREE) ctx.fillStyle = "#2f7d32";

    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.strokeRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
}

function drawNPCs() {
    const npcs = NPCS[currentMapKey];
    if (npcs) npcs.forEach(npc => drawNPC(npc));
}

function drawNPC(npc) {
    const screenX = worldToScreenX(npc.drawX * TILE_SIZE);
    const screenY = worldToScreenY(npc.drawY * TILE_SIZE);
    ctx.fillStyle = "#ff66aa";
    ctx.fillRect(screenX + 8, screenY + 8, 32, 32);
}

function drawPlayer() {
    const screenX = worldToScreenX(player.drawX * TILE_SIZE);
    const screenY = worldToScreenY(player.drawY * TILE_SIZE);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(screenX + 8, screenY + 8, 32, 32);

    ctx.fillStyle = "#222222";
    if (player.direction === "up") ctx.fillRect(screenX + 18, screenY + 10, 12, 6);
    else if (player.direction === "down") ctx.fillRect(screenX + 18, screenY + 32, 12, 6);
    else if (player.direction === "left") ctx.fillRect(screenX + 10, screenY + 18, 6, 12);
    else if (player.direction === "right") ctx.fillRect(screenX + 32, screenY + 18, 6, 12);
}