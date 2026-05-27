// === FILE: js/map.js ===

// ==========================================
// マップ制御用汎用ロジック（システム関数）
// ==========================================

function getCurrentMap() { 
    return MAPS[currentMapKey]; 
}

function getTile(x, y) {
    const map = getCurrentMap();
    if (y < 0 || y >= map.height || x < 0 || x >= map.width) return TILE_TYPE.WALL;
    return map.tiles[y][x];
}

function isPassable(x, y) {
    const tile = getTile(x, y);
    return !(tile === TILE_TYPE.WALL || tile === TILE_TYPE.TREE);
}