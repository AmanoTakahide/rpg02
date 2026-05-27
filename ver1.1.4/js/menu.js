// ==========================================
// スタートメニュー・画面表示制御
// ==========================================
const START_MENU_ITEMS = [
    { label: "てもち", action: () => { gameState = GAME_STATE.MENU_PARTY; partyCursor = 0; switchTargetIndex = null; } },
    { label: "バッグ", action: () => { gameState = GAME_STATE.MENU_BAG; } },
    { label: "ステータス", action: () => { gameState = GAME_STATE.MENU_STATUS; } },
    { label: "レポート", action: () => { showMessage(TEXT_MASTER.NOT_IMPLEMENTED, GAME_STATE.MENU); } },
    { label: "とじる", action: () => { closeMenu(); } }
];

let menuIndex = 0;

function openStartMenu() {
    menuIndex = 0;
    gameState = GAME_STATE.MENU;
}

function closeMenu() { gameState = GAME_STATE.MAP; }

function confirmMenuSelection() {
    START_MENU_ITEMS[menuIndex].action();
}

function drawWindow(x, y, width, height) {
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);
}

function drawStartMenu() {
    drawWindow(450, 20, 220, 220);
    ctx.fillStyle = "black";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    START_MENU_ITEMS.forEach((item, index) => {
        const y = 55 + index * 36;
        if (index === menuIndex) {
            ctx.fillText("▶", 465, y);
        }
        ctx.fillText(item.label, 495, y);
    });
}

function drawPartyMenu() {
    drawWindow(30, 30, 660, 660);
    ctx.fillStyle = "black";
    ctx.font = "28px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("てもち", 50, 70);

    if (player.party.length === 0) {
        ctx.font = "22px sans-serif";
        ctx.fillText("ポケモンが いません", 60, 140);
        return;
    }

    player.party.forEach((monster, index) => {
        const x = 50, y = 110 + index * 90;

        // カードの背景色（選択中の状態に応じて分岐）
        if (index === switchTargetIndex) {
            ctx.fillStyle = "#ffeb3b"; // 入れ替え元：黄色
        } else if (index === partyCursor) {
            ctx.fillStyle = "#e0f7fa"; // カーソル位置：薄い水色
        } else {
            ctx.fillStyle = "#f0f0f0"; // 通常：グレー
        }
        
        ctx.fillRect(x, y, 620, 80);
        ctx.strokeStyle = index === partyCursor ? "black" : "#444";
        ctx.lineWidth = index === partyCursor ? 2 : 1;
        ctx.strokeRect(x, y, 620, 80);

        // カーソルインジケータ
        if (index === partyCursor) {
            ctx.fillStyle = "black";
            ctx.font = "20px sans-serif";
            ctx.fillText("▶", x - 22, y + 46);
        }

        // ==================================================
        // 🌟 新レイアウト描画エンジン
        // ==================================================
        
        // 1. 左側：基本ステータス
        // [上段] 絵文字 ＆ 名前
        ctx.font = "32px sans-serif";
        ctx.fillText(monster.emoji, x + 12, y + 52);
        
        ctx.fillStyle = "black";
        ctx.font = "22px sans-serif";
        ctx.fillText(monster.name, x + 70, y + 34);
        
        // [下段] Lv ＆ Exp
        ctx.font = "18px sans-serif";
        ctx.fillText(`Lv.${monster.level}`, x + 70, y + 62);
        
        ctx.font = "13px sans-serif";
        ctx.fillStyle = "#555";
        const currentExp = monster.exp || 0;
        const nextExp = monster.nextExp || 0;
        ctx.fillText(`(Exp${currentExp}/${nextExp})`, x + 122, y + 61);

        // 2. 中央：HP表示
        ctx.font = "18px sans-serif";
        ctx.fillStyle = "black";
        ctx.fillText(`HP ${monster.hp}/${monster.maxHp}`, x + 245, y + 34);

        // 3. 右側：わざ表示（IDからマスタ経由で正式な技名を引き出す！）
        ctx.font = "14px sans-serif";
        ctx.fillStyle = "#111";
        const m = monster.moves || ["", "", "", ""];
        
        // 技IDが空文字だったら「---」を返す安全ガードロジック
        const name1 = m[0] ? getMove(m[0]).name : "---";
        const name2 = m[1] ? getMove(m[1]).name : "---";
        const name3 = m[2] ? getMove(m[2]).name : "---";
        const name4 = m[3] ? getMove(m[3]).name : "---";
        
        // [上段] 技1 と 技2 
        ctx.fillText(name1, x + 400, y + 34);
        ctx.fillText(name2, x + 515, y + 34);
        
        // [下段] 技3 と 技4
        ctx.fillText(name3, x + 400, y + 62);
        ctx.fillText(name4, x + 515, y + 62);
    });

    // 動的フッターガイド
    if (switchTargetIndex !== null) {
        drawBottomGuide("A: 入れ替え先を確定 / B: キャンセル");
    } else {
        drawBottomGuide("A: 入れ替え元を選択 / B: もどる");
    }
}

function drawBagMenu() {
    drawWindow(40, 40, 640, 640);
    ctx.fillStyle = "black";
    ctx.font = "28px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("バッグ", 60, 80);

    if (player.bag.length === 0) {
        ctx.font = "22px sans-serif";
        ctx.fillText("アイテムが ありません", 60, 140);
        return;
    }

    ctx.font = "22px sans-serif";
    player.bag.forEach((item, index) => {
        const y = 140 + index * 40;
        ctx.fillText(item.name, 70, y);
        ctx.fillText(`×${item.count}`, 450, y);
    });
    drawBagMenuGuide();
}

function drawStatusMenu() {
    drawWindow(40, 40, 640, 640);
    ctx.fillStyle = "black";
    ctx.font = "30px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(player.name, 60, 90);
    ctx.font = "22px sans-serif";
    ctx.fillText(`おこづかい: ${player.money}円`, 60, 170);
    ctx.fillText(`バッジ: ${player.badges}個`, 60, 220);
    ctx.fillText(`プレイじかん: ${player.playTime}h`, 60, 270);
    drawBottomGuide("B: もどる");
}

function drawBottomGuide(text) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 680, 720, 40);
    ctx.fillStyle = "white";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(text, 20, 705);
}

function drawBagMenuGuide() {
    drawBottomGuide("B: もどる");
}