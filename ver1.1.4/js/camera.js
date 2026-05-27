// ==========================================
// カメラシステム
// ==========================================
const camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    smoothSpeed: 0.14
};

function updateCamera() {
    camera.targetX = (player.drawX * TILE_SIZE) - (canvas.width / 2) + (TILE_SIZE / 2);
    camera.targetY = (player.drawY * TILE_SIZE) - (canvas.height / 2) + (TILE_SIZE / 2);

    const map = getCurrentMap();
    const maxX = map.width * TILE_SIZE - canvas.width;
    const maxY = map.height * TILE_SIZE - canvas.height;

    camera.targetX = Math.max(0, Math.min(maxX, camera.targetX));
    camera.targetY = Math.max(0, Math.min(maxY, camera.targetY));

    camera.x += (camera.targetX - camera.x) * camera.smoothSpeed;
    camera.y += (camera.targetY - camera.y) * camera.smoothSpeed;
}

function worldToScreenX(x) { return x - camera.x; }
function worldToScreenY(y) { return y - camera.y; }