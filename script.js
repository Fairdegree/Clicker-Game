// -----------------------------
// VARIABLES
// -----------------------------
let clicks = 0;
let multiplier = 1;
let auto = 0;
let prestige = 0;
let achievements = {};   

// -----------------------------
// DOM ELEMENTS
// -----------------------------
const clicksEl = document.getElementById("clicks");
const multEl = document.getElementById("multiplier");
const autoEl = document.getElementById("auto");
const prestigeEl = document.getElementById("prestige");
const progressFill = document.getElementById("progressFill");

const shopPanel = document.getElementById("shopPanel");
const prestigePanel = document.getElementById("prestigePanel");
const achievementsPanel = document.getElementById("achievementsPanel");
const prestigeGainEl = document.getElementById("prestigeGain");
const achievementList = document.getElementById("achievementList");
const achievementPopup = document.getElementById("achievementPopup");

// Dev panel
const devPanel = document.getElementById("devPanel");
const devBtn = document.getElementById("devBtn");
const devClicks = document.getElementById("devClicks");
const devMult = document.getElementById("devMult");
const devAuto = document.getElementById("devAuto");
const devPrestige = document.getElementById("devPrestige");

// -----------------------------
// SAVE + LOAD
// -----------------------------
function saveGame() {
    localStorage.setItem("clickerSave", JSON.stringify({
        clicks, multiplier, auto, prestige, achievements
    }));
}

function loadGame() {
    const data = JSON.parse(localStorage.getItem("clickerSave"));
    if (data) {
        clicks = data.clicks ?? 0;
        multiplier = data.multiplier ?? 1;
        auto = data.auto ?? 0;
        prestige = data.prestige ?? 0;
        achievements = data.achievements ?? {};
    }
}

loadGame();

// -----------------------------
// COST FUNCTIONS
// -----------------------------
function multCost() { return multiplier * 50; }
function autoCost() { return (auto + 1) * 100; }

// -----------------------------
// ACHIEVEMENTS
// -----------------------------
const achievementDefs = [
    { id: "firstClick", name: "First Click!", condition: () => clicks >= 1 },
    { id: "hundredClicks", name: "100 Clicks!", condition: () => clicks >= 100 },
    { id: "bigMultiplier", name: "Multiplier 10!", condition: () => multiplier >= 10 },
    { id: "autoMaster", name: "10 Auto‑Clickers!", condition: () => auto >= 10 },
    { id: "prestige1", name: "First Prestige!", condition: () => prestige >= 1 }
];

function checkAchievements() {
    achievementDefs.forEach(a => {
        if (!achievements[a.id] && a.condition()) {
            achievements[a.id] = true;
            showAchievement(a.name);
        }
    });
    renderAchievements();
}

function renderAchievements() {
    achievementList.innerHTML = "";
    achievementDefs.forEach(a => {
        const li = document.createElement("li");
        li.textContent = (achievements[a.id] ? "🏆 " : "⬜ ") + a.name;
        achievementList.appendChild(li);
    });
}

function showAchievement(name) {
    achievementPopup.textContent = "🏆 " + name;
    achievementPopup.classList.add("show");
    setTimeout(() => achievementPopup.classList.remove("show"), 2500);
}

// -----------------------------
// UI UPDATE
// -----------------------------
function updateUI() {
    clicksEl.textContent = clicks.toFixed(1);
    multEl.textContent = multiplier;
    autoEl.textContent = auto;
    prestigeEl.textContent = prestige;

    document.getElementById("buyMult").textContent =
        `⚔️ Buy Multiplier (cost: ${multCost()})`;

    document.getElementById("buyAuto").textContent =
        `🤖 Buy Auto‑Clicker (cost: ${autoCost()})`;

    document.getElementById("buyMult").disabled = clicks < multCost();
    document.getElementById("buyAuto").disabled = clicks < autoCost();

    progressFill.style.width = `${(clicks % 100) / 100 * 100}%`;

    prestigeGainEl.textContent = Math.floor(clicks / 1000);

    // Dev panel live values
    devClicks.textContent = clicks.toFixed(1);
    devMult.textContent = multiplier;
    devAuto.textContent = auto;
    devPrestige.textContent = prestige;

    checkAchievements();
    saveGame();
}

// -----------------------------
// BUTTONS
// -----------------------------
document.getElementById("clickBtn").onclick = () => {
    clicks += multiplier * (1 + prestige * 0.5);
    updateUI();
};

document.getElementById("buyMult").onclick = () => {
    const cost = multCost();
    if (clicks >= cost) {
        clicks -= cost;
        multiplier++;
        updateUI();
    }
};

document.getElementById("buyAuto").onclick = () => {
    const cost = autoCost();
    if (clicks >= cost) {
        clicks -= cost;
        auto++;
        updateUI();
    }
};

// -----------------------------
// AUTO CLICK LOOP
// -----------------------------
setInterval(() => {
    clicks += auto * 0.2 * (1 + prestige * 0.5);
    updateUI();
}, 100);

// -----------------------------
// PANELS
// -----------------------------
document.getElementById("openShop").onclick = () => openPanel(shopPanel);
document.getElementById("openPrestige").onclick = () => openPanel(prestigePanel);
document.getElementById("openAchievements").onclick = () => openPanel(achievementsPanel);

function openPanel(panel) {
    closePanels();
    panel.classList.add("open");
}

function closePanels() {
    shopPanel.classList.remove("open");
    prestigePanel.classList.remove("open");
    achievementsPanel.classList.remove("open");
    devPanel.classList.remove("open");
}

// -----------------------------
// PRESTIGE
// -----------------------------
document.getElementById("doPrestige").onclick = () => {
    const gain = Math.floor(clicks / 1000);
    if (gain > 0) {
        prestige += gain;
        clicks = 0;
        multiplier = 1;
        auto = 0;
        closePanels();
        updateUI();
    }
};

// -----------------------------
// DEV PANEL
// -----------------------------
devBtn.onclick = () => {
    const isOpen = devPanel.classList.contains("open");
    closePanels();
    if (!isOpen) devPanel.classList.add("open");
};

document.getElementById("devAddClicks").onclick = () => {
    clicks += 1_000_000;
    updateUI();
};

// -----------------------------
// RESET OPTIONS
// -----------------------------
document.getElementById("softReset").onclick = () => {
    clicks = 0;
    multiplier = 1;
    auto = 0;
    achievements = {};
    updateUI();
};

document.getElementById("fullReset").onclick = () => {
    clicks = 0;
    multiplier = 1;
    auto = 0;
    prestige = 0;
    achievements = {};
    localStorage.removeItem("clickerSave");
    updateUI();
};

// -----------------------------
updateUI();
renderAchievements();
