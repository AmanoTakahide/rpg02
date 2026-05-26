// ==========================================
// input.js : 操作処理（スマホ十字キー長押し連続移動・適合版）
// ==========================================

// 🔄 長押し連続移動用のタイマー管理変数
let repeatTimer = null;
const REPEAT_DELAY = 200;    /* 最初に長押しと判定されるまでの時間(ms) */
const REPEAT_INTERVAL = 150; /* 押しっぱなしのときの移動速度間隔(ms) */

function move(direction) {
    if (gameMode === "GAMEOVER") return;

    // 1. 【バトル中の2行メッセージ送り演出中】
    if (gameMode === "BATTLE" && isBattleAnimating && battleLines.length > 0) {
        if (direction === 'A') {
            if (battleLines[battleIndex] === "__ESCAPE_SUCCESS__" || battleLines[battleIndex + 1] === "__ESCAPE_SUCCESS__") {
                isBattleAnimating = false;
                gameMode = "MAP";
                messageQueue = ["💨 命からがら逃げ出した！"];
                messageIndex = 0;
                return;
            }

            if (battleIndex + 2 < battleLines.length) {
                battleIndex += 2;
            } else {
                isBattleAnimating = false; 

                if (player.hp <= 0) {
                    gameMode = "GAMEOVER";
                } else if (!activeEnemy.isAlive) {
                    gameMode = "MAP";
                    messageQueue = [];
                    messageIndex = 0;
                }
            }
        }
        return;
    }

    // 2. 【マップ画面でのイベントメッセージ送り中】
    if (messageQueue.length > 0 && messageQueue[0] !== "玉に近づいて狩れ！") {
        if (messageIndex < messageQueue.length - 1) {
            if (direction === 'A') messageIndex++;
            return;
        } 
        else if (messageIndex === messageQueue.length - 1) {
            if (direction === 'A') {
                if (choiceTargetType === "INN") {
                    messageQueue = [];
                    messageIndex = 0;
                    gameMode = "CHOICE"; 
                    choiceIndex = 0;    
                    return;
                }
                messageQueue = []; 
                messageIndex = 0;
                choiceTargetType = ""; 
                return;
            }
        }
    }

    // 3. 🎭 【選択肢モード（CHOICE）の操作ルール】
    if (gameMode === "CHOICE") {
        if (direction === 'up' || direction === 'down') {
            choiceIndex = (choiceIndex === 0) ? 1 : 0;
            return;
        }

        if (direction === 'A') {
            if (choiceTargetType === "INN") {
                if (choiceIndex === 0) {
                    player.hp = player.maxHp;
                    player.mp = player.maxMp;
                    gameMode = "MAP";
                    messageQueue = ["🛌 👆🏻は 宿屋のベッドで ぐっすり眠った！", "💖 旅のつかれが とれ、HPとMPが完全に回復した！"];
                    messageIndex = 0;
                } else {
                    gameMode = "MAP";
                    messageQueue = ["👵 宿屋のばあさん：「そうかい。無理せんようにな。」"];
                    messageIndex = 0;
                }
                choiceTargetType = ""; 
            }
            return;
        }

        if (direction === 'B') {
            gameMode = "MAP";
            choiceTargetType = "";
            return;
        }
        return;
    }

    if (direction === 'START') {
        if (player.isMoving) return; 
        if (gameMode === "MAP") {
            gameMode = "MENU"; 
        } else if (gameMode === "MENU") {
            gameMode = "MAP";  
        }
        return;
    }

    // 🟩 通常のマップ画面での歩行・インタラクト処理
    if (gameMode === "MAP") {
        if (player.isMoving) return;

        // 🔍 【Aボタン：目の前のマスを調べる・話しかける】
        if (direction === 'A') {
            let targetX = player.x;
            let targetY = player.y;

            if (player.direction === "up")    targetY--;
            if (player.direction === "down")  targetY++;
            if (player.direction === "left")  targetX--;
            if (player.direction === "right") targetX++;

            if (targetX >= 0 && targetX <= 29 && targetY >= 0 && targetY <= 29) {
                const checkedTile = mapData[targetY][targetX];

                // 🎁 宝箱
                if (checkedTile === 100) {
                    player.atk += 5; 
                    messageQueue = ["🎁 👆🏻は 宝箱を あけた！", "💥 なんと 攻撃力が 5 あがった！"];
                    messageIndex = 0;
                    mapData[targetY][targetX] = 0; 
                    return;
                }
                
                // 🛏️ 宿屋のベッド
                if (checkedTile === 110) {
                    messageQueue = ["🛏️ ふかふかのベッドだ！", "👵 勝手に入ったら ばあさんに おこられるぞ。"];
                    messageIndex = 0;
                    return;
                }

                // 🪵 看板
                if (checkedTile === 120) {
                    messageQueue = ["🪵 看板がある。", "📢 『これより先、獰猛なエネミー出現注意！』", "📢 『北西の魔境には 狂暴な「竿」が 潜むという…』"];
                    messageIndex = 0;
                    return;
                }

                // 👵 宿屋の主人
                if (checkedTile === 130) {
                    messageQueue = ["👵 宿屋のばあさん：「旅の人かね。」", "👵 「ここは マクハリ・シティ の宿屋だよ。」", "👵 「一晩 泊まっていくかね？」"];
                    messageIndex = 0;
                    choiceTargetType = "INN"; 
                    return;
                }

                // 👴 街の老人
                if (checkedTile === 140) {
                    messageQueue = ["👴 街のじじさん：「おお、若い旅のエンジニアか。」", "👴 「外にいる『左玉』は 恐ろしくすばしっこい。」", "👴 「森や川の行き止まりに 上手く追い詰めるんじゃぞ！」"];
                    messageIndex = 0;
                    return;
                }
            }
            return; 
        }

        // 🧭 【矢印キー：向き更新 ＆ 移動】
        let targetX = player.x;
        let targetY = player.y;

        if (direction === 'up') {
            player.direction = "up"; 
            if (player.y > 0) targetY--;
        }
        if (direction === 'down') {
            player.direction = "down";
            if (player.y < 29) targetY++;
        }
        if (direction === 'left') {
            player.direction = "left";
            if (player.x > 0) targetX--;
        }
        if (direction === 'right') {
            player.direction = "right";
            if (player.x < 29) targetX++;
        }

        if (targetX === player.x && targetY === player.y) return;

        // 壁判定
        const nextTile = mapData[targetY][targetX];
        if (TILE_TYPES[nextTile] && TILE_TYPES[nextTile].walkable === false) {
            return;
        }

        // 移動アニメーション予約
        player.isMoving = true;
        player.moveProgress = 0;
        player.fromX = player.x;
        player.fromY = player.y;
        player.toX = targetX;
        player.toY = targetY;

        player.x = targetX;
        player.y = targetY;
    } 
    else if (gameMode === "MENU") {
        if (direction === 'A' || direction === 'B') {
            gameMode = "MAP";
        }
    }
    else if (gameMode === "BATTLE") {
        if (direction === 'up') {
            if (commandIndex === 2) commandIndex = 0;
            else if (commandIndex === 3) commandIndex = 1;
            else if (commandIndex === 0) commandIndex = 2;
            else if (commandIndex === 1) commandIndex = 3;
        }
        if (direction === 'down') {
            if (commandIndex === 0) commandIndex = 2;
            else if (commandIndex === 1) commandIndex = 3;
            else if (commandIndex === 2) commandIndex = 0;
            else if (commandIndex === 3) commandIndex = 1;
        }
        if (direction === 'left') {
            if (commandIndex === 1) commandIndex = 0;
            else if (commandIndex === 3) commandIndex = 2;
            else if (commandIndex === 0) commandIndex = 1;
            else if (commandIndex === 2) commandIndex = 3;
        }
        if (direction === 'right') {
            if (commandIndex === 0) commandIndex = 1;
            else if (commandIndex === 2) commandIndex = 3;
            else if (commandIndex === 1) commandIndex = 0;
            else if (commandIndex === 3) commandIndex = 2;
        }

        if (direction === 'A') {
            selectCommand();
        }
        else if (direction === 'B') { 
            commandIndex = 0;
        }
    }
}

// 🎛️ 【スマホ専用】長押しタイマーを開始する関数
function startPress(direction) {
    // 最初の1歩を実行
    move(direction);

    // 既にタイマーが動いていたら一回消す
    if (repeatTimer) clearInterval(repeatTimer);

    // 長押し判定用の遅延タイマーを起動
    repeatTimer = setTimeout(() => {
        // 遅延時間を超えたら、150msごとに連続でmoveを実行し続ける
        repeatTimer = setInterval(() => {
            move(direction);
        }, REPEAT_INTERVAL);
    }, REPEAT_DELAY);
}

// 🎛️ 【スマホ専用】指が離れたらタイマーを完全に止める関数
function endPress() {
    clearTimeout(repeatTimer);
    clearInterval(repeatTimer);
    repeatTimer = null;
}

// ==========================================
// 🖱️ イベントリスナー設定
// ==========================================

// ⌨️ PCキーボード受付（元のまま維持）
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') move('up');
    if (e.key === 'ArrowDown' || e.key === 's') move('down');
    if (e.key === 'ArrowLeft' || e.key === 'a') move('left');
    if (e.key === 'ArrowRight' || e.key === 'd') move('right');
    if (e.key === 'z' || e.key === 'Enter') move('A');
    if (e.key === 'x' || e.key === 'Escape') move('B');
    if (e.key === ' ' || e.key === 'p') move('START'); 
});

// 📱 スマホ十字キー連動（長押し連続移動対応大改造！）
const directions = ['up', 'down', 'left', 'right'];
directions.forEach(dir => {
    const btn = document.getElementById(`pad-${dir}`);
    
    // 指が触れた瞬間
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // スマホ特有の余計な挙動（ズーム等）を完全に殺す
        startPress(dir);
    });

    // 指が離れた、またはズレて外れた瞬間
    btn.addEventListener('touchend', endPress);
    btn.addEventListener('touchcancel', endPress);
});

// 🎮 アクションボタンは長押し不要なので通常タップ（touchstart）で即反応
document.getElementById('btn-a').addEventListener('touchstart', (e) => { e.preventDefault(); move('A'); });
document.getElementById('btn-b').addEventListener('touchstart', (e) => { e.preventDefault(); move('B'); });
document.getElementById('btn-start').addEventListener('touchstart', (e) => { e.preventDefault(); move('START'); });

// 💻 PCでのマウスデバッグ用クリックイベントも保険で維持
document.getElementById('pad-up').addEventListener('click', () => move('up'));
document.getElementById('pad-down').addEventListener('click', () => move('down'));
document.getElementById('pad-left').addEventListener('click', () => move('left'));
document.getElementById('pad-right').addEventListener('click', () => move('right'));
document.getElementById('btn-a').addEventListener('click', () => move('A'));
document.getElementById('btn-b').addEventListener('click', () => move('B'));
document.getElementById('btn-start').addEventListener('click', () => move('START'));
