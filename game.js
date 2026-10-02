/**
 * COSMIC FURY - Space Shooter Arcade Game
 * A premium arcade experience with smooth gameplay and stunning visuals
 */

// ============================================
// MOBILE DETECTION & OPTIMIZATION
// ============================================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < 800 || 'ontouchstart' in window;

// ============================================
// GAME CONFIGURATION
// ============================================
const CONFIG = {
    player: {
        width: 50,
        height: 60,
        speed: isMobile ? 10 : 8,  // Faster on mobile for touch controls
        maxHealth: 100,
        shootCooldown: isMobile ? 200 : 150,  // Slightly slower fire on mobile
        invincibilityTime: 1500,
        baseDamage: 1
    },
    bullet: {
        width: 4,
        height: 20,
        speed: 12,
        color: '#00f5ff'
    },
    enemy: {
        baseSpeed: isMobile ? 2.5 : 3.5,  // SLOWER on mobile for playability
        spawnRate: isMobile ? 1200 : 600,  // MUCH SLOWER spawning on mobile
        healthScale: isMobile ? 0.10 : 0.15, // Less health scaling on mobile
        types: {
            basic: { width: 40, height: 40, health: 2, points: 100, color: '#ff3366', xp: 10 },
            fast: { width: 30, height: 30, health: 1, points: 150, color: '#ff9933', speedMult: 2.2, xp: 15 },
            tank: { width: 60, height: 60, health: 5, points: 300, color: '#9933ff', speedMult: 0.5, xp: 30 },
            sniper: { width: 35, height: 45, health: 3, points: 200, color: '#ff6600', speedMult: 0.7, xp: 25, shoots: true },
            zigzag: { width: 35, height: 35, health: 2, points: 180, color: '#ffff00', speedMult: 1.7, xp: 20 },
            swarm: { width: 20, height: 20, health: 1, points: 50, color: '#00ff66', speedMult: 2.0, xp: 8 },
            bomber: { width: 50, height: 50, health: 4, points: 250, color: '#ff0000', speedMult: 0.9, xp: 35, explodes: true },
            elite: { width: 55, height: 55, health: 8, points: 500, color: '#ff00aa', speedMult: 0.6, xp: 60, shoots: true, elite: true },
            // NEW ENEMY TYPES
            shielded: { width: 45, height: 45, health: 4, points: 350, color: '#0088ff', speedMult: 0.8, xp: 40, shield: 3, shieldColor: '#00ccff' },
            teleporter: { width: 35, height: 35, health: 2, points: 300, color: '#cc00ff', speedMult: 1.0, xp: 35, teleports: true },
            splitter: { width: 50, height: 50, health: 3, points: 400, color: '#88ff00', speedMult: 0.7, xp: 45, splits: true }
        }
    },
    boss: {
        baseHealth: 200,    // HARDER: Doubled from 100
        healthPerWave: 60,  // HARDER: Increased from 40
        width: 140,         // Slightly larger
        height: 120,
        speed: 3.5,         // HARDER: Much faster boss
        points: 8000,       // Higher reward for harder boss
        xp: 800,            // More XP reward
        waveInterval: 3     // Boss every 3 waves
    },
    powerUp: {
        spawnChance: 0.07,  // HARDER: Reduced from 0.10
        duration: 5000,
        types: {
            rapidFire: { color: '#ffcc00', symbol: '⚡' },
            shield: { color: '#00ff88', symbol: '🛡️' },
            multiShot: { color: '#ff00ff', symbol: '✦' },
            heal: { color: '#ff6b6b', symbol: '❤️' }
        }
    },
    particles: {
        explosionCount: isMobile ? 5 : 15,  // Much fewer particles on mobile
        trailCount: isMobile ? 0 : 2  // No trails on mobile for performance
    },
    progression: {
        xpPerLevel: 500,
        maxLevel: 30  // Increased max level
    },
    combo: {
        timeout: 1800,  // HARDER: Less time for combos
        maxMultiplier: 15
    },
    abilities: {
        bomb: { cooldown: 25000, unlockLevel: 1 },
        slowmo: { cooldown: 30000, duration: 4000, unlockLevel: 3 },
        laser: { cooldown: 40000, duration: 2000, unlockLevel: 5 },
        ultimate: { cooldown: 60000, unlockLevel: 10 }
    },
    // WEAPON SYSTEM - Multiple weapon types
    weapons: {
        laser: {
            name: 'Laser Cannon',
            icon: '⚡',
            damage: 1,
            speed: 14,
            cooldown: 150,
            width: 4,
            height: 20,
            color: '#00f5ff',
            spread: 0,
            projectiles: 1,
            homing: false,
            piercing: false,
            explosive: false,
            unlockLevel: 1
        },
        plasma: {
            name: 'Plasma Spreader',
            icon: '💠',
            damage: 0.8,
            speed: 11,
            cooldown: 200,
            width: 6,
            height: 15,
            color: '#ff00ff',
            spread: 0.15,
            projectiles: 3,
            homing: false,
            piercing: false,
            explosive: false,
            unlockLevel: 5
        },
        missile: {
            name: 'Homing Missiles',
            icon: '🚀',
            damage: 2.5,
            speed: 8,
            cooldown: 400,
            width: 8,
            height: 16,
            color: '#ff6600',
            spread: 0,
            projectiles: 1,
            homing: true,
            piercing: false,
            explosive: true,
            unlockLevel: 8
        },
        railgun: {
            name: 'Railgun',
            icon: '🔫',
            damage: 4,
            speed: 20,
            cooldown: 600,
            width: 3,
            height: 40,
            color: '#ffff00',
            spread: 0,
            projectiles: 1,
            homing: false,
            piercing: true,
            explosive: false,
            unlockLevel: 12
        }
    },
    // DRONE SYSTEM
    drones: {
        maxDrones: 3,
        damage: 0.5,
        fireRate: 800,
        orbitRadius: 60,
        orbitSpeed: 2
    },
    // ENVIRONMENT SYSTEM
    environments: [
        { name: 'Deep Space', bgColor1: '#0a0a1a', bgColor2: '#1a0a2e', starColor: '#ffffff' },
        { name: 'Nebula Zone', bgColor1: '#1a0a2e', bgColor2: '#2e0a3e', starColor: '#ff88ff' },
        { name: 'Asteroid Belt', bgColor1: '#1a1a0a', bgColor2: '#2e2e1a', starColor: '#ffaa66' },
        { name: 'Frozen Sector', bgColor1: '#0a1a2e', bgColor2: '#1a2e3e', starColor: '#88ffff' },
        { name: 'Solar Storm', bgColor1: '#2e1a0a', bgColor2: '#3e2e1a', starColor: '#ffcc00' }
    ]
};

// ============================================
// GAME STATE
// ============================================
let canvas, ctx;
let gameState = 'menu';
let score = 0;
let wave = 1;
let enemiesDestroyed = 0;
let highScore = parseInt(localStorage.getItem('cosmicFuryHighScore')) || 0;

// ============================================
// PROFILE SYSTEM
// ============================================
let profiles = [];        // Array of all profile objects
let currentProfile = null; // Currently selected profile object

// GAME MODE SYSTEM
let gameMode = 'arcade'; // 'arcade', 'endless', 'daily'
let currentEnvironment = 0;

// WEAPON SYSTEM
let currentWeapon = 'laser';
const WEAPON_ORDER = ['laser', 'plasma', 'missile', 'railgun'];

// DRONE SYSTEM
let drones = [];
let lastDroneShot = 0;

// TIMER TRACKING (for cleanup on restart)
let slowmoTimeoutId = null;
let laserIntervalId = null;
let laserTimeoutId = null;
let saveDebounceTimer = null;

// STATISTICS SYSTEM
let gameStats = {
    totalKills: 0,
    totalDeaths: 0,
    totalScore: 0,
    totalPlayTime: 0,
    highestWave: 0,
    highestCombo: 0,
    bossesDefeated: 0,
    gamesPlayed: 0,
    powerUpsCollected: 0,
    bulletsShot: 0
};

// LEADERBOARD SYSTEM
let leaderboard = [];

// PRESTIGE SYSTEM
let prestigeLevel = 0;
let prestigePoints = 0;

// DAILY CHALLENGE SYSTEM
let dailyChallenge = null;
let dailyChallengeCompleted = false;
let lastDailyDate = '';

// SETTINGS SYSTEM
let gameSettings = {
    screenShake: true,
    particles: 'high', // 'low', 'medium', 'high'
    musicVolume: 0.7,
    sfxVolume: 0.8,
    showDamageNumbers: true,
    autoFire: false
};

// Progression
let playerLevel = 1;
let playerXP = 0;
let totalXP = 0;
let sessionXP = 0;
let sessionPoints = 0;

// Combo system
let comboCount = 0;
let comboMultiplier = 1;
let lastKillTime = 0;
let maxCombo = 0;

// Boss system
let currentBoss = null;
let bossActive = false;
let bossPhase = 0; // NEW: Multi-phase boss tracking

// Abilities
let abilityCooldowns = { bomb: 0, slowmo: 0, laser: 0, ultimate: 0 };
let slowmoActive = false;
let laserActive = false;
let ultimateActive = false;

// Achievements
let achievements = {};
let achievementQueue = [];

// Points & Upgrades System - EXPANDED
let points = 0;
let upgrades = {
    fireRate: 0,    // Max 10: -8% cooldown per level
    damage: 0,      // Max 10: +1 damage per level
    shield: 0,      // Max 10: +20 max HP per level
    speed: 0,       // Max 10: +8% speed per level
    magnet: 0,      // Max 10: +15 range per level
    luck: 0,        // Max 10: +2% drop rate per level
    critical: 0,    // NEW: Max 10: +5% crit chance per level
    armor: 0,       // NEW: Max 10: -5% damage taken per level
    xpBoost: 0,     // NEW: Max 10: +10% XP per level
    pointBoost: 0   // NEW: Max 10: +8% points per level
};

const UPGRADE_CONFIG = {
    fireRate: { cost: 400, maxLevel: 10, costMult: 1.4, icon: '🔥', name: 'Fire Rate', desc: '-8% cooldown' },
    damage: { cost: 400, maxLevel: 10, costMult: 1.4, icon: '💥', name: 'Damage', desc: '+1 damage' },
    shield: { cost: 400, maxLevel: 10, costMult: 1.4, icon: '🛡️', name: 'Max Shield', desc: '+20 max HP' },
    speed: { cost: 400, maxLevel: 10, costMult: 1.4, icon: '⚡', name: 'Speed', desc: '+8% speed' },
    magnet: { cost: 600, maxLevel: 10, costMult: 1.35, icon: '🧲', name: 'Magnet', desc: '+15 attract range' },
    luck: { cost: 600, maxLevel: 10, costMult: 1.35, icon: '🍀', name: 'Lucky', desc: '+2% drop rate' },
    critical: { cost: 800, maxLevel: 10, costMult: 1.5, icon: '🎯', name: 'Critical Hit', desc: '+5% crit chance' },
    armor: { cost: 800, maxLevel: 10, costMult: 1.5, icon: '🔰', name: 'Armor', desc: '-5% damage taken' },
    xpBoost: { cost: 1000, maxLevel: 10, costMult: 1.45, icon: '📈', name: 'XP Boost', desc: '+10% XP gain' },
    pointBoost: { cost: 1000, maxLevel: 10, costMult: 1.45, icon: '💎', name: 'Point Boost', desc: '+8% points' }
};

// Skins System - Purchase with points - Each skin has UNIQUE ABILITIES!
const SKINS = [
    // ═══════════════════════════════════════════════════════════════
    // STANDARD SKINS - Basic to Moderate Abilities
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'default', name: 'Starfighter', primary: '#00f5ff', secondary: '#0088aa', glow: '#00f5ff', cost: 0,
        ability: 'balanced', abilityName: 'Balanced', abilityDesc: 'No special bonuses',
        bonuses: {}
    },
    {
        id: 'fire', name: 'Inferno', primary: '#ff4400', secondary: '#aa2200', glow: '#ff6600', cost: 500,
        ability: 'burn', abilityName: '🔥 Burn Damage', abilityDesc: '+15% damage, enemies burn',
        bonuses: { damageBonus: 0.15, burnDamage: true }
    },
    {
        id: 'toxic', name: 'Venomous', primary: '#00ff44', secondary: '#00aa22', glow: '#44ff00', cost: 750,
        ability: 'poison', abilityName: '☠️ Poison Cloud', abilityDesc: 'Kills leave poison that damages enemies',
        bonuses: { poisonCloud: true }
    },
    {
        id: 'royal', name: 'Royal Guard', primary: '#9944ff', secondary: '#6622cc', glow: '#aa66ff', cost: 1000,
        ability: 'shield', abilityName: '👑 Royal Shield', abilityDesc: '+20% max health',
        bonuses: { healthBonus: 0.20 }
    },
    {
        id: 'gold', name: 'Golden Eagle', primary: '#ffcc00', secondary: '#cc9900', glow: '#ffdd44', cost: 1500,
        ability: 'fortune', abilityName: '💰 Fortune', abilityDesc: '+30% points earned',
        bonuses: { pointsBonus: 0.30 }
    },
    {
        id: 'ice', name: 'Frostbite', primary: '#88ddff', secondary: '#4499cc', glow: '#aaeeff', cost: 2000,
        ability: 'freeze', abilityName: '❄️ Freeze', abilityDesc: '15% chance to slow enemies',
        bonuses: { freezeChance: 0.15 }
    },
    {
        id: 'shadow', name: 'Shadow Strike', primary: '#444466', secondary: '#222233', glow: '#6666aa', cost: 2500,
        ability: 'stealth', abilityName: '👤 Stealth', abilityDesc: '20% dodge chance',
        bonuses: { dodgeChance: 0.20 }
    },
    {
        id: 'plasma', name: 'Plasma Core', primary: '#ff00ff', secondary: '#aa00aa', glow: '#ff44ff', cost: 3000,
        ability: 'chain', abilityName: '⚡ Chain Lightning', abilityDesc: 'Bullets chain to nearby enemies',
        bonuses: { chainAttack: true }
    },
    {
        id: 'solar', name: 'Solar Flare', primary: '#ffaa00', secondary: '#ff6600', glow: '#ffcc44', cost: 4000,
        ability: 'explosion', abilityName: '💥 Explosion', abilityDesc: 'Kills cause small explosions',
        bonuses: { explosionOnKill: true }
    },
    {
        id: 'legendary', name: 'Legendary', primary: '#ffffff', secondary: '#ffcc00', glow: '#ffffff', cost: 5000,
        ability: 'allrounder', abilityName: '⭐ Multi-Boost', abilityDesc: '+10% to all stats',
        bonuses: { allStats: 0.10 }
    },

    // ═══════════════════════════════════════════════════════════════
    // ★ PREMIUM STYLISH SKINS - Powerful Abilities ★
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'nebula', name: 'Nebula Drift', primary: '#e040fb', secondary: '#7c4dff', glow: '#ea80fc', cost: 6000, premium: true,
        ability: 'gravity', abilityName: '🌀 Gravity Pull', abilityDesc: '+50% power-up magnet range',
        bonuses: { magnetBonus: 0.50 }
    },
    {
        id: 'aurora', name: 'Aurora Borealis', primary: '#00e5ff', secondary: '#1de9b6', glow: '#84ffff', cost: 7500, premium: true,
        ability: 'regen', abilityName: '💚 Healing Aura', abilityDesc: 'Regenerate 2 HP every 3 seconds',
        bonuses: { healthRegen: 2, regenInterval: 3000 }
    },
    {
        id: 'bloodmoon', name: 'Blood Moon', primary: '#d50000', secondary: '#880e4f', glow: '#ff1744', cost: 8000, premium: true,
        ability: 'vampiric', abilityName: '🩸 Vampiric', abilityDesc: 'Heal 5% of max HP on kill',
        bonuses: { vampiric: 0.05 }
    },
    {
        id: 'galaxy', name: 'Galaxy Rider', primary: '#536dfe', secondary: '#304ffe', glow: '#8c9eff', cost: 9000, premium: true,
        ability: 'warp', abilityName: '🚀 Warp Speed', abilityDesc: '+35% movement speed',
        bonuses: { speedBonus: 0.35 }
    },
    {
        id: 'phoenix', name: 'Phoenix Rising', primary: '#ff6d00', secondary: '#dd2c00', glow: '#ffab40', cost: 10000, premium: true,
        ability: 'rebirth', abilityName: '🔥 Rebirth', abilityDesc: 'Revive once with 50% HP',
        bonuses: { rebirth: true, rebirthHealth: 0.50 }
    },
    {
        id: 'diamond', name: 'Diamond Dust', primary: '#b2ebf2', secondary: '#80deea', glow: '#e0f7fa', cost: 12000, premium: true,
        ability: 'reflect', abilityName: '💎 Reflection', abilityDesc: '20% chance to reflect enemy bullets',
        bonuses: { reflectChance: 0.20 }
    },
    {
        id: 'void', name: 'Void Walker', primary: '#311b92', secondary: '#1a0033', glow: '#7c4dff', cost: 14000, premium: true,
        ability: 'phase', abilityName: '👻 Phase Shift', abilityDesc: '30% dodge + piercing bullets',
        bonuses: { dodgeChance: 0.30, piercingBullets: true }
    },
    {
        id: 'neon', name: 'Neon Dreams', primary: '#76ff03', secondary: '#00e676', glow: '#b2ff59', cost: 16000, premium: true,
        ability: 'rapidfire', abilityName: '⚡ Rapid Fire', abilityDesc: '+40% fire rate',
        bonuses: { fireRateBonus: 0.40 }
    },
    {
        id: 'cosmic', name: 'Cosmic Emperor', primary: '#ffd700', secondary: '#ff4081', glow: '#ffe57f', cost: 20000, premium: true,
        ability: 'emperor', abilityName: '👑 Emperor\'s Might', abilityDesc: '+60% damage, -15% speed',
        bonuses: { damageBonus: 0.60, speedPenalty: -0.15 }
    },
    {
        id: 'ultimate', name: 'Ultimate Nova', primary: '#ffffff', secondary: '#00ffff', glow: '#ffffff', cost: 25000, premium: true, rainbow: true,
        ability: 'supreme', abilityName: '🌟 Supreme Power', abilityDesc: 'All abilities combined at 25% effectiveness',
        bonuses: {
            allStats: 0.15, vampiric: 0.03, dodgeChance: 0.10,
            fireRateBonus: 0.15, explosionOnKill: true, chainAttack: true
        }
    }
];

let selectedSkin = 'default';
let purchasedSkins = ['default']; // Default skin is always owned
let phoenixUsed = false; // Track if phoenix rebirth was used this game


// Game Objects
let player = null;
let bullets = [];
let enemies = [];
let particles = [];
let powerUps = [];
let enemyBullets = [];
let activePowerUps = {};

// Timing
let lastTime = 0;
let lastShot = 0;
let lastEnemySpawn = 0;
let waveTimer = 0;
let deltaTime = 0;
let gameSpeed = 1;

// Input
const keys = {};

// ACHIEVEMENTS DEFINITION - EXPANDED
// ============================================
const ACHIEVEMENTS = {
    // Combat Achievements
    firstBlood: { name: 'First Blood', desc: 'Kill first enemy', xp: 100, icon: '🩸', check: () => enemiesDestroyed >= 1 },
    centurion: { name: 'Centurion', desc: 'Kill 100 enemies', xp: 500, icon: '⚔️', check: () => gameStats.totalKills >= 100 },
    destroyer: { name: 'Destroyer', desc: 'Kill 500 enemies', xp: 1000, icon: '💀', check: () => gameStats.totalKills >= 500 },
    annihilator: { name: 'Annihilator', desc: 'Kill 1000 enemies', xp: 2000, icon: '☠️', check: () => gameStats.totalKills >= 1000 },

    // Boss Achievements
    bossSlayer: { name: 'Boss Slayer', desc: 'Defeat a boss', xp: 300, icon: '🎯', check: () => achievements.bossKilled },
    bossHunter: { name: 'Boss Hunter', desc: 'Defeat 5 bosses', xp: 1000, icon: '👹', check: () => gameStats.bossesDefeated >= 5 },
    bossLegend: { name: 'Boss Legend', desc: 'Defeat 20 bosses', xp: 3000, icon: '🏆', check: () => gameStats.bossesDefeated >= 20 },

    // Combo Achievements
    comboStarter: { name: 'Combo Starter', desc: '10x combo', xp: 200, icon: '🔥', check: () => maxCombo >= 10 },
    comboMaster: { name: 'Combo Master', desc: '50x combo', xp: 1000, icon: '💥', check: () => maxCombo >= 50 },
    comboLegend: { name: 'Combo Legend', desc: '100x combo', xp: 2500, icon: '⭐', check: () => maxCombo >= 100 },

    // Survival Achievements
    survivor5: { name: 'Survivor', desc: 'Reach wave 5', xp: 200, icon: '🛡️', check: () => wave >= 5 },
    survivor10: { name: 'Veteran', desc: 'Reach wave 10', xp: 500, icon: '⚡', check: () => wave >= 10 },
    survivor20: { name: 'Elite', desc: 'Reach wave 20', xp: 1500, icon: '🎖️', check: () => wave >= 20 },
    survivor50: { name: 'Legendary', desc: 'Reach wave 50', xp: 5000, icon: '👑', check: () => wave >= 50 },

    // Score Achievements
    score10k: { name: 'Rising Star', desc: 'Score 10,000 points', xp: 200, icon: '⭐', check: () => score >= 10000 },
    score100k: { name: 'High Scorer', desc: 'Score 100,000 points', xp: 800, icon: '🌟', check: () => score >= 100000 },
    score1m: { name: 'Million Club', desc: 'Score 1,000,000 points', xp: 3000, icon: '💫', check: () => score >= 1000000 },

    // Collection Achievements
    skinCollector: { name: 'Skin Collector', desc: 'Own 5 skins', xp: 500, icon: '🎨', check: () => purchasedSkins.length >= 5 },
    skinEnthusiast: { name: 'Skin Enthusiast', desc: 'Own 10 skins', xp: 1500, icon: '👔', check: () => purchasedSkins.length >= 10 },

    // Upgrade Achievements
    upgrader: { name: 'Upgrader', desc: 'Buy 10 upgrades', xp: 300, icon: '⚙️', check: () => Object.values(upgrades).reduce((a, b) => a + b, 0) >= 10 },
    maxed: { name: 'Maxed Out', desc: 'Max any upgrade', xp: 1000, icon: '💪', check: () => Object.values(upgrades).some(v => v >= 10) },

    // Special Achievements  
    phoenixRise: { name: 'Phoenix Rise', desc: 'Revive using Phoenix skin', xp: 500, icon: '🔥', check: () => achievements.usedPhoenix },
    perfectWave: { name: 'Perfect Wave', desc: 'Complete wave without damage', xp: 800, icon: '✨', check: () => achievements.perfectWave },
    speedRunner: { name: 'Speed Runner', desc: 'Kill 50 enemies in 30 seconds', xp: 600, icon: '⚡', check: () => achievements.speedRunner }
};

// DAILY CHALLENGE DEFINITIONS
const DAILY_MODIFIERS = [
    { id: 'doubleSpeed', name: 'Double Speed', desc: 'Enemies move 2x faster', modifier: (config) => { config.enemy.baseSpeed *= 2; } },
    { id: 'noAbilities', name: 'No Abilities', desc: 'Cannot use special abilities', modifier: () => { } },
    { id: 'bossRush', name: 'Boss Rush', desc: 'Boss every wave', modifier: (config) => { config.boss.waveInterval = 1; } },
    { id: 'glassCanon', name: 'Glass Canon', desc: '3x damage but 50% health', modifier: () => { } },
    { id: 'bulletHell', name: 'Bullet Hell', desc: 'Enemies shoot 3x faster', modifier: () => { } },
    { id: 'luckyDay', name: 'Lucky Day', desc: '3x power-up drops', modifier: (config) => { config.powerUp.spawnChance *= 3; } },
    { id: 'noHealing', name: 'No Healing', desc: 'Cannot heal during game', modifier: () => { } },
    { id: 'eliteOnly', name: 'Elite Only', desc: 'All enemies are elite', modifier: () => { } }
];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', init);

function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Mobile touch controls
    setupTouchControls();

    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', startGame);
    document.getElementById('audio-toggle').addEventListener('click', toggleAudio);
    document.getElementById('upgrades-btn').addEventListener('click', openUpgradeShop);
    document.getElementById('close-upgrades-btn').addEventListener('click', closeUpgradeShop);
    document.getElementById('skins-btn').addEventListener('click', openSkinShop);
    document.getElementById('close-skins-btn').addEventListener('click', closeSkinShop);

    // Upgrade buy buttons - All 10 upgrades
    ['fireRate', 'damage', 'shield', 'speed', 'magnet', 'luck', 'critical', 'armor', 'xpBoost', 'pointBoost'].forEach(type => {
        document.getElementById(`buy-${type}`).addEventListener('click', () => buyUpgrade(type));
    });

    // Pause menu buttons
    document.getElementById('resume-btn').addEventListener('click', resumeGame);
    document.getElementById('pause-restart-btn').addEventListener('click', restartFromPause);
    document.getElementById('home-btn').addEventListener('click', goHome);

    // HUD home button
    document.getElementById('hud-home-btn').addEventListener('click', () => {
        if (gameState === 'playing') togglePause();
    });

    // Reset progress button
    document.getElementById('reset-btn').addEventListener('click', resetProgress);

    // NEW: Game mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setGameMode(btn.dataset.mode);
        });
    });

    // NEW: Stats screen
    const statsBtn = document.getElementById('stats-btn');
    const closeStatsBtn = document.getElementById('close-stats-btn');
    if (statsBtn) statsBtn.addEventListener('click', openStatsScreen);
    if (closeStatsBtn) closeStatsBtn.addEventListener('click', closeStatsScreen);

    // NEW: Leaderboard screen
    const lbBtn = document.getElementById('leaderboard-btn');
    const closeLbBtn = document.getElementById('close-leaderboard-btn');
    const clearScoresBtn = document.getElementById('clear-scores-btn');
    const refreshScoresBtn = document.getElementById('refresh-scores-btn');
    if (lbBtn) lbBtn.addEventListener('click', openLeaderboardScreen);
    if (closeLbBtn) closeLbBtn.addEventListener('click', closeLeaderboardScreen);
    if (clearScoresBtn) clearScoresBtn.addEventListener('click', clearAllScores);
    if (refreshScoresBtn) refreshScoresBtn.addEventListener('click', refreshLeaderboard);

    // NEW: Settings screen
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    if (settingsBtn) settingsBtn.addEventListener('click', openSettingsScreen);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettingsScreen);

    // PROFILE SYSTEM: Event listeners
    const createProfileBtn = document.getElementById('create-profile-btn');
    const newProfileInput = document.getElementById('new-profile-name');
    const switchProfileBtn = document.getElementById('switch-profile-btn');

    if (createProfileBtn) {
        createProfileBtn.addEventListener('click', () => {
            const name = newProfileInput.value;
            const profile = createProfile(name);
            if (profile) {
                audioEngine.playClick();
                newProfileInput.value = '';
                selectProfile(profile.id);
                hideProfileScreen();
                updateMenuDisplay();
                updateUpgradeShopUI();
            }
        });
    }

    if (newProfileInput) {
        newProfileInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                createProfileBtn.click();
            }
        });
    }

    if (switchProfileBtn) {
        switchProfileBtn.addEventListener('click', () => {
            audioEngine.playClick();
            showProfileScreen();
        });
    }

    // Load profiles first, then other data
    loadProfiles();
    loadAllData();

    // Show profile screen if no profile selected, otherwise show main menu
    if (!currentProfile || profiles.length === 0) {
        document.getElementById('profile-screen').classList.remove('hidden');
        document.getElementById('start-screen').classList.add('hidden');
        renderProfilesList();
    } else {
        document.getElementById('profile-screen').classList.add('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
        updateMenuDisplay();
        updateUpgradeShopUI();
    }

    generateDailyChallenge();

    requestAnimationFrame(gameLoop);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function loadProgress() {
    // Skip if a profile is already loaded (profile data takes precedence)
    if (currentProfile) return;

    try {
        const saved = localStorage.getItem('cosmicFuryProgress');
        if (saved) {
            const data = JSON.parse(saved);
            playerLevel = data.level || 1;
            totalXP = data.totalXP || 0;
            achievements = data.achievements || {};
            points = data.points || 0;
            upgrades = { ...upgrades, ...data.upgrades };
            selectedSkin = data.selectedSkin || 'default';
            purchasedSkins = data.purchasedSkins || ['default'];
        }
    } catch (e) { }
}

function saveProgress() {
    // Save progress to current profile
    if (currentProfile) {
        currentProfile.level = playerLevel;
        currentProfile.totalXP = totalXP;
        currentProfile.achievements = achievements;
        currentProfile.points = points;
        currentProfile.upgrades = upgrades;
        currentProfile.selectedSkin = selectedSkin;
        currentProfile.purchasedSkins = purchasedSkins;
        currentProfile.highScore = highScore;
        saveProfiles();
    }
}

function updateMenuDisplay() {
    document.getElementById('highscore-display').textContent = highScore.toLocaleString();
    document.getElementById('menu-player-level').textContent = playerLevel;
    document.getElementById('menu-points').textContent = points.toLocaleString();

    // Update current profile name display
    const profileNameEl = document.getElementById('current-profile-name');
    if (profileNameEl && currentProfile) {
        profileNameEl.textContent = currentProfile.name;
    }

    // Update prestige display
    const prestigeEl = document.getElementById('menu-prestige');
    if (prestigeEl) prestigeEl.textContent = prestigeLevel;
}

// Reset current profile's progress
function resetProgress() {
    // If no profile is selected, offer to reset all data
    if (!currentProfile) {
        if (confirm('⚠️ No profile selected!\n\nWould you like to reset ALL game data and start fresh?')) {
            localStorage.removeItem('cosmicFuryProfiles');
            localStorage.removeItem('cosmicFuryCurrentProfile');
            localStorage.removeItem('cosmicFuryProgress');
            localStorage.removeItem('cosmicFuryHighScore');
            localStorage.removeItem('cosmicFuryStats');
            localStorage.removeItem('cosmicFuryLeaderboard');
            alert('✅ All data has been reset!');
            location.reload();
        }
        return;
    }

    if (confirm(`⚠️ Are you sure you want to reset ${currentProfile.name}'s progress?\n\nThis will delete:\n• High Score\n• Pilot Level & XP\n• All Points\n• All Upgrades\n• All Purchased Skins\n• All Achievements\n\nThis cannot be undone!`)) {
        // Reset current profile
        currentProfile.highScore = 0;
        currentProfile.level = 1;
        currentProfile.totalXP = 0;
        currentProfile.points = 0;
        currentProfile.upgrades = {
            fireRate: 0, damage: 0, shield: 0, speed: 0, magnet: 0,
            luck: 0, critical: 0, armor: 0, xpBoost: 0, pointBoost: 0
        };
        currentProfile.achievements = {};
        currentProfile.selectedSkin = 'default';
        currentProfile.purchasedSkins = ['default'];

        // Apply to current game state
        highScore = 0;
        playerLevel = 1;
        totalXP = 0;
        playerXP = 0;
        points = 0;
        upgrades = { ...currentProfile.upgrades };
        achievements = {};
        selectedSkin = 'default';
        purchasedSkins = ['default'];

        saveProfiles();
        updateMenuDisplay();

        alert('✅ Progress reset successfully!\n\nYou are now starting fresh at Level 1.');
        location.reload();
    }
}

// ============================================
// PROFILE MANAGEMENT FUNCTIONS
// ============================================
function loadProfiles() {
    try {
        const saved = localStorage.getItem('cosmicFuryProfiles');
        if (saved) {
            profiles = JSON.parse(saved);
        } else {
            profiles = [];
        }

        // Load last selected profile ID and select it (which loads all game state)
        const lastProfileId = localStorage.getItem('cosmicFuryCurrentProfile');
        if (lastProfileId && profiles.length > 0) {
            const foundProfile = profiles.find(p => p.id === lastProfileId);
            if (foundProfile) {
                // Set currentProfile first, then load its data
                currentProfile = foundProfile;
                // Load profile data into game state
                playerLevel = foundProfile.level || 1;
                totalXP = foundProfile.totalXP || 0;
                achievements = foundProfile.achievements || {};
                points = foundProfile.points || 0;
                upgrades = {
                    fireRate: 0, damage: 0, shield: 0, speed: 0, magnet: 0,
                    luck: 0, critical: 0, armor: 0, xpBoost: 0, pointBoost: 0,
                    ...foundProfile.upgrades
                };
                selectedSkin = foundProfile.selectedSkin || 'default';
                purchasedSkins = foundProfile.purchasedSkins || ['default'];
                highScore = foundProfile.highScore || 0;
            } else {
                currentProfile = null;
            }
        } else {
            currentProfile = null;
        }
    } catch (e) {
        profiles = [];
        currentProfile = null;
    }
}

function saveProfiles() {
    localStorage.setItem('cosmicFuryProfiles', JSON.stringify(profiles));
    if (currentProfile) {
        localStorage.setItem('cosmicFuryCurrentProfile', currentProfile.id);
    }
}

function generateProfileId() {
    return 'profile_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function createProfile(name) {
    if (!name || name.trim().length === 0) {
        alert('Please enter a valid pilot name!');
        return null;
    }

    name = name.trim().toUpperCase();

    // Check for duplicate names
    if (profiles.some(p => p.name === name)) {
        alert('A pilot with this name already exists!');
        return null;
    }

    const newProfile = {
        id: generateProfileId(),
        name: name,
        highScore: 0,
        highestWave: 0,
        level: 1,
        totalXP: 0,
        points: 0,
        upgrades: {
            fireRate: 0, damage: 0, shield: 0, speed: 0, magnet: 0,
            luck: 0, critical: 0, armor: 0, xpBoost: 0, pointBoost: 0
        },
        selectedSkin: 'default',
        purchasedSkins: ['default'],
        achievements: {},
        createdAt: new Date().toISOString()
    };

    profiles.push(newProfile);
    saveProfiles();

    return newProfile;
}

function selectProfile(profileId) {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return false;

    currentProfile = profile;

    // Load profile data into game state
    playerLevel = profile.level || 1;
    totalXP = profile.totalXP || 0;
    achievements = profile.achievements || {};
    points = profile.points || 0;
    upgrades = {
        fireRate: 0, damage: 0, shield: 0, speed: 0, magnet: 0,
        luck: 0, critical: 0, armor: 0, xpBoost: 0, pointBoost: 0,
        ...profile.upgrades
    };
    selectedSkin = profile.selectedSkin || 'default';
    purchasedSkins = profile.purchasedSkins || ['default'];
    highScore = profile.highScore || 0;

    saveProfiles();

    return true;
}

function deleteProfile(profileId) {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return false;

    if (!confirm(`⚠️ Delete pilot "${profile.name}"?\n\nAll progress for this pilot will be lost forever!`)) {
        return false;
    }

    profiles = profiles.filter(p => p.id !== profileId);

    // If deleted profile was current, clear current
    if (currentProfile && currentProfile.id === profileId) {
        currentProfile = null;
        localStorage.removeItem('cosmicFuryCurrentProfile');
    }

    saveProfiles();
    return true;
}

function showProfileScreen() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('profile-screen').classList.remove('hidden');
    renderProfilesList();
}

function hideProfileScreen() {
    document.getElementById('profile-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
}

function renderProfilesList() {
    const container = document.getElementById('profiles-list');
    container.innerHTML = '';

    if (profiles.length === 0) {
        container.innerHTML = '<p class="no-profiles-text">No pilots yet. Create your first pilot below!</p>';
        return;
    }

    profiles.forEach(profile => {
        const isActive = currentProfile && currentProfile.id === profile.id;
        const profileEl = document.createElement('div');
        profileEl.className = `profile-card ${isActive ? 'active' : ''}`;
        profileEl.innerHTML = `
            <div class="profile-info">
                <span class="profile-card-name">${profile.name}</span>
                <span class="profile-card-stats">LVL ${profile.level || 1} | HIGH SCORE: ${(profile.highScore || 0).toLocaleString()}</span>
            </div>
            <div class="profile-actions">
                <button class="profile-select-btn" data-id="${profile.id}" ${isActive ? 'disabled' : ''}>
                    ${isActive ? '✓ ACTIVE' : 'SELECT'}
                </button>
                <button class="profile-delete-btn" data-id="${profile.id}" title="Delete">🗑️</button>
            </div>
        `;
        container.appendChild(profileEl);
    });

    // Add event listeners
    container.querySelectorAll('.profile-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (selectProfile(btn.dataset.id)) {
                audioEngine.playClick();
                hideProfileScreen();
                updateMenuDisplay();
                updateUpgradeShopUI();
            }
        });
    });

    container.querySelectorAll('.profile-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (deleteProfile(btn.dataset.id)) {
                audioEngine.playClick();
                renderProfilesList();

                // If no profiles left or current was deleted, stay on profile screen
                if (profiles.length === 0 || !currentProfile) {
                    showProfileScreen();
                }
            }
        });
    });
}

// ============================================
// SKIN SHOP SYSTEM
// ============================================
function openSkinShop() {
    audioEngine.init();
    audioEngine.playClick();
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('skin-screen').classList.remove('hidden');
    document.getElementById('skin-points').textContent = points.toLocaleString();
    updateSkinShopUI();
}

function closeSkinShop() {
    audioEngine.playClick();
    document.getElementById('skin-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
}

function selectSkin(skinId) {
    const skin = SKINS.find(s => s.id === skinId);
    if (!skin) return;

    const isOwned = purchasedSkins.includes(skinId);

    if (isOwned) {
        // Already owned - equip it
        selectedSkin = skinId;
        audioEngine.playClick();
    } else {
        // Need to purchase
        if (points < skin.cost) return; // Not enough points

        points -= skin.cost;
        purchasedSkins.push(skinId);
        selectedSkin = skinId;
        audioEngine.playPowerUp();
    }

    saveProgress();
    updateSkinShopUI();
    updateMenuDisplay();
}

function updateSkinShopUI() {
    const container = document.getElementById('skins-grid');
    container.innerHTML = '';

    // Update points display
    document.getElementById('skin-points').textContent = points.toLocaleString();

    SKINS.forEach(skin => {
        const isOwned = purchasedSkins.includes(skin.id);
        const isSelected = selectedSkin === skin.id;
        const canAfford = points >= skin.cost;
        const isPremium = skin.premium || false;
        const isRainbow = skin.rainbow || false;

        const skinEl = document.createElement('div');
        skinEl.className = `skin-item ${isOwned ? 'owned' : 'not-owned'} ${isSelected ? 'selected' : ''} ${!isOwned && canAfford ? 'can-afford' : ''} ${isPremium ? 'premium' : ''} ${isRainbow ? 'rainbow' : ''}`;
        skinEl.onclick = () => selectSkin(skin.id);

        let statusText;
        if (isOwned) {
            statusText = isSelected ? '✓ EQUIPPED' : 'CLICK TO EQUIP';
        } else {
            statusText = `⭐ ${skin.cost.toLocaleString()}`;
        }

        // Create canvas for ship preview
        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = 60;
        previewCanvas.height = 70;
        previewCanvas.className = 'skin-preview-canvas';

        // Render ship on canvas
        renderSkinPreview(previewCanvas, skin);

        skinEl.innerHTML = `
            <div class="skin-preview"></div>
            <div class="skin-info">
                <span class="skin-name">${skin.name}</span>
                <span class="skin-ability">${skin.abilityName || 'Balanced'}</span>
                <span class="skin-unlock ${isOwned ? 'owned-text' : (canAfford ? 'afford-text' : 'locked-text')}">${statusText}</span>
            </div>
        `;

        // Insert canvas into preview container
        skinEl.querySelector('.skin-preview').appendChild(previewCanvas);

        container.appendChild(skinEl);
    });

    // Start animation for rainbow skins
    startSkinPreviewAnimations();
}

// Render a ship preview that matches the gameplay ship
function renderSkinPreview(canvas, skin) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const shipWidth = 40;
    const shipHeight = 50;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);

    // Get colors (handle rainbow)
    let primaryColor = skin.primary;
    let glowColor = skin.glow;
    if (skin.rainbow) {
        const hue = (Date.now() / 20) % 360;
        primaryColor = `hsl(${hue}, 100%, 70%)`;
        glowColor = `hsl(${hue}, 100%, 60%)`;
    }

    // Outer glow
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, 2, 22, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, 0.05)`;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Engine flames
    const flameHeight = 15;
    const flameGradient = ctx.createLinearGradient(0, shipHeight / 2 - 5, 0, shipHeight / 2 + flameHeight);
    flameGradient.addColorStop(0, primaryColor);
    flameGradient.addColorStop(0.4, '#ffff00');
    flameGradient.addColorStop(0.8, '#ff6600');
    flameGradient.addColorStop(1, 'transparent');

    // Left flame
    ctx.beginPath();
    ctx.moveTo(-8, shipHeight / 2 - 5);
    ctx.quadraticCurveTo(-8, shipHeight / 2 + flameHeight * 0.5, -8, shipHeight / 2 + flameHeight);
    ctx.quadraticCurveTo(-8, shipHeight / 2 + flameHeight * 0.5, -4, shipHeight / 2 - 5);
    ctx.fillStyle = flameGradient;
    ctx.fill();

    // Right flame
    ctx.beginPath();
    ctx.moveTo(4, shipHeight / 2 - 5);
    ctx.quadraticCurveTo(8, shipHeight / 2 + flameHeight * 0.5, 8, shipHeight / 2 + flameHeight);
    ctx.quadraticCurveTo(8, shipHeight / 2 + flameHeight * 0.5, 12, shipHeight / 2 - 5);
    ctx.fill();

    // Main ship body
    ctx.beginPath();
    ctx.moveTo(0, -shipHeight / 2);                    // Nose
    ctx.lineTo(-6, -shipHeight / 4);                   // Left neck
    ctx.lineTo(-shipWidth / 2, shipHeight / 2.5);      // Left wing tip
    ctx.lineTo(-shipWidth / 4, shipHeight / 2 - 5);    // Left engine
    ctx.lineTo(-6, shipHeight / 3 - 3);                // Left body
    ctx.lineTo(0, shipHeight / 2.2 - 5);               // Bottom center
    ctx.lineTo(6, shipHeight / 3 - 3);                 // Right body
    ctx.lineTo(shipWidth / 4, shipHeight / 2 - 5);     // Right engine
    ctx.lineTo(shipWidth / 2, shipHeight / 2.5);       // Right wing tip
    ctx.lineTo(6, -shipHeight / 4);                    // Right neck
    ctx.closePath();

    // Metallic body gradient
    const bodyGradient = ctx.createLinearGradient(0, -shipHeight / 2, 0, shipHeight / 2);
    bodyGradient.addColorStop(0, shadeColor(primaryColor, 40));
    bodyGradient.addColorStop(0.3, primaryColor);
    bodyGradient.addColorStop(0.5, skin.secondary);
    bodyGradient.addColorStop(0.8, shadeColor(skin.secondary, -30));
    bodyGradient.addColorStop(1, shadeColor(skin.secondary, -50));
    ctx.fillStyle = bodyGradient;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 12;
    ctx.fill();

    // Ship outline
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Cockpit
    ctx.beginPath();
    ctx.ellipse(0, -5, 5, 12, 0, 0, Math.PI * 2);
    const cockpitGradient = ctx.createLinearGradient(-5, -17, 5, 7);
    cockpitGradient.addColorStop(0, 'rgba(150, 220, 255, 0.9)');
    cockpitGradient.addColorStop(0.3, 'rgba(100, 180, 255, 0.7)');
    cockpitGradient.addColorStop(0.7, 'rgba(50, 100, 200, 0.5)');
    cockpitGradient.addColorStop(1, 'rgba(20, 50, 100, 0.8)');
    ctx.fillStyle = cockpitGradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(200, 230, 255, 0.6)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Engine glow
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.ellipse(-8, shipHeight / 2 - 8, 2, 1.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = primaryColor;
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(8, shipHeight / 2 - 8, 2, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
}

// Animation loop for rainbow skin previews
let skinAnimationFrame = null;
function startSkinPreviewAnimations() {
    if (skinAnimationFrame) cancelAnimationFrame(skinAnimationFrame);

    function animateRainbowSkins() {
        const rainbowItems = document.querySelectorAll('.skin-item.rainbow');
        rainbowItems.forEach(item => {
            const canvas = item.querySelector('.skin-preview-canvas');
            if (canvas) {
                const skinId = 'ultimate'; // Rainbow is always Ultimate Nova
                const skin = SKINS.find(s => s.id === skinId);
                if (skin) renderSkinPreview(canvas, skin);
            }
        });

        if (document.getElementById('skin-screen') && !document.getElementById('skin-screen').classList.contains('hidden')) {
            skinAnimationFrame = requestAnimationFrame(animateRainbowSkins);
        }
    }

    animateRainbowSkins();
}

// ============================================
// UPGRADE SHOP SYSTEM
// ============================================
function openUpgradeShop() {
    audioEngine.init();
    audioEngine.playClick();
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('upgrade-screen').classList.remove('hidden');
    updateUpgradeShopUI();
}

function closeUpgradeShop() {
    audioEngine.playClick();
    document.getElementById('upgrade-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
}

function getUpgradeCost(type) {
    const config = UPGRADE_CONFIG[type];
    return Math.floor(config.cost * Math.pow(config.costMult, upgrades[type]));
}

function buyUpgrade(type) {
    const config = UPGRADE_CONFIG[type];
    const cost = getUpgradeCost(type);

    if (upgrades[type] >= config.maxLevel) return;
    if (points < cost) return;

    points -= cost;
    upgrades[type]++;

    audioEngine.playPowerUp();
    saveProgress();
    updateUpgradeShopUI();
    updateMenuDisplay();
}

function updateUpgradeShopUI() {
    document.getElementById('upgrade-points').textContent = points.toLocaleString();

    ['fireRate', 'damage', 'shield', 'speed', 'magnet', 'luck', 'critical', 'armor', 'xpBoost', 'pointBoost'].forEach(type => {
        const config = UPGRADE_CONFIG[type];
        const level = upgrades[type];
        const cost = getUpgradeCost(type);
        const maxed = level >= config.maxLevel;

        // Update level dots
        const dots = '●'.repeat(level) + '○'.repeat(config.maxLevel - level);
        document.getElementById(`level-${type}`).textContent = dots;

        // Update buy button
        const btn = document.getElementById(`buy-${type}`);
        btn.disabled = maxed || points < cost;
        btn.querySelector('.upgrade-cost').textContent = maxed ? 'MAX' : cost;

        // Update item style
        btn.closest('.upgrade-item').classList.toggle('maxed', maxed);
    });
}

// ============================================
// INPUT HANDLING
// ============================================

// Touch controls for mobile devices
function setupTouchControls() {
    const touchLeft = document.getElementById('touch-left');
    const touchRight = document.getElementById('touch-right');
    const touchFire = document.getElementById('touch-fire');
    const mobileControls = document.getElementById('mobile-controls');

    if (!touchLeft || !touchRight || !touchFire) return;

    // Helper to simulate key press
    function setKey(keyCode, pressed) {
        keys[keyCode] = pressed;
    }

    // Left button
    touchLeft.addEventListener('touchstart', (e) => {
        e.preventDefault();
        setKey('ArrowLeft', true);
        touchLeft.classList.add('active');
    });
    touchLeft.addEventListener('touchend', (e) => {
        e.preventDefault();
        setKey('ArrowLeft', false);
        touchLeft.classList.remove('active');
    });
    touchLeft.addEventListener('touchcancel', () => {
        setKey('ArrowLeft', false);
        touchLeft.classList.remove('active');
    });

    // Right button
    touchRight.addEventListener('touchstart', (e) => {
        e.preventDefault();
        setKey('ArrowRight', true);
        touchRight.classList.add('active');
    });
    touchRight.addEventListener('touchend', (e) => {
        e.preventDefault();
        setKey('ArrowRight', false);
        touchRight.classList.remove('active');
    });
    touchRight.addEventListener('touchcancel', () => {
        setKey('ArrowRight', false);
        touchRight.classList.remove('active');
    });

    // Fire button (hold to fire continuously)
    touchFire.addEventListener('touchstart', (e) => {
        e.preventDefault();
        setKey('Space', true);
        touchFire.classList.add('active');
    });
    touchFire.addEventListener('touchend', (e) => {
        e.preventDefault();
        setKey('Space', false);
        touchFire.classList.remove('active');
    });
    touchFire.addEventListener('touchcancel', () => {
        setKey('Space', false);
        touchFire.classList.remove('active');
    });

    // Show/hide mobile controls based on game state
    function updateMobileControlsVisibility() {
        if (mobileControls) {
            if (gameState === 'playing') {
                mobileControls.style.display = '';
            } else {
                mobileControls.style.display = 'none';
            }
        }
    }

    // Check periodically for game state changes
    setInterval(updateMobileControlsVisibility, 100);

    // Prevent default touch behavior on game canvas to avoid scrolling
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
        canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }
}

function handleKeyDown(e) {
    keys[e.code] = true;

    if (e.code === 'Escape' && (gameState === 'playing' || gameState === 'paused')) {
        togglePause();
    }

    // Ability keys
    if (gameState === 'playing') {
        if (e.code === 'Digit1') useAbility('bomb');
        if (e.code === 'Digit2') useAbility('slowmo');
        if (e.code === 'Digit3') useAbility('laser');
        if (e.code === 'Digit4') useUltimateAbility();

        // Weapon switching with Q key
        if (e.code === 'KeyQ') switchWeapon(1);
        if (e.code === 'KeyE') switchWeapon(-1);
    }

    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
    }
}

function handleKeyUp(e) {
    keys[e.code] = false;
}

function togglePause() {
    if (gameState === 'playing') {
        gameState = 'paused';
        document.getElementById('pause-screen').classList.remove('hidden');
        audioEngine.stopMusic();
    } else if (gameState === 'paused') {
        gameState = 'playing';
        document.getElementById('pause-screen').classList.add('hidden');
        lastTime = performance.now();
        audioEngine.startMusic();
    }
}

function toggleAudio() {
    audioEngine.init();
    const muted = audioEngine.toggleMute();
    document.getElementById('audio-icon').textContent = muted ? '🔇' : '🔊';
    document.getElementById('audio-toggle').classList.toggle('muted', muted);
    audioEngine.playClick();
}

function resumeGame() {
    audioEngine.playClick();
    gameState = 'playing';
    document.getElementById('pause-screen').classList.add('hidden');
    lastTime = performance.now();
    audioEngine.startMusic();
}

function restartFromPause() {
    audioEngine.playClick();
    document.getElementById('pause-screen').classList.add('hidden');
    startGame();
}

function goHome() {
    audioEngine.playClick();
    audioEngine.stopMusic();
    gameState = 'menu';

    // Clean up any lingering timers
    if (slowmoTimeoutId) { clearTimeout(slowmoTimeoutId); slowmoTimeoutId = null; }
    if (laserIntervalId) { clearInterval(laserIntervalId); laserIntervalId = null; }
    if (laserTimeoutId) { clearTimeout(laserTimeoutId); laserTimeoutId = null; }
    document.body.classList.remove('slowmo');
    gameSpeed = 1;
    slowmoActive = false;
    laserActive = false;
    document.querySelectorAll('.wave-announcement, .weapon-popup, .mega-laser').forEach(el => el.remove());

    // Save progress (sessionXP is already counted per-kill via addXP)
    saveProgress();

    // Hide game screens, show menu
    document.getElementById('pause-screen').classList.add('hidden');
    document.getElementById('gameover-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('weapon-indicator').classList.add('hidden');

    updateMenuDisplay();
}

// ============================================
// WAVE ANNOUNCEMENT
// ============================================
function showWaveAnnouncement(waveNum) {
    const popup = document.createElement('div');
    popup.className = 'wave-announcement';
    
    let waveText = `WAVE ${waveNum}`;
    let subText = '';
    
    if (waveNum % 5 === 0) {
        subText = '⚠️ BOSS INCOMING ⚠️';
    } else if (waveNum >= 8) {
        subText = 'NEW ENEMIES DETECTED';
    } else if (waveNum >= 5) {
        subText = 'DANGER INCREASING';
    }
    
    popup.innerHTML = `
        <div class="wave-announce-text">${waveText}</div>
        ${subText ? `<div class="wave-announce-sub">${subText}</div>` : ''}
    `;
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.5);
        color: #fff;
        text-align: center;
        font-family: 'Orbitron', sans-serif;
        z-index: 999;
        pointer-events: none;
        animation: waveAnnounce 2s ease forwards;
    `;
    document.getElementById('game-container').appendChild(popup);
    
    audioEngine.playLevelUp();
    
    setTimeout(() => popup.remove(), 2500);
}

// ============================================
// GAME CONTROL
// ============================================
function startGame() {
    audioEngine.init();
    audioEngine.playClick();
    audioEngine.startMusic();

    // --- Clean up any lingering timers from previous game ---
    if (slowmoTimeoutId) { clearTimeout(slowmoTimeoutId); slowmoTimeoutId = null; }
    if (laserIntervalId) { clearInterval(laserIntervalId); laserIntervalId = null; }
    if (laserTimeoutId) { clearTimeout(laserTimeoutId); laserTimeoutId = null; }
    document.body.classList.remove('slowmo');

    // Clean up orphaned DOM elements from previous game
    document.querySelectorAll('.wave-announcement, .weapon-popup, .mega-laser').forEach(el => el.remove());

    score = 0;
    wave = 1;
    enemiesDestroyed = 0;
    bullets = [];
    enemies = [];
    particles = [];
    powerUps = [];
    enemyBullets = [];
    activePowerUps = {};
    waveTimer = 0;

    comboCount = 0;
    comboMultiplier = 1;
    maxCombo = 0;
    sessionXP = 0;
    sessionPoints = 0;
    currentWeapon = 'laser'; // Reset weapon each game

    currentBoss = null;
    bossActive = false;
    slowmoActive = false;
    laserActive = false;
    ultimateActive = false;
    gameSpeed = 1;
    phoenixUsed = false; // Reset phoenix rebirth for new game
    lastRegenTime = 0;

    // Reset drones
    drones = [];
    initDrones();

    abilityCooldowns = { bomb: 0, slowmo: 0, laser: 0, ultimate: 0 };

    player = {
        x: canvas.width / 2,
        y: canvas.height - 100,
        width: CONFIG.player.width,
        height: CONFIG.player.height,
        health: getMaxHealth(),
        invincible: false,
        invincibleTimer: 0
    };

    playerXP = totalXP % CONFIG.progression.xpPerLevel;

    updateHUD();
    updateAbilitiesUI();
    updateWeaponIndicator();
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('gameover-screen').classList.add('hidden');
    document.getElementById('pause-screen').classList.add('hidden');
    document.getElementById('combo-container').classList.add('hidden');
    document.getElementById('boss-health-container').classList.add('hidden');
    document.getElementById('boss-warning').classList.add('hidden');

    // Show HUD elements for gameplay
    document.getElementById('hud').style.display = '';
    document.getElementById('abilities-bar').style.display = '';

    gameState = 'playing';
    lastTime = performance.now();
}

function gameOver() {
    gameState = 'gameover';
    audioEngine.stopMusic();
    audioEngine.playBigExplosion();

    // Clean up any lingering timers
    if (slowmoTimeoutId) { clearTimeout(slowmoTimeoutId); slowmoTimeoutId = null; }
    if (laserIntervalId) { clearInterval(laserIntervalId); laserIntervalId = null; }
    if (laserTimeoutId) { clearTimeout(laserTimeoutId); laserTimeoutId = null; }
    document.body.classList.remove('slowmo');
    gameSpeed = 1;
    slowmoActive = false;
    laserActive = false;
    document.querySelectorAll('.mega-laser').forEach(el => el.remove());

    const isNewHighScore = score > highScore;
    if (isNewHighScore) {
        highScore = score;
        localStorage.setItem('cosmicFuryHighScore', highScore);
    }

    // Save to leaderboard
    saveToLeaderboard('PILOT', score, wave);

    // Update statistics
    updateStats('gamesPlayed', 1);
    updateStats('totalKills', enemiesDestroyed);
    updateStats('totalScore', score);
    if (wave > gameStats.highestWave) {
        gameStats.highestWave = wave;
    }
    if (maxCombo > gameStats.highestCombo) {
        gameStats.highestCombo = maxCombo;
    }
    saveStats();

    // sessionXP is already counted per-kill via addXP, don't double-add
    saveProgress();

    document.getElementById('final-score').textContent = score.toLocaleString();
    document.getElementById('final-wave').textContent = wave;
    document.getElementById('final-enemies').textContent = enemiesDestroyed;
    document.getElementById('final-combo').textContent = maxCombo;
    document.getElementById('final-xp').textContent = sessionXP;
    document.getElementById('final-points').textContent = sessionPoints.toLocaleString();

    const newHighScoreEl = document.getElementById('new-highscore');
    newHighScoreEl.classList.toggle('hidden', !isNewHighScore);

    document.getElementById('gameover-screen').classList.remove('hidden');
    if (gameSettings.screenShake) {
        document.getElementById('game-container').classList.add('screen-shake');
        setTimeout(() => document.getElementById('game-container').classList.remove('screen-shake'), 300);
    }
}

// ============================================
// STARFIELD BACKGROUND
// ============================================
let stars = [];
let nebulaClouds = [];
let shootingStars = [];
let distantPlanets = [];

function initStarfield() {
    stars = [];
    // More stars with color variation
    for (let i = 0; i < 200; i++) {
        const colorType = Math.random();
        let color;
        if (colorType < 0.7) color = { r: 255, g: 255, b: 255 }; // White
        else if (colorType < 0.8) color = { r: 180, g: 200, b: 255 }; // Blue
        else if (colorType < 0.9) color = { r: 255, g: 200, b: 150 }; // Yellow/Orange
        else color = { r: 255, g: 150, b: 180 }; // Pink

        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2.5 + 0.5,
            speed: Math.random() * 2 + 0.5,
            brightness: Math.random() * 0.5 + 0.5,
            color: color,
            twinkleOffset: Math.random() * Math.PI * 2
        });
    }

    // Initialize nebula clouds
    initNebulaClouds();
    // Initialize distant planets
    initDistantPlanets();
}

function initNebulaClouds() {
    nebulaClouds = [];
    const cloudCount = 6;
    const colors = [
        { r: 100, g: 50, b: 150 },  // Purple
        { r: 50, g: 100, b: 150 },  // Blue
        { r: 150, g: 50, b: 100 },  // Pink
        { r: 50, g: 150, b: 120 },  // Teal
        { r: 150, g: 100, b: 50 }   // Orange
    ];

    for (let i = 0; i < cloudCount; i++) {
        nebulaClouds.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 200 + 150,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 0.2 + 0.1,
            driftX: (Math.random() - 0.5) * 0.3,
            pulseOffset: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.15 + 0.05
        });
    }
}

function initDistantPlanets() {
    distantPlanets = [];
    const planetCount = 2;
    const planetColors = ['#4a3b6b', '#3b4a6b', '#6b3b4a', '#4a6b3b'];

    for (let i = 0; i < planetCount; i++) {
        distantPlanets.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height * 0.5),
            size: Math.random() * 40 + 30,
            color: planetColors[Math.floor(Math.random() * planetColors.length)],
            speed: 0.1 + Math.random() * 0.1,
            hasRing: Math.random() > 0.5
        });
    }
}

function updateStarfield() {
    // Update stars
    stars.forEach(star => {
        star.y += star.speed * gameSpeed * 0.5;
        if (star.y > canvas.height) {
            star.y = -5;
            star.x = Math.random() * canvas.width;
        }
    });

    // Update nebula clouds
    nebulaClouds.forEach(cloud => {
        cloud.y += cloud.speed * gameSpeed;
        cloud.x += cloud.driftX * gameSpeed;
        if (cloud.y > canvas.height + cloud.size) {
            cloud.y = -cloud.size;
            cloud.x = Math.random() * canvas.width;
        }
        if (cloud.x < -cloud.size) cloud.x = canvas.width + cloud.size;
        if (cloud.x > canvas.width + cloud.size) cloud.x = -cloud.size;
    });

    // Update distant planets
    distantPlanets.forEach(planet => {
        planet.y += planet.speed * gameSpeed * 0.3;
        if (planet.y > canvas.height + planet.size) {
            planet.y = -planet.size * 2;
            planet.x = Math.random() * canvas.width;
        }
    });

    // Update shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= 0.02;
        if (ss.life <= 0 || ss.y > canvas.height || ss.x < 0 || ss.x > canvas.width) {
            shootingStars.splice(i, 1);
        }
    }

    // Randomly spawn shooting stars
    if (Math.random() < 0.003 && shootingStars.length < 3) {
        spawnShootingStar();
    }
}

function spawnShootingStar() {
    const startX = Math.random() * canvas.width;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
    shootingStars.push({
        x: startX,
        y: -10,
        vx: Math.cos(angle) * 8,
        vy: Math.sin(angle) * 8,
        life: 1,
        length: 30 + Math.random() * 20
    });
}

function renderNebulaClouds() {
    const time = Date.now() * 0.001;

    nebulaClouds.forEach(cloud => {
        const pulse = 1 + Math.sin(time * 0.5 + cloud.pulseOffset) * 0.2;
        const gradient = ctx.createRadialGradient(
            cloud.x, cloud.y, 0,
            cloud.x, cloud.y, cloud.size * pulse
        );
        gradient.addColorStop(0, `rgba(${cloud.color.r}, ${cloud.color.g}, ${cloud.color.b}, ${cloud.opacity})`);
        gradient.addColorStop(0.4, `rgba(${cloud.color.r}, ${cloud.color.g}, ${cloud.color.b}, ${cloud.opacity * 0.5})`);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    });
}

function renderDistantPlanets() {
    distantPlanets.forEach(planet => {
        ctx.save();
        ctx.globalAlpha = 0.3;

        // Planet body
        const gradient = ctx.createRadialGradient(
            planet.x - planet.size * 0.3, planet.y - planet.size * 0.3, 0,
            planet.x, planet.y, planet.size
        );
        gradient.addColorStop(0, shadeColor(planet.color, 30));
        gradient.addColorStop(0.5, planet.color);
        gradient.addColorStop(1, shadeColor(planet.color, -40));

        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Optional ring
        if (planet.hasRing) {
            ctx.beginPath();
            ctx.ellipse(planet.x, planet.y, planet.size * 1.8, planet.size * 0.3, 0.3, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(200, 200, 220, 0.3)`;
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        ctx.restore();
    });
}

function renderShootingStars() {
    shootingStars.forEach(ss => {
        ctx.save();
        ctx.globalAlpha = ss.life;

        // Trail
        const gradient = ctx.createLinearGradient(
            ss.x, ss.y,
            ss.x - ss.vx * 4, ss.y - ss.vy * 4
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, '#88ccff');
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 4, ss.y - ss.vy * 4);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#88ccff';
        ctx.shadowBlur = 10;
        ctx.fill();

        ctx.restore();
    });
}

function renderStarfield() {
    // Render nebula clouds first (furthest back)
    renderNebulaClouds();

    // Render distant planets
    renderDistantPlanets();

    // Render stars with color and enhanced twinkle
    const time = Date.now() * 0.001;
    stars.forEach(star => {
        const twinkle = 0.6 + Math.sin(time * 3 * star.speed + star.twinkleOffset) * 0.4;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * twinkle, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${star.brightness * twinkle})`;
        ctx.fill();

        // Add subtle glow to larger stars
        if (star.size > 1.5) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${star.brightness * twinkle * 0.2})`;
            ctx.fill();
        }
    });

    // Render shooting stars
    renderShootingStars();
}

// ============================================
// GAME LOOP
// ============================================
function gameLoop(timestamp) {
    deltaTime = (timestamp - lastTime) * gameSpeed;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Initialize starfield on first run
    if (stars.length === 0) initStarfield();

    // Update and render starfield
    updateStarfield();
    renderStarfield();

    if (gameState === 'playing') {
        update(timestamp);
        updateWeaponIndicator();
    }

    render();
    processAchievementQueue();

    requestAnimationFrame(gameLoop);
}

function update(timestamp) {
    updatePlayer(timestamp);
    updateBullets();
    updateEnemyBullets();
    updateEnemies(timestamp);
    updateDrones(timestamp); // NEW: Update drone companions
    updateParticles();
    updatePowerUps(timestamp);
    updateCombo(timestamp);
    updateAbilityCooldowns(timestamp);
    checkCollisions();

    if (bossActive && currentBoss) {
        updateBoss(timestamp);
    }

    waveTimer += deltaTime;
    if (waveTimer > 30000 && !bossActive) {
        wave++;
        waveTimer = 0;

        updateEnvironment(); // Change environment every 5 waves
        if (wave > gameStats.highestWave) gameStats.highestWave = wave;

        // Wave announcement
        showWaveAnnouncement(wave);

        if (wave % CONFIG.boss.waveInterval === 0) {
            spawnBoss();
        }

        checkAchievements();
        updateHUD();
    }
}

// ============================================
// PLAYER
// ============================================
let lastRegenTime = 0; // For health regeneration skins

function updatePlayer(timestamp) {
    const bonuses = getSkinBonuses();

    // Speed: base + level bonus + upgrade bonus (8% per level) + skin bonus
    let speed = CONFIG.player.speed * (1 + (playerLevel - 1) * 0.08 + upgrades.speed * 0.08);
    if (bonuses.speedBonus) speed *= (1 + bonuses.speedBonus);
    if (bonuses.speedPenalty) speed *= (1 + bonuses.speedPenalty); // Negative value reduces speed
    if (bonuses.allStats) speed *= (1 + bonuses.allStats);

    if (keys['ArrowLeft'] || keys['KeyA']) player.x -= speed;
    if (keys['ArrowRight'] || keys['KeyD']) player.x += speed;

    player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, player.x));

    // Fire rate: base - level bonus - upgrade bonus (8% per level) - skin bonus
    const weaponConfig = CONFIG.weapons[currentWeapon] || CONFIG.weapons.laser;
    let shootCooldown = weaponConfig.cooldown * (1 - (playerLevel - 1) * 0.05 - upgrades.fireRate * 0.08);
    if (bonuses.fireRateBonus) shootCooldown *= (1 - bonuses.fireRateBonus);
    if (bonuses.allStats) shootCooldown *= (1 - bonuses.allStats);
    if (activePowerUps.rapidFire) shootCooldown /= 3;
    shootCooldown = Math.max(40, shootCooldown); // Minimum cooldown

    const shouldFire = keys['Space'] || gameSettings.autoFire;
    if (shouldFire && timestamp - lastShot > shootCooldown) {
        shoot();
        lastShot = timestamp;
    }

    if (player.invincible) {
        player.invincibleTimer -= deltaTime;
        if (player.invincibleTimer <= 0) player.invincible = false;
    }

    // Health regeneration (Aurora skin)
    if (bonuses.healthRegen && timestamp - lastRegenTime > (bonuses.regenInterval || 3000)) {
        lastRegenTime = timestamp;
        const maxHP = getMaxHealth();
        if (player.health < maxHP) {
            player.health = Math.min(maxHP, player.health + bonuses.healthRegen);
            updateHUD();
            // Small heal particle
            particles.push({
                x: player.x, y: player.y,
                vx: 0, vy: -1,
                size: 10, color: '#00ff88',
                life: 0.5, maxLife: 0.5, type: 'heal'
            });
        }
    }

    if (Math.random() < 0.3) {
        createTrailParticle(player.x, player.y + player.height / 2);
    }
}

function shoot() {
    audioEngine.playShoot();
    const bonuses = getSkinBonuses();
    const weaponConfig = CONFIG.weapons[currentWeapon] || CONFIG.weapons.laser;

    // Damage: weapon base + level bonus + upgrade bonus + skin bonus
    let baseDamage = weaponConfig.damage + Math.floor((playerLevel - 1) * 0.15) + upgrades.damage;
    if (bonuses.damageBonus) baseDamage = Math.floor(baseDamage * (1 + bonuses.damageBonus));
    if (bonuses.allStats) baseDamage = Math.floor(baseDamage * (1 + bonuses.allStats));

    // Critical hit chance from upgrade (5% per level)
    const critChance = upgrades.critical * 0.05;
    const isCrit = Math.random() < critChance;
    if (isCrit) baseDamage *= 2;

    const bulletConfig = {
        x: player.x,
        y: player.y - player.height / 2,
        width: weaponConfig.width,
        height: weaponConfig.height,
        speed: weaponConfig.speed,
        damage: baseDamage,
        isCrit: isCrit,
        color: weaponConfig.color,
        homing: weaponConfig.homing || false,
        piercing: weaponConfig.piercing || (bonuses.piercingBullets || false),
        explosive: weaponConfig.explosive || false,
        // Skin special effects
        burnDamage: bonuses.burnDamage || false,
        chainAttack: bonuses.chainAttack || false,
        explosionOnKill: bonuses.explosionOnKill || false,
        freezeChance: bonuses.freezeChance || 0,
        poisonCloud: bonuses.poisonCloud || false
    };

    // Weapon spread (e.g. Plasma Spreader)
    const projectiles = weaponConfig.projectiles || 1;
    const spread = weaponConfig.spread || 0;

    if (activePowerUps.multiShot) {
        // Multishot power-up adds extra shots
        for (let i = -1; i <= 1; i++) {
            for (let p = 0; p < projectiles; p++) {
                const spreadAngle = (p - (projectiles - 1) / 2) * spread;
                bullets.push({ ...bulletConfig, x: player.x + i * 15, angle: i * 0.1 + spreadAngle });
            }
        }
    } else {
        for (let p = 0; p < projectiles; p++) {
            const spreadAngle = (p - (projectiles - 1) / 2) * spread;
            bullets.push({ ...bulletConfig, angle: spreadAngle });
        }
    }

    createMuzzleFlash(player.x, player.y - player.height / 2);
}

function createMuzzleFlash(x, y) {
    for (let i = 0; i < 5; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 3,
            vy: -Math.random() * 3 - 2,
            size: Math.random() * 4 + 2,
            color: CONFIG.bullet.color,
            life: 0.3, maxLife: 0.3, type: 'flash'
        });
    }
}

function createTrailParticle(x, y) {
    particles.push({
        x: x + (Math.random() - 0.5) * 10, y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 2 + 1,
        size: Math.random() * 6 + 3,
        color: '#00f5ff',
        life: 0.5, maxLife: 0.5, type: 'trail'
    });
}

// ============================================
// BULLETS
// ============================================
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        // Homing behavior (missiles)
        if (bullet.homing && enemies.length > 0) {
            const nearest = enemies.reduce((best, e) => {
                const dist = Math.hypot(e.x - bullet.x, e.y - bullet.y);
                return dist < best.dist ? { enemy: e, dist } : best;
            }, { dist: Infinity }).enemy;
            if (nearest) {
                const targetAngle = Math.atan2(nearest.y - bullet.y, nearest.x - bullet.x) + Math.PI / 2;
                const currentAngle = bullet.angle || 0;
                const diff = targetAngle - currentAngle;
                bullet.angle = currentAngle + Math.sign(diff) * Math.min(Math.abs(diff), 0.08);
            }
        }

        bullet.y -= bullet.speed * Math.cos(bullet.angle || 0);
        bullet.x += bullet.speed * Math.sin(bullet.angle || 0);
        if (bullet.y < -bullet.height || bullet.y > canvas.height || bullet.x < -50 || bullet.x > canvas.width + 50) {
            bullets.splice(i, 1);
        }
    }
}

function updateEnemyBullets() {
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const b = enemyBullets[i];
        b.x += b.vx;
        b.y += b.vy;
        if (b.y > canvas.height || b.x < 0 || b.x > canvas.width) {
            enemyBullets.splice(i, 1);
        }
    }
}

// ============================================
// ENEMIES
// ============================================
function updateEnemies(timestamp) {
    if (!bossActive) {
        const spawnRate = Math.max(500, CONFIG.enemy.spawnRate - wave * 100);
        if (timestamp - lastEnemySpawn > spawnRate) {
            spawnEnemy();
            lastEnemySpawn = timestamp;
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.y += enemy.speed * gameSpeed;

        if (enemy.type === 'zigzag') {
            enemy.x += Math.sin(enemy.y * 0.05) * 3;
        } else if (enemy.type === 'teleporter') {
            enemy.x += Math.sin(enemy.y * 0.02 + enemy.offset) * 0.5;
            // Teleport randomly
            if (Math.random() < 0.003) {
                const oldX = enemy.x;
                const oldY = enemy.y;
                enemy.x = Math.random() * (canvas.width - 100) + 50;
                createTeleportEffect(oldX, oldY, enemy.color);
                createTeleportEffect(enemy.x, enemy.y, enemy.color);
            }
        } else {
            enemy.x += Math.sin(enemy.y * 0.02 + enemy.offset) * 0.5;
        }

        if (enemy.shoots && Math.random() < 0.005) {
            shootAtPlayer(enemy);
        }

        if (enemy.y > canvas.height + enemy.height) {
            enemies.splice(i, 1);
        }
    }
}

function spawnEnemy() {
    const types = Object.keys(CONFIG.enemy.types);
    let typeKey = 'basic';

    const rand = Math.random();
    // New enemy types at higher waves
    if (wave >= 8 && rand < 0.06) typeKey = 'splitter';
    else if (wave >= 7 && rand < 0.10) typeKey = 'teleporter';
    else if (wave >= 6 && rand < 0.14) typeKey = 'shielded';
    else if (wave >= 5 && rand < 0.16) typeKey = 'elite';
    else if (wave >= 4 && rand < 0.20) typeKey = 'bomber';
    else if (wave >= 3 && rand < 0.25) typeKey = 'sniper';
    else if (wave >= 2 && rand < 0.30) typeKey = 'zigzag';
    else if (wave >= 2 && rand < 0.35) typeKey = 'tank';
    else if (wave >= 1 && rand < 0.45) typeKey = 'fast';

    if (wave >= 3 && Math.random() < 0.15) {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => spawnSingleEnemy('swarm'), i * 150);
        }
        return;
    }

    spawnSingleEnemy(typeKey);
}

function spawnSingleEnemy(typeKey) {
    const type = CONFIG.enemy.types[typeKey];
    if (!type) return; // Safety check
    const speedMult = type.speedMult || 1;
    // Scale health with wave
    const waveHealthScale = 1 + wave * CONFIG.enemy.healthScale;
    const scaledHealth = Math.ceil(type.health * waveHealthScale);

    enemies.push({
        x: Math.random() * (canvas.width - type.width * 2) + type.width,
        y: -type.height,
        width: type.width,
        height: type.height,
        health: scaledHealth,
        maxHealth: scaledHealth,
        points: type.points,
        color: type.color,
        speed: (CONFIG.enemy.baseSpeed + wave * 0.35) * speedMult,
        offset: Math.random() * Math.PI * 2,
        type: typeKey,
        xp: type.xp,
        shoots: type.shoots,
        explodes: type.explodes,
        splits: type.splits || false,
        teleports: type.teleports || false,
        shield: type.shield || 0,
        shieldColor: type.shieldColor || null,
        elite: type.elite || false
    });
}

function shootAtPlayer(enemy) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    enemyBullets.push({
        x: enemy.x,
        y: enemy.y,
        vx: (dx / dist) * 5,
        vy: (dy / dist) * 5,
        width: 8,
        height: 8,
        color: '#ff6600'
    });
}

// ============================================
// BOSS SYSTEM
// ============================================
function spawnBoss() {
    bossActive = true;

    document.getElementById('boss-warning').classList.remove('hidden');
    audioEngine.playBossWarning();

    setTimeout(() => {
        // Guard: don't spawn boss if game is no longer playing
        if (gameState !== 'playing') return;
        document.getElementById('boss-warning').classList.add('hidden');

        const bossHealth = CONFIG.boss.baseHealth + (wave / 5) * CONFIG.boss.healthPerWave;

        // Different boss types based on wave
        const bossTypes = [
            { name: 'DESTROYER', color: '#ff00ff' },
            { name: 'OVERLORD', color: '#ff6600' },
            { name: 'NIGHTMARE', color: '#9900ff' },
            { name: 'ANNIHILATOR', color: '#ff0044' },
            { name: 'EXTINCTION', color: '#00ffff' }
        ];
        const bossType = bossTypes[Math.floor((wave / 5 - 1) % bossTypes.length)];

        currentBoss = {
            x: canvas.width / 2,
            y: -CONFIG.boss.height,
            width: CONFIG.boss.width,
            height: CONFIG.boss.height,
            health: bossHealth,
            maxHealth: bossHealth,
            speed: CONFIG.boss.speed,
            phase: 0,
            attackTimer: 0,
            moveDir: 1,
            points: CONFIG.boss.points * (wave / 5),
            xp: CONFIG.boss.xp * (wave / 5),
            color: bossType.color
        };

        document.getElementById('boss-health-container').classList.remove('hidden');
        document.getElementById('boss-name').textContent = `${bossType.name} - WAVE ${wave}`;
    }, 1500);
}

function updateBoss(timestamp) {
    if (!currentBoss) return;

    const healthRatio = currentBoss.health / currentBoss.maxHealth;

    if (currentBoss.y < 100) {
        currentBoss.y += currentBoss.speed;
    } else {
        // Boss tracks the player more aggressively at low health
        const trackingStrength = healthRatio < 0.3 ? 3.5 : (healthRatio < 0.6 ? 2.0 : 1.0);
        const dx = player.x - currentBoss.x;
        if (Math.abs(dx) > 5) {
            currentBoss.x += Math.sign(dx) * trackingStrength;
        }
        // Also bounce at walls
        currentBoss.x = Math.max(80, Math.min(canvas.width - 80, currentBoss.x));

        // Boss attacks faster in rage mode (below 30% HP)
        const attackInterval = healthRatio < 0.3 ? 500 : (healthRatio < 0.6 ? 700 : 900);
        currentBoss.attackTimer += deltaTime;
        if (currentBoss.attackTimer > attackInterval) {
            bossAttack();
            currentBoss.attackTimer = 0;
        }
    }

    const healthPercent = healthRatio * 100;
    document.getElementById('boss-health-fill').style.width = `${healthPercent}%`;
}

function bossAttack() {
    // More varied attack patterns based on boss health phase
    const healthPercent = currentBoss.health / currentBoss.maxHealth;
    const pattern = Math.floor(Math.random() * 5);

    if (pattern === 0) {
        // Spread shot - 5 bullets in a fan
        for (let i = -2; i <= 2; i++) {
            enemyBullets.push({
                x: currentBoss.x,
                y: currentBoss.y + currentBoss.height / 2,
                vx: i * 1.2,
                vy: 3.5,
                width: 10,
                height: 10,
                color: '#ff00ff'
            });
        }
    } else if (pattern === 1) {
        // Targeted shot at player
        shootAtPlayer(currentBoss);
    } else if (pattern === 2) {
        // Spiral pattern - slower, easier to dodge
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI / 2) * i + (currentBoss.attackTimer * 0.001);
            enemyBullets.push({
                x: currentBoss.x,
                y: currentBoss.y,
                vx: Math.cos(angle) * 2.5,
                vy: Math.sin(angle) * 2.5 + 2,
                width: 8,
                height: 8,
                color: '#ff66ff'
            });
        }
    } else if (pattern === 3 && healthPercent < 0.5) {
        // Ring attack - only when boss is below 50% health
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            enemyBullets.push({
                x: currentBoss.x,
                y: currentBoss.y,
                vx: Math.cos(angle) * 2,
                vy: Math.sin(angle) * 2 + 1.5,
                width: 8,
                height: 8,
                color: '#ff0066'
            });
        }
    } else {
        // Spawn a weak minion
        spawnSingleEnemy('swarm');
    }
}

function defeatBoss() {
    // Epic explosion effect - staggered for dramatic effect
    createExplosion(currentBoss.x, currentBoss.y, currentBoss.color, 50);
    setTimeout(() => createExplosion(currentBoss.x - 40, currentBoss.y - 20, '#ffffff', 25), 100);
    setTimeout(() => createExplosion(currentBoss.x + 40, currentBoss.y + 20, '#ffffff', 25), 200);
    setTimeout(() => createExplosion(currentBoss.x, currentBoss.y + 30, '#ffaa00', 30), 300);
    audioEngine.playBigExplosion();

    // Rewards
    score += currentBoss.points;
    addXP(currentBoss.xp);
    addPoints(500 * (wave / 5)); // Bonus points for boss kill!

    // Track boss defeats in stats
    updateStats('bossesDefeated', 1);

    // Heal player 30% on boss defeat
    const healAmount = getMaxHealth() * 0.3;
    player.health = Math.min(getMaxHealth(), player.health + healAmount);

    // Show boss defeated text
    particles.push({
        x: currentBoss.x, y: currentBoss.y - 50,
        vx: 0, vy: -1.5,
        size: 22, color: '#ffcc00',
        life: 2, maxLife: 2, type: 'text', text: '💀 BOSS DEFEATED!'
    });

    // Spawn power-ups as rewards
    for (let i = 0; i < 3; i++) {
        const types = Object.keys(CONFIG.powerUp.types);
        const typeKey = types[Math.floor(Math.random() * types.length)];
        const type = CONFIG.powerUp.types[typeKey];
        powerUps.push({
            x: currentBoss.x + (Math.random() - 0.5) * 100,
            y: currentBoss.y,
            width: 30, height: 30, speed: 1.5,
            color: type.color, symbol: type.symbol, type: typeKey, angle: 0
        });
    }

    // Clear enemy bullets as reward
    enemyBullets = [];

    achievements.bossKilled = true;
    checkAchievements();

    currentBoss = null;
    bossActive = false;
    document.getElementById('boss-health-container').classList.add('hidden');

    updateHUD();
}

// ============================================
// COMBO SYSTEM
// ============================================
function updateCombo(timestamp) {
    if (comboCount > 0 && timestamp - lastKillTime > CONFIG.combo.timeout) {
        if (comboCount > 5) audioEngine.playComboBreak();
        comboCount = 0;
        comboMultiplier = 1;
        document.getElementById('combo-container').classList.add('hidden');
    }
}

function addToCombo() {
    comboCount++;
    comboMultiplier = Math.min(1 + Math.floor(comboCount / 5), CONFIG.combo.maxMultiplier);
    lastKillTime = performance.now();

    if (comboCount > maxCombo) maxCombo = comboCount;

    document.getElementById('combo-container').classList.remove('hidden');
    document.getElementById('combo-value').textContent = `x${comboMultiplier}`;

    if (comboCount > 1) audioEngine.playCombo(comboMultiplier);

    checkAchievements();
}

// ============================================
// PROGRESSION SYSTEM
// ============================================
function addXP(amount) {
    const xpGain = amount * comboMultiplier;
    playerXP += xpGain;
    sessionXP += xpGain;

    while (playerXP >= CONFIG.progression.xpPerLevel && playerLevel < CONFIG.progression.maxLevel) {
        playerXP -= CONFIG.progression.xpPerLevel;
        playerLevel++;
        levelUp();
    }

    updateXPBar();
}

function addPoints(amount) {
    points += amount;
    sessionPoints += amount;
    // Debounce save to avoid excessive localStorage writes
    if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(() => {
        saveProgress();
        saveDebounceTimer = null;
    }, 1000);
}

function levelUp() {
    audioEngine.playLevelUp();

    document.getElementById('levelup-popup').classList.remove('hidden');
    document.getElementById('levelup-level').textContent = `Level ${playerLevel}`;

    setTimeout(() => {
        document.getElementById('levelup-popup').classList.add('hidden');
    }, 1500);

    updateAbilitiesUI();
    saveProgress();
}

function updateXPBar() {
    const xpPercent = (playerXP / CONFIG.progression.xpPerLevel) * 100;
    document.getElementById('xp-fill').style.width = `${xpPercent}%`;
    document.getElementById('player-level').textContent = playerLevel;
}

// ============================================
// SPECIAL ABILITIES
// ============================================
function useAbility(type) {
    const config = CONFIG.abilities[type];
    if (playerLevel < config.unlockLevel) return;
    if (abilityCooldowns[type] > 0) return;

    audioEngine.playAbility();
    abilityCooldowns[type] = config.cooldown;

    if (type === 'bomb') {
        enemies.forEach(e => createExplosion(e.x, e.y, e.color));
        const xpGain = enemies.reduce((sum, e) => sum + e.xp, 0);
        const scoreGain = enemies.reduce((sum, e) => sum + e.points, 0);
        score += scoreGain;
        addPoints(Math.floor(scoreGain * 0.1)); // Add upgrade points
        addXP(xpGain);
        enemiesDestroyed += enemies.length; // Count kills
        enemies = [];
        audioEngine.playBigExplosion();
        updateHUD();
    } else if (type === 'slowmo') {
        slowmoActive = true;
        gameSpeed = 0.5;
        document.body.classList.add('slowmo');
        slowmoTimeoutId = setTimeout(() => {
            slowmoActive = false;
            gameSpeed = 1;
            document.body.classList.remove('slowmo');
            slowmoTimeoutId = null;
        }, config.duration);
    } else if (type === 'laser') {
        laserActive = true;
        const laserEl = document.createElement('div');
        laserEl.className = 'mega-laser';
        laserEl.style.left = `${player.x}px`;
        document.getElementById('game-container').appendChild(laserEl);

        laserIntervalId = setInterval(() => {
            if (!laserActive || gameState !== 'playing') {
                clearInterval(laserIntervalId);
                laserIntervalId = null;
                return;
            }
            laserEl.style.left = `${player.x}px`;
            enemies = enemies.filter(e => {
                if (Math.abs(e.x - player.x) < 30) {
                    createExplosion(e.x, e.y, e.color);
                    audioEngine.playExplosion();
                    score += e.points;
                    addPoints(Math.floor(e.points * 0.1)); // Add upgrade points
                    addXP(e.xp);
                    addToCombo();
                    enemiesDestroyed++;
                    updateHUD();
                    return false;
                }
                return true;
            });
        }, 50);

        laserTimeoutId = setTimeout(() => {
            laserActive = false;
            laserEl.remove();
            if (laserIntervalId) { clearInterval(laserIntervalId); laserIntervalId = null; }
            laserTimeoutId = null;
        }, config.duration);
    }

    updateAbilitiesUI();
}

function updateAbilityCooldowns(timestamp) {
    for (const type in abilityCooldowns) {
        if (abilityCooldowns[type] > 0) {
            abilityCooldowns[type] -= deltaTime;
        }
    }
}

function updateAbilitiesUI() {
    ['bomb', 'slowmo', 'laser'].forEach(type => {
        const config = CONFIG.abilities[type];
        const slot = document.getElementById(`ability-${type}`);
        const locked = document.getElementById(`locked-${type}`);
        const cooldown = document.getElementById(`cooldown-${type}`);

        if (playerLevel >= config.unlockLevel) {
            locked.classList.add('hidden');
            slot.classList.toggle('ready', abilityCooldowns[type] <= 0);

            if (abilityCooldowns[type] > 0) {
                cooldown.classList.add('active');
                cooldown.textContent = Math.ceil(abilityCooldowns[type] / 1000);
            } else {
                cooldown.classList.remove('active');
            }
        } else {
            locked.classList.remove('hidden');
        }
    });
}

// ============================================
// ACHIEVEMENTS
// ============================================
function checkAchievements() {
    for (const id in ACHIEVEMENTS) {
        if (!achievements[id] && ACHIEVEMENTS[id].check()) {
            achievements[id] = true;
            addXP(ACHIEVEMENTS[id].xp);
            achievementQueue.push(ACHIEVEMENTS[id]);
            saveProgress();
        }
    }
}

function processAchievementQueue() {
    if (achievementQueue.length === 0) return;
    if (!document.getElementById('achievement-popup').classList.contains('hidden')) return;

    const achievement = achievementQueue.shift();
    document.getElementById('achievement-name').textContent = achievement.name;
    document.getElementById('achievement-popup').classList.remove('hidden');

    audioEngine.playAchievement();

    setTimeout(() => {
        document.getElementById('achievement-popup').classList.add('hidden');
    }, 3000);
}

// ============================================
// POWER-UPS
// ============================================
function spawnPowerUp(x, y) {
    // Luck upgrade: +3% drop chance per level
    const dropChance = CONFIG.powerUp.spawnChance + upgrades.luck * 0.03;
    if (Math.random() > dropChance) return;

    const types = Object.keys(CONFIG.powerUp.types);
    const typeKey = types[Math.floor(Math.random() * types.length)];
    const type = CONFIG.powerUp.types[typeKey];

    powerUps.push({
        x, y, width: 30, height: 30, speed: 2,
        color: type.color, symbol: type.symbol, type: typeKey, angle: 0
    });
}

function updatePowerUps(timestamp) {
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const pu = powerUps[i];
        pu.y += pu.speed;
        pu.angle += 0.05;

        // Magnet upgrade: attract power-ups toward player
        const bonuses = getSkinBonuses();
        const skinMagnetBonus = bonuses.magnetBonus || 0;
        if (upgrades.magnet > 0 || skinMagnetBonus > 0) {
            let magnetRange = 100 + upgrades.magnet * 15; // 115-250 range
            magnetRange *= (1 + skinMagnetBonus); // Apply skin bonus (e.g., Nebula +50%)
            const dx = player.x - pu.x;
            const dy = player.y - pu.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < magnetRange && dist > 0) {
                const magnetStrength = (1 - dist / magnetRange) * (0.5 + upgrades.magnet * 0.2 + skinMagnetBonus);
                pu.x += (dx / dist) * magnetStrength * 5;
                pu.y += (dy / dist) * magnetStrength * 5;
            }
        }

        if (pu.y > canvas.height + pu.height) {
            powerUps.splice(i, 1);
            continue;
        }

        if (checkOverlap(player, pu)) {
            activatePowerUp(pu.type, timestamp);
            powerUps.splice(i, 1);

            for (let j = 0; j < 10; j++) {
                particles.push({
                    x: pu.x, y: pu.y,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5,
                    size: Math.random() * 6 + 2,
                    color: pu.color,
                    life: 0.5, maxLife: 0.5, type: 'pickup'
                });
            }
        }
    }

    for (const type in activePowerUps) {
        if (timestamp > activePowerUps[type]) {
            delete activePowerUps[type];
        }
    }
}

function activatePowerUp(type, timestamp) {
    audioEngine.playPowerUp();

    if (type === 'heal') {
        // Instant heal - doesn't add to active power-ups
        const maxHealth = getMaxHealth();
        const healAmount = 40 + upgrades.shield * 5; // Bonus heal from shield upgrade
        player.health = Math.min(maxHealth, player.health + healAmount);

        // Healing particles effect - more visible
        for (let i = 0; i < 20; i++) {
            particles.push({
                x: player.x + (Math.random() - 0.5) * 60,
                y: player.y + (Math.random() - 0.5) * 60,
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 4 - 2,
                size: Math.random() * 8 + 6,
                color: '#ff6b6b',
                life: 1.2,
                maxLife: 1.2,
                type: 'heal'
            });
        }
        updateHUD();
        return;
    }

    activePowerUps[type] = timestamp + CONFIG.powerUp.duration;

    if (type === 'shield') {
        player.health = Math.min(getMaxHealth(), player.health + 30);
        updateHUD();
    }
}

// ============================================
// PARTICLES
// ============================================
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= deltaTime / 1000;

        // Different physics per particle type
        if (p.type === 'explosion') {
            p.vy += 0.15;
            p.vx *= 0.98;
        } else if (p.type === 'ember') {
            p.vy -= 0.05; // Float upward
            p.vx += (Math.random() - 0.5) * 0.2;
        } else if (p.type === 'smoke') {
            p.vy -= 0.3;
            p.size += 0.5;
        } else if (p.type === 'ripple') {
            p.size += 3; // Expand ripple
        }

        if (p.life <= 0 || p.x < -100 || p.x > canvas.width + 100 || p.y < -100 || p.y > canvas.height + 100) {
            particles.splice(i, 1);
        }
    }
}

function createExplosion(x, y, color, count = CONFIG.particles.explosionCount) {
    // Main explosion particles
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        const speed = Math.random() * 6 + 3;
        particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 10 + 5,
            color,
            life: Math.random() * 0.6 + 0.4,
            maxLife: 1, type: 'explosion'
        });
    }

    // Star-shaped sparks
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;
        particles.push({
            x, y,
            vx: Math.cos(angle) * 10,
            vy: Math.sin(angle) * 10,
            size: 3, color: '#ffffff',
            life: 0.25, maxLife: 0.25, type: 'star_spark'
        });
    }

    // Rising embers
    for (let i = 0; i < 5; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 2 - 1,
            size: Math.random() * 4 + 2,
            color: shadeColor(color, 50),
            life: Math.random() * 1 + 0.5,
            maxLife: 1.5, type: 'ember'
        });
    }

    // Smoke cloud
    for (let i = 0; i < 3; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 15,
            y: y + (Math.random() - 0.5) * 15,
            vx: (Math.random() - 0.5) * 1,
            vy: -Math.random() * 0.5,
            size: Math.random() * 15 + 10,
            color: '#333333',
            life: Math.random() * 0.8 + 0.3,
            maxLife: 1.1, type: 'smoke'
        });
    }

    // Impact ripple
    particles.push({
        x, y,
        vx: 0, vy: 0,
        size: 5,
        color: color,
        life: 0.4, maxLife: 0.4, type: 'ripple'
    });
}

function createImpactRipple(x, y, color) {
    particles.push({
        x, y,
        vx: 0, vy: 0,
        size: 3,
        color: color,
        life: 0.3, maxLife: 0.3, type: 'ripple'
    });

    // Small sparks on impact
    for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        particles.push({
            x, y,
            vx: Math.cos(angle) * 3,
            vy: Math.sin(angle) * 3,
            size: 2, color: '#ffffff',
            life: 0.15, maxLife: 0.15, type: 'spark'
        });
    }
}

// ============================================
// COLLISIONS
// ============================================
function checkCollisions() {
    // Bullets vs Enemies
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        // Check boss
        if (currentBoss && checkOverlap(bullet, currentBoss)) {
            bullets.splice(i, 1);
            currentBoss.health -= bullet.damage || 1;
            createExplosion(bullet.x, bullet.y, '#fff', 5);

            if (currentBoss.health <= 0) defeatBoss();
            continue;
        }

        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];

            if (checkOverlap(bullet, enemy)) {
                // Shielded enemies absorb hits with their shield first
                if (enemy.shield && enemy.shield > 0) {
                    enemy.shield -= bullet.damage || 1;
                    if (!bullet.piercing) bullets.splice(i, 1);
                    // Shield hit effect
                    createImpactRipple(bullet.x, bullet.y, enemy.shieldColor || '#00ccff');
                    if (enemy.shield <= 0) {
                        enemy.shield = 0;
                        // Shield break effect
                        for (let k = 0; k < 8; k++) {
                            particles.push({
                                x: enemy.x, y: enemy.y,
                                vx: (Math.random() - 0.5) * 6,
                                vy: (Math.random() - 0.5) * 6,
                                size: Math.random() * 5 + 3,
                                color: '#00ccff',
                                life: 0.5, maxLife: 0.5, type: 'explosion'
                            });
                        }
                        particles.push({
                            x: enemy.x, y: enemy.y - 20,
                            vx: 0, vy: -1.5,
                            size: 12, color: '#00ccff',
                            life: 0.8, maxLife: 0.8, type: 'text', text: 'SHIELD BREAK!'
                        });
                    }
                    if (!bullet.piercing) break;
                    continue;
                }

                // Don't remove bullet if piercing
                if (!bullet.piercing) {
                    bullets.splice(i, 1);
                }

                // Explosive bullets do AoE
                if (bullet.explosive) {
                    createExplosion(bullet.x, bullet.y, bullet.color || '#ff6600', 12);
                    enemies.forEach(e => {
                        if (e !== enemy && Math.hypot(e.x - bullet.x, e.y - bullet.y) < 60) {
                            e.health -= Math.ceil(bullet.damage * 0.4);
                        }
                    });
                }

                enemy.health -= bullet.damage || 1;

                // Floating damage numbers
                if (gameSettings.showDamageNumbers) {
                    const dmg = bullet.damage || 1;
                    particles.push({
                        x: enemy.x + (Math.random() - 0.5) * 20,
                        y: enemy.y - enemy.height / 2 - 5,
                        vx: (Math.random() - 0.5) * 1.5,
                        vy: -2 - Math.random(),
                        size: bullet.isCrit ? 16 : 11,
                        color: bullet.isCrit ? '#ffff00' : '#ffffff',
                        life: 0.6, maxLife: 0.6,
                        type: 'text',
                        text: bullet.isCrit ? `${dmg}!` : `${dmg}`
                    });
                }

                // Freeze effect (slow enemy)
                if (bullet.freezeChance && Math.random() < bullet.freezeChance) {
                    enemy.speed *= 0.5;
                    enemy.frozen = true;
                    // Ice particle effect
                    for (let k = 0; k < 5; k++) {
                        particles.push({
                            x: enemy.x, y: enemy.y,
                            vx: (Math.random() - 0.5) * 3,
                            vy: (Math.random() - 0.5) * 3,
                            size: Math.random() * 6 + 3,
                            color: '#88ddff',
                            life: 0.5, maxLife: 0.5, type: 'freeze'
                        });
                    }
                }

                // Critical hit visual (only if damage numbers are off, otherwise it's shown in the number)
                if (bullet.isCrit && !gameSettings.showDamageNumbers) {
                    particles.push({
                        x: enemy.x, y: enemy.y - 20,
                        vx: 0, vy: -1,
                        size: 14, color: '#ffff00',
                        life: 0.6, maxLife: 0.6, type: 'text', text: 'CRIT!'
                    });
                }

                createExplosion(bullet.x, bullet.y, '#fff', 5);

                if (enemy.health <= 0) {
                    createExplosion(enemy.x, enemy.y, enemy.color);
                    audioEngine.playExplosion();

                    // Handle splitter death - spawn mini enemies
                    if (enemy.splits) {
                        handleSplitterDeath(enemy);
                    }

                    // Explosion on kill (Solar Flare skin)
                    if (bullet.explosionOnKill) {
                        createExplosion(enemy.x, enemy.y, '#ffaa00', 25);
                        // Damage nearby enemies
                        enemies.forEach(e => {
                            if (e !== enemy && Math.abs(e.x - enemy.x) < 100 && Math.abs(e.y - enemy.y) < 100) {
                                e.health -= 2;
                            }
                        });
                    }

                    // Chain attack (Plasma Core skin)
                    if (bullet.chainAttack) {
                        const nearbyEnemy = enemies.find(e =>
                            e !== enemy &&
                            Math.abs(e.x - enemy.x) < 120 &&
                            Math.abs(e.y - enemy.y) < 120
                        );
                        if (nearbyEnemy) {
                            nearbyEnemy.health -= Math.ceil(bullet.damage * 0.5);
                            // Chain lightning visual
                            particles.push({
                                x: enemy.x, y: enemy.y,
                                vx: (nearbyEnemy.x - enemy.x) * 0.1,
                                vy: (nearbyEnemy.y - enemy.y) * 0.1,
                                size: 4, color: '#ff00ff',
                                life: 0.3, maxLife: 0.3, type: 'chain'
                            });
                        }
                    }

                    // Poison cloud (Venomous skin)
                    if (bullet.poisonCloud) {
                        // Create lingering poison for 2 seconds
                        for (let p = 0; p < 10; p++) {
                            particles.push({
                                x: enemy.x + (Math.random() - 0.5) * 40,
                                y: enemy.y + (Math.random() - 0.5) * 40,
                                vx: (Math.random() - 0.5) * 1,
                                vy: (Math.random() - 0.5) * 1,
                                size: Math.random() * 15 + 10,
                                color: 'rgba(0, 255, 68, 0.4)',
                                life: 2, maxLife: 2, type: 'poison',
                                poisonX: enemy.x, poisonY: enemy.y
                            });
                        }
                    }

                    // Vampiric healing (Blood Moon skin)
                    const bonuses = getSkinBonuses();
                    if (bonuses.vampiric) {
                        const healAmount = Math.floor(getMaxHealth() * bonuses.vampiric);
                        player.health = Math.min(getMaxHealth(), player.health + healAmount);
                        // Heal particle
                        particles.push({
                            x: player.x, y: player.y - 20,
                            vx: 0, vy: -1,
                            size: 12, color: '#ff4444',
                            life: 0.5, maxLife: 0.5, type: 'text', text: `+${healAmount}`
                        });
                    }

                    if (enemy.explodes) {
                        enemies.forEach(e => {
                            if (e !== enemy && Math.abs(e.x - enemy.x) < 80 && Math.abs(e.y - enemy.y) < 80) {
                                e.health -= 2;
                            }
                        });
                    }

                    // Point boost from skin and upgrade
                    let pointMult = 1;
                    if (bonuses.pointsBonus) pointMult += bonuses.pointsBonus;
                    pointMult += upgrades.pointBoost * 0.08; // 8% per level

                    // XP boost from upgrade
                    const xpMult = 1 + upgrades.xpBoost * 0.10; // 10% per level

                    const earnedScore = Math.floor(enemy.points * comboMultiplier * pointMult);
                    score += earnedScore;
                    const earnedPoints = Math.floor(earnedScore * 0.1);
                    addPoints(earnedPoints); // 10% of score as points
                    addXP(Math.floor(enemy.xp * xpMult));
                    addToCombo();
                    enemiesDestroyed++;

                    spawnPowerUp(enemy.x, enemy.y);
                    enemies.splice(j, 1);

                    checkAchievements();
                    updateHUD();
                }
                if (!bullet.piercing) break;
            }
        }
    }

    // Enemy bullets vs Player
    if (!player.invincible && !activePowerUps.shield) {
        const bonuses = getSkinBonuses();
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            if (checkOverlap(player, enemyBullets[i])) {
                // Diamond skin: chance to reflect bullet
                if (bonuses.reflectChance && Math.random() < bonuses.reflectChance) {
                    const b = enemyBullets[i];
                    // Reflect: turn into a player bullet aimed upward
                    bullets.push({
                        x: b.x, y: b.y,
                        width: b.width, height: b.height,
                        speed: 10, damage: 2,
                        color: '#b2ebf2', angle: 0,
                        piercing: false, homing: false, explosive: false
                    });
                    enemyBullets.splice(i, 1);
                    // Reflect particle effect
                    particles.push({
                        x: b.x, y: b.y,
                        vx: 0, vy: -2,
                        size: 14, color: '#b2ebf2',
                        life: 0.6, maxLife: 0.6, type: 'text', text: 'REFLECT!'
                    });
                    createImpactRipple(b.x, b.y, '#b2ebf2');
                    audioEngine.playClick();
                    continue;
                }
                enemyBullets.splice(i, 1);
                damagePlayer(15);
            }
        }
    }

    // Enemies vs Player
    if (!player.invincible && !activePowerUps.shield) {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            if (checkOverlap(player, enemy)) {
                damagePlayer(25);
                createExplosion(enemy.x, enemy.y, enemy.color);
                audioEngine.playExplosion();
                enemies.splice(i, 1);
            }
        }
    }
}

function damagePlayer(amount) {
    const bonuses = getSkinBonuses();

    // Dodge chance from skin
    const dodgeChance = (bonuses.dodgeChance || 0);
    if (Math.random() < dodgeChance) {
        // Dodged! Show dodge text
        particles.push({
            x: player.x, y: player.y - 30,
            vx: 0, vy: -2,
            size: 16, color: '#88ffff',
            life: 0.8, maxLife: 0.8, type: 'text', text: 'DODGE!'
        });
        audioEngine.playClick();
        return;
    }

    // Armor reduction from upgrade (5% per level)
    let damage = amount * (1 - upgrades.armor * 0.05);

    // Reduce damage with allStats bonus
    if (bonuses.allStats) damage *= (1 - bonuses.allStats * 0.5);

    player.health -= Math.floor(damage);
    player.invincible = true;
    player.invincibleTimer = CONFIG.player.invincibilityTime;

    audioEngine.playHit();

    if (gameSettings.screenShake) {
        document.getElementById('game-container').classList.add('screen-shake');
        setTimeout(() => document.getElementById('game-container').classList.remove('screen-shake'), 300);
    }

    updateHUD();

    if (player.health <= 0) {
        // Check for phoenix rebirth
        if (bonuses.rebirth && !phoenixUsed) {
            phoenixUsed = true;
            player.health = Math.floor(getMaxHealth() * (bonuses.rebirthHealth || 0.5));
            player.invincible = true;
            player.invincibleTimer = 3000; // 3 seconds invincibility

            // Phoenix effect
            createExplosion(player.x, player.y, '#ff6600', 40);
            particles.push({
                x: player.x, y: player.y - 40,
                vx: 0, vy: -2,
                size: 20, color: '#ff6600',
                life: 1.5, maxLife: 1.5, type: 'text', text: '🔥 REBIRTH!'
            });
            audioEngine.playLevelUp();
            updateHUD();
            return;
        }

        createExplosion(player.x, player.y, '#00f5ff', 30);
        gameOver();
    }
}

function checkOverlap(a, b) {
    return Math.abs(a.x - b.x) < (a.width + b.width) / 2 &&
        Math.abs(a.y - b.y) < (a.height + b.height) / 2;
}

// ============================================
// RENDERING
// ============================================
function render() {
    renderParticles();

    if (gameState === 'playing' || gameState === 'paused') {
        renderPowerUps();
        renderEnemies();
        renderBullets();
        renderEnemyBullets();
        if (currentBoss) renderBoss();
        renderDrones(); // NEW: Render drone companions
        renderPlayer();
    }
}

function renderPlayer() {
    if (!player) return;

    // Get current skin
    const skin = SKINS.find(s => s.id === selectedSkin) || SKINS[0];
    const time = Date.now() * 0.001;

    ctx.save();
    ctx.translate(player.x, player.y);

    // Invincibility flicker
    if (player.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
        ctx.globalAlpha = 0.5;
    }

    // Rainbow effect for Ultimate Nova skin
    let primaryColor = skin.primary;
    let glowColor = skin.glow;
    if (skin.rainbow) {
        const hue = (Date.now() / 20) % 360;
        primaryColor = `hsl(${hue}, 100%, 70%)`;
        glowColor = `hsl(${hue}, 100%, 60%)`;
    }

    // === OUTER GLOW AURA ===
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 30 + Math.sin(time * 5) * 10;
    ctx.beginPath();
    ctx.arc(0, 5, 35, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${hexToRgb(glowColor)}, 0.1)`;
    ctx.fill();
    ctx.shadowBlur = 0;

    // === ENGINE FLAMES (Animated) ===
    const flameHeight = 25 + Math.sin(time * 20) * 8;
    const flameWidth = 8 + Math.sin(time * 15) * 3;

    // Left engine flame
    const flameGradientL = ctx.createLinearGradient(-12, player.height / 2, -12, player.height / 2 + flameHeight);
    flameGradientL.addColorStop(0, primaryColor);
    flameGradientL.addColorStop(0.3, '#ffff00');
    flameGradientL.addColorStop(0.7, '#ff6600');
    flameGradientL.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.moveTo(-12 - flameWidth / 2, player.height / 2);
    ctx.quadraticCurveTo(-12, player.height / 2 + flameHeight * 0.7, -12, player.height / 2 + flameHeight);
    ctx.quadraticCurveTo(-12, player.height / 2 + flameHeight * 0.7, -12 + flameWidth / 2, player.height / 2);
    ctx.fillStyle = flameGradientL;
    ctx.fill();

    // Right engine flame
    const flameGradientR = ctx.createLinearGradient(12, player.height / 2, 12, player.height / 2 + flameHeight);
    flameGradientR.addColorStop(0, primaryColor);
    flameGradientR.addColorStop(0.3, '#ffff00');
    flameGradientR.addColorStop(0.7, '#ff6600');
    flameGradientR.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.moveTo(12 - flameWidth / 2, player.height / 2);
    ctx.quadraticCurveTo(12, player.height / 2 + flameHeight * 0.7, 12, player.height / 2 + flameHeight);
    ctx.quadraticCurveTo(12, player.height / 2 + flameHeight * 0.7, 12 + flameWidth / 2, player.height / 2);
    ctx.fillStyle = flameGradientR;
    ctx.fill();

    // === SHIELD EFFECT ===
    if (activePowerUps.shield) {
        ctx.beginPath();
        ctx.arc(0, 0, player.width * 0.9, 0, Math.PI * 2);
        const shieldGradient = ctx.createRadialGradient(0, 0, player.width * 0.5, 0, 0, player.width * 0.9);
        shieldGradient.addColorStop(0, 'rgba(0, 255, 136, 0)');
        shieldGradient.addColorStop(0.7, 'rgba(0, 255, 136, 0.1)');
        shieldGradient.addColorStop(1, 'rgba(0, 255, 200, 0.4)');
        ctx.fillStyle = shieldGradient;
        ctx.fill();
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    // === MAIN SHIP BODY ===
    ctx.beginPath();
    // Fuselage
    ctx.moveTo(0, -player.height / 2);              // Nose
    ctx.lineTo(-8, -player.height / 4);             // Left neck
    ctx.lineTo(-player.width / 2, player.height / 2.5); // Left wing tip
    ctx.lineTo(-player.width / 4, player.height / 2);   // Left engine
    ctx.lineTo(-8, player.height / 3);              // Left body
    ctx.lineTo(0, player.height / 2.2);             // Bottom center
    ctx.lineTo(8, player.height / 3);               // Right body
    ctx.lineTo(player.width / 4, player.height / 2);    // Right engine
    ctx.lineTo(player.width / 2, player.height / 2.5);  // Right wing tip
    ctx.lineTo(8, -player.height / 4);              // Right neck
    ctx.closePath();

    // Metallic body gradient
    const bodyGradient = ctx.createLinearGradient(0, -player.height / 2, 0, player.height / 2);
    bodyGradient.addColorStop(0, shadeColor(primaryColor, 40));
    bodyGradient.addColorStop(0.3, primaryColor);
    bodyGradient.addColorStop(0.5, skin.secondary);
    bodyGradient.addColorStop(0.8, shadeColor(skin.secondary, -30));
    bodyGradient.addColorStop(1, shadeColor(skin.secondary, -50));
    ctx.fillStyle = bodyGradient;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 25;
    ctx.fill();

    // Ship outline glow
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // === WING DETAILS ===
    // Left wing stripe
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(-player.width / 2 + 5, player.height / 2.5 - 5);
    ctx.strokeStyle = `rgba(255, 255, 255, 0.3)`;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Right wing stripe
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(player.width / 2 - 5, player.height / 2.5 - 5);
    ctx.stroke();

    // === COCKPIT ===
    ctx.beginPath();
    ctx.ellipse(0, -8, 7, 18, 0, 0, Math.PI * 2);
    const cockpitGradient = ctx.createLinearGradient(-7, -26, 7, 10);
    cockpitGradient.addColorStop(0, 'rgba(150, 220, 255, 0.9)');
    cockpitGradient.addColorStop(0.3, 'rgba(100, 180, 255, 0.7)');
    cockpitGradient.addColorStop(0.7, 'rgba(50, 100, 200, 0.5)');
    cockpitGradient.addColorStop(1, 'rgba(20, 50, 100, 0.8)');
    ctx.fillStyle = cockpitGradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(200, 230, 255, 0.8)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Cockpit reflection
    ctx.beginPath();
    ctx.ellipse(-2, -15, 3, 8, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fill();

    // === ENGINE PORTS ===
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.ellipse(-12, player.height / 2 - 3, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(12, player.height / 2 - 3, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Engine glow
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(-12, player.height / 2 - 3, 3, 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = primaryColor;
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(12, player.height / 2 - 3, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    if (typeof hex !== 'string' || !hex.startsWith('#')) {
        return '255, 255, 255'; // Safe fallback for HSL, rgb, etc.
    }
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
    }
    return '255, 255, 255';
}

function renderBullets() {
    const skin = SKINS.find(s => s.id === selectedSkin) || SKINS[0];

    bullets.forEach(bullet => {
        ctx.save();
        ctx.translate(bullet.x, bullet.y);

        // Get bullet color based on skin
        let bulletColor = skin.primary;
        if (skin.rainbow) {
            const hue = (Date.now() / 20) % 360;
            bulletColor = `hsl(${hue}, 100%, 70%)`;
        }

        // Energy trail
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(0, bullet.height / 2 + 15);
        ctx.lineTo(-bullet.width / 2, bullet.height / 2);
        ctx.lineTo(bullet.width / 2, bullet.height / 2);
        ctx.closePath();
        const trailGradient = ctx.createLinearGradient(0, bullet.height / 2, 0, bullet.height / 2 + 15);
        trailGradient.addColorStop(0, bulletColor);
        trailGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = trailGradient;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Critical hit glow
        if (bullet.isCrit) {
            ctx.shadowColor = '#ffff00';
            ctx.shadowBlur = 20;
        } else {
            ctx.shadowColor = bulletColor;
            ctx.shadowBlur = 12;
        }

        // Main bullet body
        const gradient = ctx.createLinearGradient(0, -bullet.height / 2, 0, bullet.height / 2);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, bulletColor);
        gradient.addColorStop(0.7, shadeColor(bulletColor.startsWith('#') ? bulletColor : skin.primary, -20));
        gradient.addColorStop(1, '#222');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        // Elongated bullet shape
        ctx.moveTo(0, -bullet.height / 2 - 3);
        ctx.quadraticCurveTo(bullet.width / 2 + 1, -bullet.height / 4, bullet.width / 2, 0);
        ctx.quadraticCurveTo(bullet.width / 2 + 1, bullet.height / 4, 0, bullet.height / 2);
        ctx.quadraticCurveTo(-bullet.width / 2 - 1, bullet.height / 4, -bullet.width / 2, 0);
        ctx.quadraticCurveTo(-bullet.width / 2 - 1, -bullet.height / 4, 0, -bullet.height / 2 - 3);
        ctx.fill();

        // Core glow
        ctx.beginPath();
        ctx.ellipse(0, -2, 1.5, bullet.height / 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        ctx.restore();
    });
}

function renderEnemyBullets() {
    enemyBullets.forEach(b => {
        ctx.save();
        ctx.translate(b.x, b.y);

        ctx.shadowColor = b.color;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.arc(0, 0, b.width / 2, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();

        ctx.restore();
    });
}

function renderEnemies() {
    const time = Date.now() * 0.001;

    enemies.forEach(enemy => {
        ctx.save();
        ctx.translate(enemy.x, enemy.y);

        // === ENGINE EXHAUST TRAIL ===
        if (enemy.type !== 'swarm') {
            const exhaustHeight = 10 + Math.sin(time * 15 + enemy.x) * 4;
            const exhaustGradient = ctx.createLinearGradient(0, -enemy.height / 2, 0, -enemy.height / 2 - exhaustHeight);
            exhaustGradient.addColorStop(0, enemy.color);
            exhaustGradient.addColorStop(0.4, shadeColor(enemy.color, -30));
            exhaustGradient.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.moveTo(-enemy.width * 0.15, -enemy.height / 2);
            ctx.lineTo(0, -enemy.height / 2 - exhaustHeight);
            ctx.lineTo(enemy.width * 0.15, -enemy.height / 2);
            ctx.fillStyle = exhaustGradient;
            ctx.fill();
        }

        // Swarm enemies have a pulsing glow
        if (enemy.type === 'swarm') {
            const pulse = 0.7 + Math.sin(time * 10 + enemy.x * 0.1) * 0.3;
            ctx.globalAlpha = pulse;
        }

        // Freeze effect (ice overlay)
        if (enemy.frozen) {
            ctx.globalAlpha = 0.7;
        }

        // Elite enemy special glow
        if (enemy.elite) {
            ctx.shadowColor = '#ff00aa';
            ctx.shadowBlur = 25 + Math.sin(time * 8) * 10;
        } else {
            ctx.shadowColor = enemy.color;
            ctx.shadowBlur = 15;
        }

        // Draw enemy shape based on type
        if (enemy.type === 'basic') {
            // Diamond shape with inner detail
            ctx.beginPath();
            ctx.moveTo(0, -enemy.height / 2);
            ctx.lineTo(enemy.width / 2, 0);
            ctx.lineTo(0, enemy.height / 2);
            ctx.lineTo(-enemy.width / 2, 0);
            ctx.closePath();
        } else if (enemy.type === 'fast') {
            // Arrow/dart shape
            ctx.beginPath();
            ctx.moveTo(0, enemy.height / 2);
            ctx.lineTo(-enemy.width / 2, -enemy.height / 2);
            ctx.lineTo(0, -enemy.height / 4);
            ctx.lineTo(enemy.width / 2, -enemy.height / 2);
            ctx.closePath();
        } else if (enemy.type === 'sniper' || enemy.type === 'elite') {
            // Elongated triangle with targeting
            ctx.beginPath();
            ctx.moveTo(0, enemy.height / 2);
            ctx.lineTo(-enemy.width / 2, -enemy.height / 2);
            ctx.lineTo(-enemy.width / 4, -enemy.height / 3);
            ctx.lineTo(enemy.width / 4, -enemy.height / 3);
            ctx.lineTo(enemy.width / 2, -enemy.height / 2);
            ctx.closePath();
        } else if (enemy.type === 'tank') {
            // Hexagon with armor plates
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 2;
                const x = Math.cos(angle) * enemy.width / 2;
                const y = Math.sin(angle) * enemy.height / 2;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
        } else if (enemy.type === 'bomber') {
            // Hexagon with danger marking
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 2;
                const x = Math.cos(angle) * enemy.width / 2;
                const y = Math.sin(angle) * enemy.height / 2;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
        } else if (enemy.type === 'zigzag') {
            ctx.beginPath();
            ctx.moveTo(0, -enemy.height / 2);
            ctx.lineTo(enemy.width / 2, 0);
            ctx.lineTo(0, enemy.height / 2);
            ctx.lineTo(-enemy.width / 2, 0);
            ctx.closePath();
        } else if (enemy.type === 'shielded') {
            // Pentagon shape
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                const x = Math.cos(angle) * enemy.width / 2;
                const y = Math.sin(angle) * enemy.height / 2;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
        } else if (enemy.type === 'teleporter') {
            // Star shape
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i - Math.PI / 2;
                const r = i % 2 === 0 ? enemy.width / 2 : enemy.width / 4;
                const x = Math.cos(angle) * r;
                const y = Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
        } else if (enemy.type === 'splitter') {
            // Double triangle
            ctx.beginPath();
            ctx.moveTo(0, -enemy.height / 2);
            ctx.lineTo(enemy.width / 2, enemy.height / 4);
            ctx.lineTo(0, 0);
            ctx.lineTo(-enemy.width / 2, enemy.height / 4);
            ctx.closePath();
            ctx.moveTo(0, enemy.height / 2);
        } else if (enemy.type === 'swarm') {
            ctx.beginPath();
            ctx.arc(0, 0, enemy.width / 2, 0, Math.PI * 2);
        }

        // Metallic gradient fill
        const gradient = ctx.createRadialGradient(-3, -3, 0, 0, 0, enemy.width / 2);
        gradient.addColorStop(0, shadeColor(enemy.color, 50));
        gradient.addColorStop(0.4, enemy.color);
        gradient.addColorStop(1, shadeColor(enemy.color, -60));
        ctx.fillStyle = gradient;
        ctx.fill();

        // Outline
        ctx.strokeStyle = shadeColor(enemy.color, 30);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // === ENEMY EYES/CORE ===
        const eyeSize = Math.min(enemy.width, enemy.height) * 0.15;

        // Glowing red core/eye
        ctx.beginPath();
        ctx.arc(0, -enemy.height * 0.1, eyeSize, 0, Math.PI * 2);
        const eyeGradient = ctx.createRadialGradient(0, -enemy.height * 0.1, 0, 0, -enemy.height * 0.1, eyeSize);
        eyeGradient.addColorStop(0, '#ffffff');
        eyeGradient.addColorStop(0.3, '#ff4444');
        eyeGradient.addColorStop(1, '#880000');
        ctx.fillStyle = eyeGradient;
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Bomber warning symbol
        if (enemy.type === 'bomber') {
            ctx.font = `bold ${enemy.width * 0.3}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffff00';
            ctx.fillText('!', 0, enemy.height * 0.15);
        }

        // Sniper/Elite targeting laser hint
        if ((enemy.type === 'sniper' || enemy.type === 'elite') && Math.random() < 0.3) {
            ctx.beginPath();
            ctx.moveTo(0, enemy.height / 2);
            ctx.lineTo(0, enemy.height / 2 + 30);
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Freeze effect ice crystals
        if (enemy.frozen) {
            ctx.strokeStyle = '#88ddff';
            ctx.lineWidth = 2;
            for (let i = 0; i < 4; i++) {
                const angle = (Math.PI / 2) * i + Math.PI / 4;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(angle) * enemy.width * 0.4, Math.sin(angle) * enemy.height * 0.4);
                ctx.stroke();
            }
        }

        // Shield visual for shielded enemies
        if (enemy.shield && enemy.shield > 0) {
            ctx.beginPath();
            ctx.arc(0, 0, enemy.width * 0.7, 0, Math.PI * 2);
            ctx.strokeStyle = enemy.shieldColor || '#00ccff';
            ctx.lineWidth = 2;
            ctx.shadowColor = enemy.shieldColor || '#00ccff';
            ctx.shadowBlur = 12;
            ctx.globalAlpha = 0.5 + Math.sin(time * 8) * 0.2;
            ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }

        // Health bar for heavy enemies
        if ((enemy.type === 'tank' || enemy.type === 'bomber' || enemy.type === 'elite' || enemy.type === 'shielded' || enemy.type === 'splitter') && enemy.health < enemy.maxHealth) {
            const barWidth = enemy.width * 0.8;
            const barHeight = 5;
            const barY = -enemy.height / 2 - 12;

            // Background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.beginPath();
            ctx.roundRect(-barWidth / 2 - 1, barY - 1, barWidth + 2, barHeight + 2, 2);
            ctx.fill();

            // Health fill
            const healthGradient = ctx.createLinearGradient(-barWidth / 2, 0, barWidth / 2, 0);
            healthGradient.addColorStop(0, '#ff4444');
            healthGradient.addColorStop(0.5, enemy.color);
            healthGradient.addColorStop(1, '#ff4444');
            ctx.fillStyle = healthGradient;
            ctx.beginPath();
            ctx.roundRect(-barWidth / 2, barY, barWidth * (enemy.health / enemy.maxHealth), barHeight, 2);
            ctx.fill();
        }

        ctx.restore();
    });
}

function renderBoss() {
    if (!currentBoss) return;

    const time = Date.now() * 0.001;
    const healthPercent = currentBoss.health / currentBoss.maxHealth;

    ctx.save();
    ctx.translate(currentBoss.x, currentBoss.y);

    // === PHASE-BASED COLOR SHIFT ===
    // Boss changes color as health decreases
    let bossColor = currentBoss.color;
    if (healthPercent < 0.25) {
        // Rage mode - intense red/orange
        bossColor = `hsl(${Math.sin(time * 8) * 20 + 10}, 100%, 50%)`;
    } else if (healthPercent < 0.5) {
        // Warning - pulsing toward red
        const hueShift = Math.sin(time * 4) * 10;
        bossColor = shadeColor(currentBoss.color, -20 + hueShift);
    }

    // === CHARGING ENERGY EFFECT ===
    // Shows when boss is about to attack
    if (currentBoss.attackTimer > 600) {
        const chargeIntensity = (currentBoss.attackTimer - 600) / 300;
        const chargeRadius = 30 + chargeIntensity * 50;

        // Energy gathering particles
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i + time * 3;
            const dist = chargeRadius * (1 - chargeIntensity * 0.3);
            ctx.beginPath();
            ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist + 20, 4 + chargeIntensity * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 100, 200, ${chargeIntensity * 0.8})`;
            ctx.shadowColor = '#ff00ff';
            ctx.shadowBlur = 15;
            ctx.fill();
        }
        ctx.shadowBlur = 0;
    }

    // === ROTATING DEFENSE SATELLITES ===
    if (healthPercent < 0.75) {
        const satCount = healthPercent < 0.5 ? 3 : 2;
        for (let i = 0; i < satCount; i++) {
            const satAngle = (Math.PI * 2 / satCount) * i + time * 2;
            const satDist = currentBoss.width * 0.8;
            const satX = Math.cos(satAngle) * satDist;
            const satY = Math.sin(satAngle) * satDist * 0.5;

            ctx.beginPath();
            ctx.arc(satX, satY, 8, 0, Math.PI * 2);
            const satGradient = ctx.createRadialGradient(satX, satY, 0, satX, satY, 8);
            satGradient.addColorStop(0, '#ffffff');
            satGradient.addColorStop(0.5, bossColor);
            satGradient.addColorStop(1, shadeColor(bossColor, -40));
            ctx.fillStyle = satGradient;
            ctx.shadowColor = bossColor;
            ctx.shadowBlur = 10;
            ctx.fill();
        }
        ctx.shadowBlur = 0;
    }

    // === PULSING AURA ===
    const auraIntensity = 1 + (1 - healthPercent) * 0.5; // More intense when damaged
    const auraSize = (80 + Math.sin(time * 4) * 20) * auraIntensity;
    const auraGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, auraSize);
    auraGradient.addColorStop(0, 'rgba(255, 0, 100, 0)');
    auraGradient.addColorStop(0.6, `rgba(255, 0, 100, ${0.05 * auraIntensity})`);
    auraGradient.addColorStop(1, `rgba(255, 0, 100, ${0.2 * auraIntensity})`);
    ctx.beginPath();
    ctx.arc(0, 0, auraSize, 0, Math.PI * 2);
    ctx.fillStyle = auraGradient;
    ctx.fill();

    // === ENERGY WINGS ===
    ctx.globalAlpha = 0.4 + Math.sin(time * 6) * 0.2;
    ctx.beginPath();
    ctx.moveTo(-currentBoss.width / 2, 0);
    ctx.quadraticCurveTo(-currentBoss.width - 30, -20, -currentBoss.width - 20, currentBoss.height / 4);
    ctx.quadraticCurveTo(-currentBoss.width / 2, currentBoss.height / 3, -currentBoss.width / 2, 0);
    ctx.fillStyle = currentBoss.color;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(currentBoss.width / 2, 0);
    ctx.quadraticCurveTo(currentBoss.width + 30, -20, currentBoss.width + 20, currentBoss.height / 4);
    ctx.quadraticCurveTo(currentBoss.width / 2, currentBoss.height / 3, currentBoss.width / 2, 0);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Main glow
    ctx.shadowColor = currentBoss.color;
    ctx.shadowBlur = 40 + Math.sin(time * 5) * 15;

    // === MAIN BODY ===
    ctx.beginPath();
    ctx.moveTo(0, -currentBoss.height / 2);                    // Top
    ctx.lineTo(-currentBoss.width / 4, -currentBoss.height / 3); // Left shoulder
    ctx.lineTo(-currentBoss.width / 2, currentBoss.height / 5);  // Left wing
    ctx.lineTo(-currentBoss.width / 3, currentBoss.height / 2.5); // Left bottom
    ctx.lineTo(-currentBoss.width / 5, currentBoss.height / 2);  // Left engine
    ctx.lineTo(0, currentBoss.height / 3);                      // Center bottom
    ctx.lineTo(currentBoss.width / 5, currentBoss.height / 2);   // Right engine
    ctx.lineTo(currentBoss.width / 3, currentBoss.height / 2.5); // Right bottom
    ctx.lineTo(currentBoss.width / 2, currentBoss.height / 5);   // Right wing
    ctx.lineTo(currentBoss.width / 4, -currentBoss.height / 3);  // Right shoulder
    ctx.closePath();

    // Metallic gradient
    const bodyGradient = ctx.createLinearGradient(0, -currentBoss.height / 2, 0, currentBoss.height / 2);
    bodyGradient.addColorStop(0, shadeColor(currentBoss.color, 60));
    bodyGradient.addColorStop(0.3, currentBoss.color);
    bodyGradient.addColorStop(0.6, shadeColor(currentBoss.color, -30));
    bodyGradient.addColorStop(1, shadeColor(currentBoss.color, -60));
    ctx.fillStyle = bodyGradient;
    ctx.fill();

    ctx.strokeStyle = shadeColor(currentBoss.color, 40);
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // === ARMOR PLATES ===
    ctx.beginPath();
    ctx.moveTo(-currentBoss.width / 4, -currentBoss.height / 4);
    ctx.lineTo(-currentBoss.width / 2.5, currentBoss.height / 6);
    ctx.lineTo(-currentBoss.width / 5, currentBoss.height / 5);
    ctx.closePath();
    ctx.fillStyle = shadeColor(currentBoss.color, -40);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(currentBoss.width / 4, -currentBoss.height / 4);
    ctx.lineTo(currentBoss.width / 2.5, currentBoss.height / 6);
    ctx.lineTo(currentBoss.width / 5, currentBoss.height / 5);
    ctx.closePath();
    ctx.fill();

    // === GLOWING EYE ===
    const eyeY = -currentBoss.height / 6;
    const eyeRadius = 18;

    // Eye socket
    ctx.beginPath();
    ctx.arc(0, eyeY, eyeRadius + 5, 0, Math.PI * 2);
    ctx.fillStyle = '#220022';
    ctx.fill();

    // Eye with gradient
    const eyeGradient = ctx.createRadialGradient(0, eyeY, 0, 0, eyeY, eyeRadius);
    eyeGradient.addColorStop(0, '#ffffff');
    eyeGradient.addColorStop(0.2, '#ff0066');
    eyeGradient.addColorStop(0.6, '#cc0044');
    eyeGradient.addColorStop(1, '#660022');
    ctx.beginPath();
    ctx.arc(0, eyeY, eyeRadius, 0, Math.PI * 2);
    ctx.fillStyle = eyeGradient;
    ctx.shadowColor = '#ff0066';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Pupil (tracks somewhat randomly)
    const pupilX = Math.sin(time * 2) * 4;
    const pupilY = eyeY + Math.cos(time * 1.5) * 3;
    ctx.beginPath();
    ctx.arc(pupilX, pupilY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();

    // Eye highlight
    ctx.beginPath();
    ctx.arc(-4, eyeY - 4, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();

    // === ENGINE GLOW ===
    const engineGlow = ctx.createRadialGradient(-currentBoss.width / 5, currentBoss.height / 2, 0, -currentBoss.width / 5, currentBoss.height / 2, 15);
    engineGlow.addColorStop(0, currentBoss.color);
    engineGlow.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(-currentBoss.width / 5, currentBoss.height / 2 + 5, 12, 0, Math.PI * 2);
    ctx.fillStyle = engineGlow;
    ctx.fill();

    const engineGlow2 = ctx.createRadialGradient(currentBoss.width / 5, currentBoss.height / 2, 0, currentBoss.width / 5, currentBoss.height / 2, 15);
    engineGlow2.addColorStop(0, currentBoss.color);
    engineGlow2.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(currentBoss.width / 5, currentBoss.height / 2 + 5, 12, 0, Math.PI * 2);
    ctx.fillStyle = engineGlow2;
    ctx.fill();

    ctx.restore();
}

function renderPowerUps() {
    const time = Date.now() * 0.001;

    powerUps.forEach(pu => {
        ctx.save();
        ctx.translate(pu.x, pu.y);

        // Pulsing outer glow
        const pulseSize = 1 + Math.sin(time * 8) * 0.15;

        ctx.shadowColor = pu.color;
        ctx.shadowBlur = 25 + Math.sin(time * 6) * 8;

        // Rotating outer ring
        ctx.save();
        ctx.rotate(pu.angle);
        ctx.beginPath();
        ctx.arc(0, 0, pu.width / 2 + 3, 0, Math.PI * 2);
        ctx.strokeStyle = pu.color;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Main orb
        const orbGradient = ctx.createRadialGradient(-3, -3, 0, 0, 0, pu.width / 2 * pulseSize);
        orbGradient.addColorStop(0, '#ffffff');
        orbGradient.addColorStop(0.3, pu.color);
        orbGradient.addColorStop(1, shadeColor(pu.color, -50));

        ctx.beginPath();
        ctx.arc(0, 0, pu.width / 2 * pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = orbGradient;
        ctx.fill();

        // Inner glow
        ctx.beginPath();
        ctx.arc(0, 0, pu.width / 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, 0.3)`;
        ctx.fill();

        // Symbol
        ctx.shadowBlur = 0;
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(pu.symbol, 0, 1);

        ctx.restore();
    });
}

function renderParticles() {
    particles.forEach(p => {
        const alpha = p.life / p.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;

        if (p.type === 'explosion' || p.type === 'pickup') {
            // Enhanced explosion with motion blur effect
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 15;
            ctx.fill();

            // Motion trail
            ctx.globalAlpha = alpha * 0.3;
            ctx.beginPath();
            ctx.arc(p.x - p.vx * 0.5, p.y - p.vy * 0.5, p.size * alpha * 0.7, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'trail') {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            gradient.addColorStop(0, '#ffaa00');
            gradient.addColorStop(0.5, '#ff4400');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fill();
        } else if (p.type === 'flash' || p.type === 'spark') {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 15;
            ctx.fill();
        } else if (p.type === 'star_spark') {
            // 4-pointed star shape
            ctx.translate(p.x, p.y);
            ctx.rotate(Math.atan2(p.vy, p.vx));
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const angle = (Math.PI / 2) * i;
                const outerR = p.size + 4;
                const innerR = p.size * 0.3;
                ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
                ctx.lineTo(Math.cos(angle + Math.PI / 4) * innerR, Math.sin(angle + Math.PI / 4) * innerR);
            }
            ctx.closePath();
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.fill();
        } else if (p.type === 'ember') {
            // Glowing ember that floats upward
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (0.5 + alpha * 0.5), 0, Math.PI * 2);
            const emberGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            emberGradient.addColorStop(0, '#ffffff');
            emberGradient.addColorStop(0.3, p.color);
            emberGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = emberGradient;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.fill();
        } else if (p.type === 'smoke') {
            // Semi-transparent expanding smoke cloud
            ctx.globalAlpha = alpha * 0.4;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            const smokeGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            smokeGradient.addColorStop(0, 'rgba(80, 80, 80, 0.6)');
            smokeGradient.addColorStop(0.5, 'rgba(60, 60, 60, 0.3)');
            smokeGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = smokeGradient;
            ctx.fill();
        } else if (p.type === 'ripple') {
            // Expanding ring effect
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 3 * alpha;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.stroke();
        } else if (p.type === 'heal') {
            // Rising heart particles
            ctx.font = `${p.size * 2}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.fillText('❤', p.x, p.y);
        } else if (p.type === 'text') {
            // Floating damage/status text
            ctx.font = `bold ${p.size}px Orbitron, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 5;
            ctx.fillText(p.text || '', p.x, p.y);
        }

        ctx.restore();
    });
}

// ============================================
// SKIN ABILITY SYSTEM
// ============================================
function getSkinBonuses() {
    const skin = SKINS.find(s => s.id === selectedSkin) || SKINS[0];
    return skin.bonuses || {};
}

function getCurrentSkin() {
    return SKINS.find(s => s.id === selectedSkin) || SKINS[0];
}

// ============================================
// UI UPDATES
// ============================================
function getMaxHealth() {
    const bonuses = getSkinBonuses();
    // Max health: base + level bonus + shield upgrade bonus (+20 per level) + skin health bonus
    let maxHP = CONFIG.player.maxHealth + (playerLevel - 1) * 20 + upgrades.shield * 20;

    // Skin health bonus
    if (bonuses.healthBonus) maxHP *= (1 + bonuses.healthBonus);
    if (bonuses.allStats) maxHP *= (1 + bonuses.allStats);

    return Math.floor(maxHP);
}

function updateHUD() {
    document.getElementById('score').textContent = score.toLocaleString();
    document.getElementById('wave').textContent = wave;

    const maxHealth = getMaxHealth();
    const healthPercent = (player.health / maxHealth) * 100;
    document.getElementById('health-fill').style.width = `${healthPercent}%`;

    // Update points in HUD
    document.getElementById('hud-points').textContent = points.toLocaleString();

    updateXPBar();
    updateAbilitiesUI();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function shadeColor(color, percent) {
    // Safety: only process valid hex color strings
    if (typeof color !== 'string' || !color.startsWith('#') || color.length < 7) {
        return color; // Return as-is for HSL, rgba, or other formats
    }
    const num = parseInt(color.replace('#', ''), 16);
    if (isNaN(num)) return color;
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 +
        (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
}

// ============================================
// WEAPON SYSTEM
// ============================================
function switchWeapon(direction = 1) {
    const currentIndex = WEAPON_ORDER.indexOf(currentWeapon);
    let newIndex = (currentIndex + direction + WEAPON_ORDER.length) % WEAPON_ORDER.length;

    // Find next unlocked weapon
    for (let i = 0; i < WEAPON_ORDER.length; i++) {
        const weaponId = WEAPON_ORDER[newIndex];
        const weapon = CONFIG.weapons[weaponId];
        if (playerLevel >= weapon.unlockLevel) {
            currentWeapon = weaponId;
            showWeaponSwitch();
            audioEngine.playClick();
            return;
        }
        newIndex = (newIndex + direction + WEAPON_ORDER.length) % WEAPON_ORDER.length;
    }
}

function showWeaponSwitch() {
    const weapon = CONFIG.weapons[currentWeapon];
    // Create weapon switch notification
    const popup = document.createElement('div');
    popup.className = 'weapon-popup';
    popup.innerHTML = `${weapon.icon} ${weapon.name}`;
    popup.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: ${weapon.color};
        padding: 10px 25px;
        border-radius: 25px;
        font-family: 'Orbitron', sans-serif;
        font-size: 1rem;
        z-index: 1000;
        border: 2px solid ${weapon.color};
        animation: fadeInOut 1.5s ease forwards;
    `;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1500);
}

function getUnlockedWeapons() {
    return WEAPON_ORDER.filter(w => playerLevel >= CONFIG.weapons[w].unlockLevel);
}

// ============================================
// DRONE SYSTEM
// ============================================
function initDrones() {
    drones = [];
    const droneCount = Math.min(upgrades.magnet >= 3 ? 1 : 0, CONFIG.drones.maxDrones);

    for (let i = 0; i < droneCount; i++) {
        drones.push({
            angle: (Math.PI * 2 / droneCount) * i,
            lastShot: 0
        });
    }
}

function updateDrones(timestamp) {
    if (drones.length === 0) return;

    drones.forEach((drone, i) => {
        // Orbit around player
        drone.angle += CONFIG.drones.orbitSpeed * 0.01;
        drone.x = player.x + Math.cos(drone.angle) * CONFIG.drones.orbitRadius;
        drone.y = player.y + Math.sin(drone.angle) * CONFIG.drones.orbitRadius;

        // Auto-fire at nearest enemy
        if (timestamp - drone.lastShot > CONFIG.drones.fireRate && enemies.length > 0) {
            const nearestEnemy = enemies.reduce((nearest, e) => {
                const dist = Math.hypot(e.x - drone.x, e.y - drone.y);
                return dist < nearest.dist ? { enemy: e, dist } : nearest;
            }, { dist: Infinity }).enemy;

            if (nearestEnemy) {
                const angle = Math.atan2(nearestEnemy.y - drone.y, nearestEnemy.x - drone.x);
                bullets.push({
                    x: drone.x,
                    y: drone.y,
                    width: 3,
                    height: 10,
                    speed: 10,
                    damage: CONFIG.drones.damage,
                    angle: angle - Math.PI / 2,
                    isDrone: true
                });
                drone.lastShot = timestamp;
            }
        }
    });
}

function renderDrones() {
    const skin = getCurrentSkin();

    drones.forEach(drone => {
        ctx.save();
        ctx.translate(drone.x, drone.y);

        // Drone glow
        ctx.shadowColor = skin.glow;
        ctx.shadowBlur = 10;

        // Drone body
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fillStyle = skin.secondary;
        ctx.fill();
        ctx.strokeStyle = skin.primary;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Drone core
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fillStyle = skin.primary;
        ctx.fill();

        ctx.restore();
    });
}

// ============================================
// GAME MODES
// ============================================
function setGameMode(mode) {
    gameMode = mode;
    if (mode === 'daily') {
        generateDailyChallenge();
    }
}

function generateDailyChallenge() {
    const today = new Date().toDateString();
    if (lastDailyDate !== today) {
        // Generate new daily challenge based on date seed
        const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const modifierIndex = seed % DAILY_MODIFIERS.length;
        dailyChallenge = DAILY_MODIFIERS[modifierIndex];
        dailyChallengeCompleted = false;
        lastDailyDate = today;
        saveProgress();
    }
}

function getDailyReward() {
    if (!dailyChallengeCompleted && gameMode === 'daily' && wave >= 10) {
        dailyChallengeCompleted = true;
        const reward = 500 + (wave * 50);
        points += reward;
        saveProgress();
        return reward;
    }
    return 0;
}

// ============================================
// STATISTICS SYSTEM
// ============================================
function updateStats(type, value = 1) {
    if (gameStats[type] !== undefined) {
        gameStats[type] += value;
    }
}

function loadStats() {
    try {
        const saved = localStorage.getItem('cosmicFuryStats');
        if (saved) {
            gameStats = { ...gameStats, ...JSON.parse(saved) };
        }
    } catch (e) { }
}

function saveStats() {
    localStorage.setItem('cosmicFuryStats', JSON.stringify(gameStats));
}

// ============================================
// LEADERBOARD SYSTEM
// ============================================
function loadLeaderboard() {
    try {
        const saved = localStorage.getItem('cosmicFuryLeaderboard');
        if (saved) {
            leaderboard = JSON.parse(saved);
        }
    } catch (e) {
        leaderboard = [];
    }
}

function saveToLeaderboard(playerName, finalScore, finalWave) {
    // Use current profile's name if available
    const name = (currentProfile && currentProfile.name) ? currentProfile.name : (playerName || 'PILOT');
    const entry = {
        name: name,
        score: finalScore,
        wave: finalWave,
        date: new Date().toLocaleDateString(),
        mode: gameMode
    };

    leaderboard.push(entry);
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10); // Keep top 10

    localStorage.setItem('cosmicFuryLeaderboard', JSON.stringify(leaderboard));
}

function isHighScoreWorthy(score) {
    if (leaderboard.length < 10) return true;
    return score > leaderboard[leaderboard.length - 1].score;
}

function clearAllScores() {
    if (confirm('⚠️ Clear ALL leaderboard scores?\n\nThis will permanently delete all recorded scores.\nThis cannot be undone!')) {
        leaderboard = [];
        localStorage.removeItem('cosmicFuryLeaderboard');
        audioEngine.playClick();
        alert('✅ All scores have been cleared!');
        openLeaderboardScreen(); // Refresh the display
    }
}

function refreshLeaderboard() {
    audioEngine.playClick();
    loadLeaderboard(); // Reload from localStorage
    openLeaderboardScreen(); // Refresh the display
}

// ============================================
// PRESTIGE SYSTEM
// ============================================
function canPrestige() {
    return playerLevel >= 30;
}

function doPrestige() {
    if (!canPrestige()) return;

    prestigeLevel++;
    prestigePoints += Math.floor(playerLevel / 5);

    // Reset progress but keep prestige bonuses
    playerLevel = 1;
    totalXP = 0;
    playerXP = 0;
    upgrades = {
        fireRate: 0, damage: 0, shield: 0, speed: 0, magnet: 0,
        luck: 0, critical: 0, armor: 0, xpBoost: 0, pointBoost: 0
    };

    saveProgress();
    audioEngine.playLevelUp();
}

function getPrestigeMultiplier() {
    return 1 + (prestigeLevel * 0.05); // 5% bonus per prestige level
}

// ============================================
// SETTINGS SYSTEM
// ============================================
function loadSettings() {
    try {
        const saved = localStorage.getItem('cosmicFurySettings');
        if (saved) {
            gameSettings = { ...gameSettings, ...JSON.parse(saved) };
        }
    } catch (e) { }
}

function saveSettings() {
    localStorage.setItem('cosmicFurySettings', JSON.stringify(gameSettings));
}

function updateSetting(key, value) {
    if (gameSettings[key] !== undefined) {
        gameSettings[key] = value;
        saveSettings();
    }
}

// ============================================
// NEW ENEMY BEHAVIORS
// ============================================
function updateEnemyBehaviors(enemy, timestamp) {
    // Teleporter behavior
    if (enemy.teleports && Math.random() < 0.005) {
        // Teleport to random position
        const oldX = enemy.x;
        const oldY = enemy.y;
        enemy.x = Math.random() * (canvas.width - 100) + 50;

        // Create teleport effect
        createTeleportEffect(oldX, oldY, enemy.color);
        createTeleportEffect(enemy.x, enemy.y, enemy.color);
    }

    // Shielded enemy behavior
    if (enemy.shield !== undefined && enemy.shield > 0) {
        enemy.shielded = true;
    } else {
        enemy.shielded = false;
    }
}

function createTeleportEffect(x, y, color) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            size: Math.random() * 5 + 3,
            color: color,
            life: 0.4, maxLife: 0.4, type: 'teleport'
        });
    }
}

function handleSplitterDeath(enemy) {
    if (!enemy.splits) return;

    // Spawn 2-3 smaller swarm enemies
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
        const offset = (i - count / 2) * 30;
        enemies.push({
            x: enemy.x + offset,
            y: enemy.y,
            width: 20,
            height: 20,
            health: 1,
            maxHealth: 1,
            points: 50,
            color: '#88ff00',
            speed: CONFIG.enemy.baseSpeed * 1.5,
            offset: Math.random() * Math.PI * 2,
            type: 'swarm',
            xp: 5
        });
    }
}

// ============================================
// ULTIMATE ABILITY
// ============================================
function useUltimateAbility() {
    if (playerLevel < CONFIG.abilities.ultimate.unlockLevel) return;
    if (abilityCooldowns.ultimate > 0) return;

    abilityCooldowns.ultimate = CONFIG.abilities.ultimate.cooldown;
    ultimateActive = true;

    audioEngine.playBigExplosion();

    // Meteor Storm Effect - massive damage across screen
    const meteorCount = 15;
    for (let i = 0; i < meteorCount; i++) {
        setTimeout(() => {
            // Guard: don't continue if game is no longer playing
            if (gameState !== 'playing') return;

            const x = Math.random() * canvas.width;
            const y = Math.random() * (canvas.height * 0.7);

            createExplosion(x, y, '#ff6600', 25);

            // Damage all enemies in area
            enemies = enemies.filter(e => {
                if (Math.hypot(e.x - x, e.y - y) < 80) {
                    createExplosion(e.x, e.y, e.color);
                    score += e.points;
                    addXP(e.xp);
                    enemiesDestroyed++;
                    return false;
                }
                return true;
            });

            // Also damage boss
            if (currentBoss && Math.hypot(currentBoss.x - x, currentBoss.y - y) < 100) {
                currentBoss.health -= 20;
                if (currentBoss.health <= 0) defeatBoss();
            }
        }, i * 100);
    }

    setTimeout(() => {
        ultimateActive = false;
        updateHUD();
    }, 1500);

    updateAbilitiesUI();
}

// ============================================
// ENVIRONMENT SYSTEM
// ============================================
function updateEnvironment() {
    // Change environment every 5 waves
    const newEnv = Math.floor((wave - 1) / 5) % CONFIG.environments.length;
    if (newEnv !== currentEnvironment) {
        currentEnvironment = newEnv;
        applyEnvironment();
    }
}

function applyEnvironment() {
    const env = CONFIG.environments[currentEnvironment];
    const container = document.getElementById('game-container');
    container.style.background = `linear-gradient(180deg, ${env.bgColor1} 0%, ${env.bgColor2} 100%)`;
}

// ============================================
// ENHANCED SAVE/LOAD
// ============================================
function loadAllData() {
    loadProgress();
    loadStats();
    loadLeaderboard();
    loadSettings();
}

function saveAllData() {
    saveProgress();
    saveStats();
    saveSettings();
}

// ============================================
// UI SCREEN FUNCTIONS
// ============================================
function openStatsScreen() {
    audioEngine.playClick();
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('stats-screen').classList.remove('hidden');

    // Update stats display
    document.getElementById('stat-kills').textContent = gameStats.totalKills.toLocaleString();
    document.getElementById('stat-games').textContent = gameStats.gamesPlayed.toLocaleString();
    document.getElementById('stat-highwave').textContent = gameStats.highestWave;
    document.getElementById('stat-combo').textContent = gameStats.highestCombo;
    document.getElementById('stat-bosses').textContent = gameStats.bossesDefeated;
    document.getElementById('stat-time').textContent = Math.floor(gameStats.totalPlayTime / 3600) + 'h';
}

function closeStatsScreen() {
    audioEngine.playClick();
    document.getElementById('stats-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
}

function openLeaderboardScreen() {
    audioEngine.playClick();
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('leaderboard-screen').classList.remove('hidden');

    // Populate leaderboard
    const list = document.getElementById('leaderboard-list');
    const header = list.querySelector('.leaderboard-header');
    list.innerHTML = '';
    list.appendChild(header);

    if (leaderboard.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'leaderboard-entry';
        empty.innerHTML = '<span></span><span style="grid-column: span 3; text-align: center; color: #666;">No scores yet!</span>';
        list.appendChild(empty);
    } else {
        leaderboard.forEach((entry, i) => {
            const row = document.createElement('div');
            row.className = 'leaderboard-entry';
            if (i === 0) row.classList.add('gold');
            else if (i === 1) row.classList.add('silver');
            else if (i === 2) row.classList.add('bronze');
            row.innerHTML = `<span>${i + 1}</span><span>${entry.name}</span><span>${entry.score.toLocaleString()}</span><span>${entry.wave}</span>`;
            list.appendChild(row);
        });
    }
}

function closeLeaderboardScreen() {
    audioEngine.playClick();
    document.getElementById('leaderboard-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
}

function openSettingsScreen() {
    audioEngine.playClick();
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('settings-screen').classList.remove('hidden');

    // Load settings values
    document.getElementById('setting-shake').checked = gameSettings.screenShake;
    document.getElementById('setting-dmgnums').checked = gameSettings.showDamageNumbers;
    document.getElementById('setting-autofire').checked = gameSettings.autoFire;
    document.getElementById('setting-particles').value = gameSettings.particles;

    // Add change listeners
    document.getElementById('setting-shake').onchange = (e) => updateSetting('screenShake', e.target.checked);
    document.getElementById('setting-dmgnums').onchange = (e) => updateSetting('showDamageNumbers', e.target.checked);
    document.getElementById('setting-autofire').onchange = (e) => updateSetting('autoFire', e.target.checked);
    document.getElementById('setting-particles').onchange = (e) => updateSetting('particles', e.target.value);
}

function closeSettingsScreen() {
    audioEngine.playClick();
    document.getElementById('settings-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
}

// Weapon indicator update
function updateWeaponIndicator() {
    const indicator = document.getElementById('weapon-indicator');
    if (!indicator) return;

    const weapon = CONFIG.weapons[currentWeapon];
    document.getElementById('weapon-icon').textContent = weapon.icon;
    document.getElementById('weapon-name').textContent = weapon.name;

    if (gameState === 'playing') {
        indicator.classList.remove('hidden');
    } else {
        indicator.classList.add('hidden');
    }
}
