// === FILE: js/move.js ===

// ==========================================
// 1. わざ各種定数・区分定義
// ==========================================
const MOVE_CATEGORY = {
    PHYSICAL: "PHYSICAL", // 物理こうげき
    SPECIAL:  "SPECIAL",  // 特殊こうげき
    STATUS:   "STATUS"    // 変化・状態異常など
};

// 状態異常ID
const CONDITION_TYPE = {
    NONE:      "NONE",
    PARALYSIS: "PARALYSIS", // まひ
    POISON:    "POISON",    // どく
    BAD_POISON:"BAD_POISON",// もうどく
    BURN:      "BURN",      // やけど
    SLEEP:     "SLEEP",     // ねむり
    FREEZE:    "FREEZE",    // こおり
    CONFUSION: "CONFUSION", // こんらん
    FLINCH:    "FLINCH"     // ひるみ
};

// 特殊追加効果ID
const EFFECT_TYPE = {
    NONE:           "NONE",
    ATTACK_UP_1:    "ATTACK_UP_1",    // 自分の攻撃1段階UP
    ATTACK_UP_2:    "ATTACK_UP_2",    // 自分の攻撃2段階UP
    ATTACK_DOWN_1:  "ATTACK_DOWN_1",  // 相手の攻撃1段階DOWN
    ATTACK_DOWN_2:  "ATTACK_DOWN_2",  // 相手の攻撃2段階DOWN
    DEFENSE_UP_1:   "DEFENSE_UP_1",   // 自分の防御1段階UP
    DEFENSE_UP_2:   "DEFENSE_UP_2",   // 自分の防御2段階UP
    DEFENSE_DOWN_1: "DEFENSE_DOWN_1", // 相手の防御1段階DOWN
    SP_ATK_UP_2:    "SP_ATK_UP_2",    // 自分の特攻2段階UP
    SP_DEF_UP_1:    "SP_DEF_UP_1",    // 自分の特防1段階UP
    SP_DEF_DOWN_1:  "SP_DEF_DOWN_1",  // 相手の特防1段階DOWN
    SPEED_UP_1:     "SPEED_UP_1",     // 自分の素早さ1段階UP
    SPEED_UP_2:     "SPEED_UP_2",     // 自分の素早さ2段階UP
    SPEED_DOWN_1:   "SPEED_DOWN_1",   // 相手の素早さ1段階DOWN
    SPEED_DOWN_2:   "SPEED_DOWN_2",   // 相手の素早さ2段階DOWN
    DRAIN_50:       "DRAIN_50",       // 与ダメージの50%吸収
    RECOIL_25:      "RECOIL_25",      // 与ダメージ의 25%反動
    RECOIL_33:      "RECOIL_33",      // 与ダメージ의 33%反動
    CRITICAL_HIGH:  "CRITICAL_HIGH",  // 急所に当たりやすい
    OHKO:           "OHKO"            // 一撃必殺
};

// ==========================================
// 2. 定番わざマスタ（100わざ完全収録）
// ==========================================
const MOVE_MASTER = {
    // --- 001〜024: 既存＆基本ノーマル・みず・ほのお・くさ・でんき・エスパー・ゴースト ---
    "TAIATARI": {
        no: 1, id: "TAIATARI", name: "たいあたり", type: "NORMAL", category: MOVE_CATEGORY.PHYSICAL,
        power: 40, accuracy: 100, maxPp: 35, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "からだを つかって あいてに とつげきする。"
    },
    "HIKKAKI": {
        no: 2, id: "HIKKAKI", name: "ひっかき", type: "NORMAL", category: MOVE_CATEGORY.PHYSICAL,
        power: 40, accuracy: 100, maxPp: 35, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "するどい つめで あいてを ひっかいて こうげきする。"
    },
    "SUTEMI_TACKLE": {
        no: 3, id: "SUTEMI_TACKLE", name: "すてみタックル", type: "NORMAL", category: MOVE_CATEGORY.PHYSICAL,
        power: 120, accuracy: 100, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.RECOIL_25, effectChance: 100,
        description: "いのちがけで とつげきする。じぶんも すこし ダメージをうける。"
    },
    "SHINKU_HA": {
        no: 4, id: "SHINKU_HA", name: "しんくうは", type: "KAKUTOU", category: MOVE_CATEGORY.SPECIAL,
        power: 40, accuracy: 100, maxPp: 30, priority: 1, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "しんくうの なみを つくりだす。かならず さきに こうげきできる。"
    },
    "IAIGIRI": {
        no: 5, id: "IAIGIRI", name: "いあいぎり", type: "NORMAL", category: MOVE_CATEGORY.PHYSICAL,
        power: 50, accuracy: 95, maxPp: 30, priority: 0, critRate: 1,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.CRITICAL_HIGH, effectChance: 100,
        description: "するどい カマや つめで あいてを きりさいて こうげきする。"
    },
    "NAKIGOE": {
        no: 6, id: "NAKIGOE", name: "なきごえ", type: "NORMAL", category: MOVE_CATEGORY.STATUS,
        power: 0, accuracy: 100, maxPp: 40, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.ATTACK_DOWN_1, effectChance: 100,
        description: "かわいく ないて あいての ゆだんをさそい こうげきを さげる。"
    },
    "AWA": {
        no: 7, id: "AWA", name: "あわ", type: "MIZU", category: MOVE_CATEGORY.SPECIAL,
        power: 40, accuracy: 100, maxPp: 30, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.SPEED_DOWN_1, effectChance: 10,
        description: "無数の あわを ふきつけて あいての すばやさを さげることがある。"
    },
    "MIZU_DEPPOU": {
        no: 8, id: "MIZU_DEPPOU", name: "みずでっぽう", type: "MIZU", category: MOVE_CATEGORY.SPECIAL,
        power: 40, accuracy: 100, maxPp: 25, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "みずを いきおいよく はっしゃして あいてを こうげきする。"
    },
    "KARA_NI_KOMORU": {
        no: 9, id: "KARA_NI_KOMORU", name: "からにこもる", type: "MIZU", category: MOVE_CATEGORY.STATUS,
        power: 0, accuracy: 101, maxPp: 40, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.DEFENSE_UP_1, effectChance: 100,
        description: "かたい からに こもることで じぶんの ぼうぎょを あげる。"
    },
    "HYDRO_PUMP": {
        no: 10, id: "HYDRO_PUMP", name: "ハイドロポンプ", type: "MIZU", category: MOVE_CATEGORY.SPECIAL, // 🌟MOVE_STATEから修正
        power: 110, accuracy: 80, maxPp: 5, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "大量の みずを はげしい いきおいで はっしゃして こうげきする。"
    },
    "HINO_KO": {
        no: 11, id: "HINO_KO", name: "ひのこ", type: "HONOO", category: MOVE_CATEGORY.SPECIAL,
        power: 40, accuracy: 100, maxPp: 25, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.BURN, conditionChance: 10, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "小さな 火の粉を とばして こうげき。あいてを やけどに することがある。"
    },
    "KAEN_RUSH": {
        no: 12, id: "KAEN_RUSH", name: "かえんぐるま", type: "HONOO", category: MOVE_CATEGORY.PHYSICAL,
        power: 60, accuracy: 100, maxPp: 25, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.BURN, conditionChance: 10, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "ほのおを まとって とつげきする。あいてを やけどに することがある。"
    },
    "DAI_MONJI": {
        no: 13, id: "DAI_MONJI", name: "だいもんじ", type: "HONOO", category: MOVE_CATEGORY.SPECIAL,
        power: 110, accuracy: 85, maxPp: 5, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.BURN, conditionChance: 10, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "大の字の ほのおを 焼きつける。あいてを やけどに することがある。"
    },
    "ONI_BI": {
        no: 14, id: "ONI_BI", name: "おにび", type: "HONOO", category: MOVE_CATEGORY.STATUS,
        power: 0, accuracy: 85, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.BURN, conditionChance: 100, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "怪しい 炎を 吹きつけて あいてを 確実に やけど状態にする。"
    },
    "TSURU_NO_MUCHI": {
        no: 15, id: "TSURU_NO_MUCHI", name: "つるのむち", type: "KUSA", category: MOVE_CATEGORY.PHYSICAL,
        power: 45, accuracy: 100, maxPp: 25, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "細い つるを ムチのように しならせて あいてを ぶったたく。"
    },
    "MEGA_DRAIN": {
        no: 16, id: "MEGA_DRAIN", name: "メガドレイン", type: "KUSA", category: MOVE_CATEGORY.SPECIAL,
        power: 40, accuracy: 100, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.DRAIN_50, effectChance: 100,
        description: "あいての 体力を 吸いとる。あたえた ダメージの 半分 体力が 回復する。"
    },
    "SHIBRE_GONA": {
        no: 17, id: "SHIBRE_GONA", name: "しびれごな", type: "KUSA", category: MOVE_CATEGORY.STATUS, // 🌟MOVE_STATEから修正
        power: 0, accuracy: 75, maxPp: 30, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.PARALYSIS, conditionChance: 100, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "しびれる 粉を まきちらす。あいてを まひ 状態にする。"
    },
    "DENGEKI_HA": {
        no: 18, id: "DENGEKI_HA", name: "でんげきは", type: "DENKI", category: MOVE_CATEGORY.SPECIAL,
        power: 60, accuracy: 101, maxPp: 20, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "すばやい 電撃を 放つ。こうげきは かならず 命中する。"
    },
    "10_MAN_VOLT": {
        no: 19, id: "10_MAN_VOLT", name: "10まんボルト", type: "DENKI", category: MOVE_CATEGORY.SPECIAL,
        power: 90, accuracy: 100, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.PARALYSIS, conditionChance: 10, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "強い 電撃を あびせる。あいてを まひ 状態に することがある。"
    },
    "DENJI_HA": {
        no: 20, id: "DENJI_HA", name: "でんじは", type: "DENKI", category: MOVE_CATEGORY.STATUS,
        power: 0, accuracy: 90, maxPp: 20, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.PARALYSIS, conditionChance: 100, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "弱い 電磁波を あびせて あいてを 確実に まひ 状態にする。"
    },
    "NENRIKI": {
        no: 21, id: "NENRIKI", name: "ねんりき", type: "ESP", category: MOVE_CATEGORY.SPECIAL,
        power: 50, accuracy: 100, maxPp: 25, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.CONFUSION, conditionChance: 10, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "弱い 念力を おくりこんで こうげき。あいてを こんらん させることがある。"
    },
    "SHADOW_BALL": {
        no: 22, id: "SHADOW_BALL", name: "シャドーボール", type: "GHOST", category: MOVE_CATEGORY.SPECIAL,
        power: 80, accuracy: 100, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.SP_DEF_DOWN_1, effectChance: 20,
        description: "黒い 影の塊を なげつける。あいての とくぼうを さげることがある。"
    },
    "ZUTSUKI": {
        no: 23, id: "ZUTSUKI", name: "ずつき", type: "NORMAL", category: MOVE_CATEGORY.PHYSICAL,
        power: 70, accuracy: 100, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.FLINCH, conditionChance: 30, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "頭を つきだして いきおいよく こうげき。あいてを ひるませることがある。"
    },
    "KUSO_TACKLE": {
        no: 24, id: "KUSO_TACKLE", name: "クソタックル", type: "NORMAL", category: MOVE_CATEGORY.PHYSICAL,
        power: 55, accuracy: 95, maxPp: 20, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.CONFUSION, conditionChance: 20, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "理不尽な 体当たりを かます。20%の かくりつで あいてを こんらんさせる。"
    },

    // --- 025〜040: 追加ノーマル系統（超定番攻撃・補助） ---
    "HYAKU_RETSU": {
        no: 25, id: "HYAKU_RETSU", name: "おうふくビンタ", type: "NORMAL", category: MOVE_CATEGORY.PHYSICAL,
        power: 15, accuracy: 85, maxPp: 10, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "あいてに 2〜5回の あいだ れんぞくで ビンタを くりだす。"
    },
    "MEGATON_PUNCH": {
        no: 26, id: "MEGATON_PUNCH", name: "メガトンパンチ", type: "NORMAL", category: MOVE_CATEGORY.PHYSICAL,
        power: 80, accuracy: 85, maxPp: 20, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "ものすごい ちからを こめた パンチで あいてを ぶったたく。"
    },
    "MEGATON_KICK": {
        no: 27, id: "MEGATON_KICK", name: "メガトンキック", type: "NORMAL", category: MOVE_CATEGORY.PHYSICAL,
        power: 120, accuracy: 75, maxPp: 5, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "ものすごい ちからを こめた キックで あいてを ぶっとばす。"
    },
    "SPEED_STAR": {
        no: 28, id: "SPEED_STAR", name: "スピードスター", type: "NORMAL", category: MOVE_CATEGORY.SPECIAL, // 🌟MOVE_STATEから修正
        power: 60, accuracy: 101, maxPp: 20, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "星型の 光を たくさん はっしゃする。こうげきは かならず 命中する。"
    },
    "HYPER_BEAM": {
        no: 29, id: "HYPER_BEAM", name: "はかいこうせん", type: "NORMAL", category: MOVE_CATEGORY.SPECIAL,
        power: 150, accuracy: 90, maxPp: 5, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "破壊的な 光線を はっしゃする。つぎのターン 動けなくなる。"
    },
    "KARA_WID": {
        no: 30, id: "KARA_WID", name: "からまわる", type: "NORMAL", category: MOVE_CATEGORY.PHYSICAL,
        power: 40, accuracy: 100, maxPp: 35, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "からだを 高速で 回転させて あいてに ぶつかっていく。"
    },
    "TSURUGI_NO_MAI": {
        no: 31, id: "TSURUGI_NO_MAI", name: "つるぎのまい", type: "NORMAL", category: MOVE_CATEGORY.STATUS,
        power: 0, accuracy: 101, maxPp: 20, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.ATTACK_UP_2, effectChance: 100,
        description: "戦いの おどりを まって じぶんの こうげきを グーンと あげる。"
    },
    "KAGE_BUNSHIN": {
        no: 32, id: "KAGE_BUNSHIN", name: "かげぶんしん", type: "NORMAL", category: MOVE_CATEGORY.STATUS,
        power: 0, accuracy: 101, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "高速移動で まぼろしを つくりだし じぶんの 回避率を あげる。"
    },
    "MARUKU_NARU": {
        no: 33, id: "MARUKU_NARU", name: "まるくなる", type: "NORMAL", category: MOVE_CATEGORY.STATUS,
        power: 0, accuracy: 101, maxPp: 40, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.DEFENSE_UP_1, effectChance: 100,
        description: "からだを 丸めて じぶんの ぼうぎょを 1段階 アップさせる。"
    },
    "SNAKE_EYE": {
        no: 34, id: "SNAKE_EYE", name: "へびにらみ", type: "NORMAL", category: MOVE_CATEGORY.STATUS,
        power: 0, accuracy: 100, maxPp: 30, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.PARALYSIS, conditionChance: 100, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "するどい 目つきで あいてを にらみつけて まひ状態に する。"
    },
    "SING": {
        no: 35, id: "SING", name: "うたう", type: "NORMAL", category: MOVE_CATEGORY.STATUS,
        power: 0, accuracy: 55, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.SLEEP, conditionChance: 100, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "心地よい 子守唄を うたって あいてを 深い ねむりに さそう。"
    },
    "MUSHIBAMI": {
        no: 36, id: "MUSHIBAMI", name: "どくどく", type: "DOKU", category: MOVE_CATEGORY.STATUS,
        power: 0, accuracy: 90, maxPp: 10, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.BAD_POISON, conditionChance: 100, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "徐々に ダメージが 増えていく 特殊などくを あいてに あびせる。"
    },
    "QUICK_ATTACK": {
        no: 37, id: "QUICK_ATTACK", name: "でんこうせっか", type: "NORMAL", category: MOVE_CATEGORY.PHYSICAL,
        power: 40, accuracy: 100, maxPp: 30, priority: 1, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "電光石火の スピードで ぶつかる。かならず 先制攻撃 できる。"
    },
    "UPROAR": {
        no: 38, id: "UPROAR", name: "さわぐ", type: "NORMAL", category: MOVE_CATEGORY.SPECIAL,
        power: 90, accuracy: 100, maxPp: 10, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "3ターンの あいだ 大騒ぎして こうげき。だれも ねむれなくなる。"
    },
    "SONIC_BOOM": {
        no: 39, id: "SONIC_BOOM", name: "ソニックブーム", type: "NORMAL", category: MOVE_CATEGORY.SPECIAL,
        power: 20, accuracy: 90, maxPp: 20, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "衝撃波を はっしゃして こうげき。あいてに 確実に 20ダメージ。"
    },
    "GUILLOTINE": {
        no: 40, id: "GUILLOTINE", name: "ハサミギロチン", type: "NORMAL", category: MOVE_CATEGORY.PHYSICAL,
        power: 999, accuracy: 30, maxPp: 5, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.OHKO, effectChance: 100,
        description: "巨大な ハサミで あいてを 切り裂く。当たれば 一撃必殺。"
    },

    // --- 041〜055: 追加御三家属性（みず・ほのお・くさ進化技） ---
    "SURF": {
        no: 41, id: "SURF", name: "なみのり", type: "MIZU", category: MOVE_CATEGORY.SPECIAL,
        power: 90, accuracy: 100, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "巨大な 波を つくりだし あいてに ぶつけて こうげきする。"
    },
    "AQUA_JET": {
        no: 42, id: "AQUA_JET", name: "アクアジェット", type: "MIZU", category: MOVE_CATEGORY.PHYSICAL,
        power: 40, accuracy: 100, maxPp: 20, priority: 1, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "猛烈な いきおいで あいてに 突撃する。かならず 先制攻撃 できる。"
    },
    "CLAW_PUMP": {
        no: 43, id: "CLAW_PUMP", name: "クラブハンマー", type: "MIZU", category: MOVE_CATEGORY.PHYSICAL,
        power: 100, accuracy: 90, maxPp: 10, priority: 0, critRate: 1,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.CRITICAL_HIGH, effectChance: 100,
        description: "大きな ハサミを 振り下ろす。急所に 当たりやすい。"
    },
    "WATER_PULSE": {
        no: 44, id: "WATER_PULSE", name: "みずのはどう", type: "MIZU", category: MOVE_CATEGORY.SPECIAL,
        power: 60, accuracy: 100, maxPp: 20, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.CONFUSION, conditionChance: 20, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "水の 超音波を はっしゃする。あいてを こんらん させることがある。"
    },
    "FLAME_THROWER": {
        no: 45, id: "FLAME_THROWER", name: "かえんほうしゃ", type: "HONOO", category: MOVE_CATEGORY.SPECIAL,
        power: 90, accuracy: 100, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.BURN, conditionChance: 10, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "激しい 炎を 吹きつけて こうげき。あいてを やけどに することがある。"
    },
    "OVER_HEAT": {
        no: 46, id: "OVER_HEAT", name: "オーバーヒート", type: "HONOO", category: MOVE_CATEGORY.SPECIAL,
        power: 130, accuracy: 90, maxPp: 5, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "フルパワーの 炎を 放つ。つかったあと じぶんの 特攻が ガクッとさがる。"
    },
    "BLAST_BURN": {
        no: 47, id: "BLAST_BURN", name: "ブラストバーン", type: "HONOO", category: MOVE_CATEGORY.SPECIAL,
        power: 150, accuracy: 90, maxPp: 5, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "大爆発の 炎で あいてを 焼き尽くす。つぎのターン 動けなくなる。"
    },
    "NITRO_CHARGE": {
        no: 48, id: "NITRO_CHARGE", name: "ニトロチャージ", type: "HONOO", category: MOVE_CATEGORY.PHYSICAL,
        power: 50, accuracy: 100, maxPp: 20, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.SPEED_UP_1, effectChance: 100,
        description: "炎を まとって こうげき。はじける 炎で じぶんの すばやさを あげる。"
    },
    "HA_GONA": {
        no: 49, id: "HA_GONA", name: "はっぱカッター", type: "KUSA", category: MOVE_CATEGORY.PHYSICAL,
        power: 55, accuracy: 95, maxPp: 25, priority: 0, critRate: 1,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.CRITICAL_HIGH, effectChance: 100,
        description: "無数の 鋭い 葉っぱを はっしゃする。急所に 当たりやすい。"
    },
    "SOLAR_BEAM": {
        no: 50, id: "SOLAR_BEAM", name: "ソーラービーム", type: "KUSA", category: MOVE_CATEGORY.SPECIAL,
        power: 120, accuracy: 100, maxPp: 10, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "光エネルギーを 吸収して はっしゃする。強力な ビームこうげき。"
    },
    "GIGA_DRAIN": {
        no: 51, id: "GIGA_DRAIN", name: "ギガドレイン", type: "KUSA", category: MOVE_CATEGORY.SPECIAL,
        power: 75, accuracy: 100, maxPp: 10, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.DRAIN_50, effectChance: 100,
        description: "あいての 体力を 大量に吸いとる。あたえた 傷の 半分 回復する。"
    },
    "YADOKI_GONA": {
        no: 52, id: "YADOKI_GONA", name: "やどりぎのタネ", type: "KUSA", category: MOVE_CATEGORY.STATUS,
        power: 0, accuracy: 90, maxPp: 10, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "相手に タネを 植えつける。毎ターン 体力を 吸いとる。"
    },
    "NEMURI_GONA": {
        no: 53, id: "NEMURI_GONA", name: "ねむりごな", type: "KUSA", category: MOVE_CATEGORY.STATUS,
        power: 0, accuracy: 75, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.SLEEP, conditionChance: 100, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "あやしい 粉を まきちらして 相手を ねむり 状態に さそう。"
    },
    "HARD_PLANT": {
        no: 54, id: "HARD_PLANT", name: "ハードプラント", type: "KUSA", category: MOVE_CATEGORY.SPECIAL,
        power: 150, accuracy: 90, maxPp: 5, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "巨大な 樹木で あいてを 押し潰す。つぎのターン 動けなくなる。"
    },
    "HYDRO_CANNON": {
        no: 55, id: "HYDRO_CANNON", name: "ハイドロカノン", type: "MIZU", category: MOVE_CATEGORY.SPECIAL,
        power: 150, accuracy: 90, maxPp: 5, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "巨大な 水流の 弾丸を はっしゃする。つぎのターン 動けなくなる。"
    },

    // --- 056〜075: 格闘・飛行・氷・虫・毒・地面・岩・鋼（物理＆特殊バリエーション） ---
    "KAWARA_WARI": {
        no: 56, id: "KAWARA_WARI", name: "かわらわり", type: "KAKUTOU", category: MOVE_CATEGORY.PHYSICAL,
        power: 75, accuracy: 100, maxPp: 15, priority: 0, critRate: 0,
        description: "鋭い 手刀を 相手に 叩きつける。壁の 効果も はかい できる。"
    },
    "CROSS_CHOP": {
        no: 57, id: "CROSS_CHOP", name: "クロスチョップ", type: "KAKUTOU", category: MOVE_CATEGORY.PHYSICAL,
        power: 100, accuracy: 80, maxPp: 5, priority: 0, critRate: 1,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.CRITICAL_HIGH, effectChance: 100,
        description: "両手で 交差の チョップを 放つ。急所に 当たりやすい。"
    },
    "AERO_BLADE": {
        no: 58, id: "AERO_BLADE", name: "エアロブラスト", type: "HIKOU", category: MOVE_CATEGORY.SPECIAL,
        power: 100, accuracy: 95, maxPp: 5, priority: 0, critRate: 1,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.CRITICAL_HIGH, effectChance: 100,
        description: "空気の 渦を はっしゃして こうげき。急所に 当たりやすい。"
    },
    "TSUBAME_GAESHI": {
        no: 59, id: "TSUBAME_GAESHI", name: "つばめがえし", type: "HIKOU", category: MOVE_CATEGORY.PHYSICAL,
        power: 60, accuracy: 101, maxPp: 20, priority: 0, critRate: 0,
        description: "素早い 剣の 動きで あいてを 切り裂く。こうげきは かならず 命中する。"
    },
    "ICE_BEAM": {
        no: 60, id: "ICE_BEAM", name: "れいとうビーム", type: "KOORI", category: MOVE_CATEGORY.SPECIAL,
        power: 90, accuracy: 100, maxPp: 10, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.FREEZE, conditionChance: 10, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "冷気ビームを はっしゃして こうげき。あいてを こおり 状態にすることがある。"
    },
    "BLIZZARD": {
        no: 61, id: "BLIZZARD", name: "ふぶき", type: "KOORI", category: MOVE_CATEGORY.SPECIAL,
        power: 110, accuracy: 70, maxPp: 5, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.FREEZE, conditionChance: 10, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "激しい 吹雪を あびせて こうげき。あいてを こおり 状態にすることがある。"
    },
    "MEGAHORN": {
        no: 62, id: "MEGAHORN", name: "メガホーン", type: "MUSHI", category: MOVE_CATEGORY.PHYSICAL,
        power: 120, accuracy: 85, maxPp: 10, priority: 0, critRate: 0,
        description: "太く 頑丈な ツノを つきだして あいてに 突撃する。"
    },
    "LEECH_LIFE": {
        no: 63, id: "LEECH_LIFE", name: "きゅうけつ", type: "MUSHI", category: MOVE_CATEGORY.PHYSICAL,
        power: 20, accuracy: 100, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.DRAIN_50, effectChance: 100,
        description: "相手の 体力を 吸いとる。あたえた ダメージの 半分 体力が 回復する。"
    },
    "SLUDGE_BOMB": {
        no: 64, id: "SLUDGE_BOMB", name: "ヘドロばくだん", type: "DOKU", category: MOVE_CATEGORY.SPECIAL,
        power: 90, accuracy: 100, maxPp: 10, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.POISON, conditionChance: 30, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "汚い ヘドロを なげつけて こうげき。あいてを どく 状態にすることがある。"
    },
    "POISON_STING": {
        no: 65, id: "POISON_STING", name: "どくばり", type: "DOKU", category: MOVE_CATEGORY.PHYSICAL,
        power: 15, accuracy: 100, maxPp: 35, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.POISON, conditionChance: 30, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "毒の トゲを あいてに 突き刺す。あいてを どく 状態にすることがある。"
    },
    "EARTHQUAKE": {
        no: 66, id: "EARTHQUAKE", name: "じしん", type: "JIMEN", category: MOVE_CATEGORY.PHYSICAL,
        power: 100, accuracy: 100, maxPp: 10, priority: 0, critRate: 0,
        description: "地面を 激しく 揺らして こうげき。すさまじい 地震の 衝撃波。"
    },
    "BONE_RUSH": {
        no: 67, id: "BONE_RUSH", name: "ホネブーメラン", type: "JIMEN", category: MOVE_CATEGORY.PHYSICAL,
        power: 50, accuracy: 90, maxPp: 10, priority: 0, critRate: 0,
        description: "骨の ブーメランを 投げて 2回 れんぞくで ダメージを あたえる。"
    },
    "ROCK_SLIDE": {
        no: 68, id: "ROCK_SLIDE", name: "いわなだれ", type: "IWA", category: MOVE_CATEGORY.PHYSICAL,
        power: 75, accuracy: 90, maxPp: 10, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.FLINCH, conditionChance: 30, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "大きな 岩を 崩し落とす。相手を ひるませる ことがある。"
    },
    "ROCK_BLAST": {
        no: 69, id: "ROCK_BLAST", name: "ロックブラスト", type: "IWA", category: MOVE_CATEGORY.PHYSICAL,
        power: 25, accuracy: 90, maxPp: 10, priority: 0, critRate: 0,
        description: "岩の 弾丸を はっしゃする。2〜5回の あいだ れんぞくで 当たる。"
    },
    "IRON_TAIL": {
        no: 70, id: "IRON_TAIL", name: "アイアンテール", type: "HAGANE", category: MOVE_CATEGORY.PHYSICAL,
        power: 100, accuracy: 75, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.DEFENSE_DOWN_1, effectChance: 30,
        description: "鋼の 硬さの 尻尾で こうげき。相手の ぼうぎょを さげることがある。"
    },
    "STEEL_WING": {
        no: 71, id: "STEEL_WING", name: "は가ねのつばさ", type: "HAGANE", category: MOVE_CATEGORY.PHYSICAL,
        power: 70, accuracy: 90, maxPp: 25, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.DEFENSE_UP_1, effectChance: 10,
        description: "硬い 翼を 広げて とつげき。じぶんの ぼうぎょを あげることがある。"
    },
    "METEOR_MASH": {
        no: 72, id: "METEOR_MASH", name: "コメットパンチ", type: "HAGANE", category: MOVE_CATEGORY.PHYSICAL,
        power: 90, accuracy: 95, maxPp: 10, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.ATTACK_UP_1, effectChance: 20,
        description: "彗星のような パンチを 叩き込む。じぶんの こうげきを あげることがある。"
    },
    "DYNAMIC_PUNCH": {
        no: 73, id: "DYNAMIC_PUNCH", name: "ばくれつパンチ", type: "KAKUTOU", category: MOVE_CATEGORY.PHYSICAL,
        power: 100, accuracy: 50, maxPp: 5, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.CONFUSION, conditionChance: 100, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "渾身の パンチを 叩き込む。当たれば 相手を かならず こんらんさせる。"
    },
    "FLY": {
        no: 74, id: "FLY", name: "そらをとぶ", type: "HIKOU", category: MOVE_CATEGORY.PHYSICAL,
        power: 90, accuracy: 95, maxPp: 15, priority: 0, critRate: 0,
        description: "1ターン目に 空へ 飛び立ち 2ターン目に 相手を 急降下こうげき する。"
    },
    "DIG": {
        no: 75, id: "DIG", name: "あなをほる", type: "JIMEN", category: MOVE_CATEGORY.PHYSICAL,
        power: 80, accuracy: 100, maxPp: 10, priority: 0, critRate: 0,
        description: "1ターン目に 地面に もぐり 2ターン目に 相手を 下から つきあげる。"
    },

    // --- 076〜100: ドラゴン・悪・電気・超・霊など（大人気大技・変化補助完結） ---
    "DRAGON_CLAW": {
        no: 76, id: "DRAGON_CLAW", name: "ドラゴンクロー", type: "DRAGON", category: MOVE_CATEGORY.PHYSICAL,
        power: 80, accuracy: 100, maxPp: 15, priority: 0, critRate: 0,
        description: "鋭く 尖った ツメで 相手を 激しく 切り裂いて こうげきする。"
    },
    "GEKIRIN": {
        no: 77, id: "GEKIRIN", name: "げきりん", type: "DRAGON", category: MOVE_CATEGORY.PHYSICAL,
        power: 120, accuracy: 100, maxPp: 10, priority: 0, critRate: 0,
        description: "2〜3ターンの あいだ 猛烈に 大暴れ。のちに じぶんが こんらん する。"
    },
    "CRUNCH": {
        no: 78, id: "CRUNCH", name: "かみくだく", type: "AKU", category: MOVE_CATEGORY.PHYSICAL,
        power: 80, accuracy: 100, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.DEFENSE_DOWN_1, effectChance: 20,
        description: "鋭い 牙で 相手を かみくだく。相手の ぼうぎょを さげることがある。"
    },
    "BITE": {
        no: 79, id: "BITE", name: "かみつく", type: "AKU", category: MOVE_CATEGORY.PHYSICAL,
        power: 60, accuracy: 100, maxPp: 25, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.FLINCH, conditionChance: 30, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "鋭い 牙で かみついて こうげき。相手を ひるませる ことがある。"
    },
    "DARK_PULSE": {
        no: 80, id: "DARK_PULSE", name: "あくのはどう", type: "AKU", category: MOVE_CATEGORY.SPECIAL,
        power: 80, accuracy: 100, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.FLINCH, conditionChance: 20, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "悪の 念波を 放つ。相手を ひるませる ことがある。"
    },
    "THUNDER_BOLT": {
        no: 81, id: "THUNDER_BOLT", name: "かみなり", type: "DENKI", category: MOVE_CATEGORY.SPECIAL,
        power: 110, accuracy: 70, maxPp: 10, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.PARALYSIS, conditionChance: 30, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "巨大な 雷を 落として こうげき。相手を まひ 状態に することがある。"
    },
    "VOLT_TACKLE": {
        no: 82, id: "VOLT_TACKLE", name: "ボルテッカー", type: "DENKI", category: MOVE_CATEGORY.PHYSICAL,
        power: 120, accuracy: 100, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.PARALYSIS, conditionChance: 10, effectId: EFFECT_TYPE.RECOIL_33, effectChance: 100,
        description: "電気を まとって 特攻。じぶんも 大きな ダメージを うける。"
    },
    "PSYCHOKINESIS": {
        no: 83, id: "PSYCHOKINESIS", name: "サイコキネシス", type: "ESP", category: MOVE_CATEGORY.SPECIAL,
        power: 90, accuracy: 100, maxPp: 10, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.SP_DEF_DOWN_1, effectChance: 10,
        description: "強力な 念波を 相手に ぶつける。あいての とくぼうを さげることがある。"
    },
    "MIRACLE_EYE": {
        no: 84, id: "MIRACLE_EYE", name: "めいそう", type: "ESP", category: MOVE_CATEGORY.STATUS,
        power: 0, accuracy: 101, maxPp: 20, priority: 0, critRate: 0,
        description: "心を 研ぎ澄まして 集中する。じぶんの とくこう とくぼう をあげる。"
    },
    "NIGHT_SHADE": {
        no: 85, id: "NIGHT_SHADE", name: "ナイトヘッド", type: "GHOST", category: MOVE_CATEGORY.SPECIAL,
        power: 0, accuracy: 100, maxPp: 15, priority: 0, critRate: 0,
        description: "相手に 恐ろしい 幻を みせる。はじきだす ダメージは じぶんの レベルと同じ。"
    },
    "CONFUSE_RAY": {
        no: 86, id: "CONFUSE_RAY", name: "あやしいひかり", type: "GHOST", category: MOVE_CATEGORY.STATUS,
        power: 0, accuracy: 100, maxPp: 10, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.CONFUSION, conditionChance: 100, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "怪しい 光を あびせて 相手を 確実に こんらん 状態にする。"
    },
    "RECOVER": {
        no: 87, id: "RECOVER", name: "じこさいせい", type: "NORMAL", category: MOVE_CATEGORY.STATUS,
        power: 0, accuracy: 101, maxPp: 10, priority: 0, critRate: 0,
        description: "細胞を 急激に 再生させる。じぶんの 最大HPの 半分を 回復する。"
    },
    "TOXIC_FANG": {
        no: 88, id: "TOXIC_FANG", name: "どくどくのキバ", type: "DOKU", category: MOVE_CATEGORY.PHYSICAL,
        power: 50, accuracy: 100, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.BAD_POISON, conditionChance: 50, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "毒の 牙で かみつく。50%の かくりつで 相手を もうどく 状態にする。"
    },
    "GIGA_IMPACT": {
        no: 89, id: "GIGA_IMPACT", name: "ギガインパクト", type: "NORMAL", category: MOVE_CATEGORY.PHYSICAL,
        power: 150, accuracy: 90, maxPp: 5, priority: 0, critRate: 0,
        description: "持てる 力の すべてを ぶつける。つぎのターン じぶんは 動けなくなる。"
    },
    "AURA_SPHERE": {
        no: 90, id: "AURA_SPHERE", name: "波動だん", type: "KAKUTOU", category: MOVE_CATEGORY.SPECIAL,
        power: 80, accuracy: 101, maxPp: 20, priority: 0, critRate: 0,
        description: "波導の パワーを 弾丸にして 放つ。こうげきは かならず 命中する。"
    },
    "SHADOW_CLAW": {
        no: 91, id: "SHADOW_CLAW", name: "シャドークロー", type: "GHOST", category: MOVE_CATEGORY.PHYSICAL,
        power: 70, accuracy: 100, maxPp: 15, priority: 0, critRate: 1,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.CRITICAL_HIGH, effectChance: 100,
        description: "影の つめで 相手を 切り裂く。急所に 当たりやすい。"
    },
    "ICE_SHARD": {
        no: 92, id: "ICE_SHARD", name: "こおりのつぶて", type: "KOORI", category: MOVE_CATEGORY.PHYSICAL,
        power: 40, accuracy: 100, maxPp: 30, priority: 1, critRate: 0,
        description: "氷の 塊を 高速で 放つ。かならず 先制攻撃 できる。"
    },
    "X_SCISSOR": {
        no: 93, id: "X_SCISSOR", name: "シザークロス", type: "MUSHI", category: MOVE_CATEGORY.PHYSICAL,
        power: 80, accuracy: 100, maxPp: 15, priority: 0, critRate: 0,
        description: "交差させた 鋭い カマや つめで あいてを 激しく 切り裂く。"
    },
    "BUG_BUZZ": {
        no: 94, id: "BUG_BUZZ", name: "むしのさざめき", type: "MUSHI", category: MOVE_CATEGORY.SPECIAL,
        power: 90, accuracy: 100, maxPp: 10, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.SP_DEF_DOWN_1, effectChance: 10,
        description: "羽を 振動させて 猛烈な 音波を 放つ。相手の とくぼうを さげることがある。"
    },
    "EXTREME_SPEED": {
        no: 95, id: "EXTREME_SPEED", name: "しんそく", type: "NORMAL", category: MOVE_CATEGORY.PHYSICAL,
        power: 80, accuracy: 100, maxPp: 5, priority: 2, critRate: 0,
        description: "猛烈な スピードで 突撃する。通常の 先制技よりも 早く 行動できる。"
    },
    "FLARE_DRIVE": {
        no: 96, id: "FLARE_DRIVE", name: "フレアドライブ", type: "HONOO", category: MOVE_CATEGORY.PHYSICAL,
        power: 120, accuracy: 100, maxPp: 15, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.BURN, conditionChance: 10, effectId: EFFECT_TYPE.RECOIL_33, effectChance: 100,
        description: "炎を まとって 特攻。あいてを やけどに させることがあるが じぶんも 反動をうける。"
    },
    "LEAF_STORM": {
        no: 97, id: "LEAF_STORM", name: "リーフストーム", type: "KUSA", category: MOVE_CATEGORY.SPECIAL,
        power: 130, accuracy: 90, maxPp: 5, priority: 0, critRate: 0,
        description: "無数の 鋭い 葉っぱで 嵐を おこす。つかったあと じぶんの 特攻が ガクッとさがる。"
    },
    "DRAIN_PUNCH": {
        no: 98, id: "DRAIN_PUNCH", name: "ドレインパンチ", type: "KAKUTOU", category: MOVE_CATEGORY.PHYSICAL,
        power: 75, accuracy: 100, maxPp: 10, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.DRAIN_50, effectChance: 100,
        description: "あいての 体力を 吸いとる 拳パンチ。あたえた ダメージの 半分 回復する。"
    },
    "SHEER_COLD": {
        no: 99, id: "SHEER_COLD", name: "ぜったいれいど", type: "KOORI", category: MOVE_CATEGORY.SPECIAL,
        power: 999, accuracy: 30, maxPp: 5, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.OHKO, effectChance: 100,
        description: "究極の 冷気で 相手を 凍りつかせる。当たれば 一撃必殺。"
    },
    "RYU_NO_MAI": {
        no: 100, id: "RYU_NO_MAI", name: "りゅうのまい", type: "DRAGON", category: MOVE_CATEGORY.STATUS,
        power: 0, accuracy: 101, maxPp: 20, priority: 0, critRate: 0,
        description: "神秘的な ダンスを 踊る。じぶんの こうげき と すばやさ を 1段階あげる。"
    }
};

// ==========================================
// 3. 汎用データアクセスAPI（安全設計）
// ==========================================
function getMove(moveId) {
    return MOVE_MASTER[moveId] || {
        no: 0, id: "UNKNOWN", name: "---", type: "NORMAL", category: MOVE_CATEGORY.STATUS,
        power: 0, accuracy: 100, maxPp: 0, priority: 0, critRate: 0,
        conditionId: CONDITION_TYPE.NONE, conditionChance: 0, effectId: EFFECT_TYPE.NONE, effectChance: 0,
        description: "未定義の わざデータです。"
    };
}