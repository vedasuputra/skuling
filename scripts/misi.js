const BOOSTERS = [
    {
        key: "hint",
        className: "booster-card--hint",
        img: "./img/icon-booster-hint.png",
        title: "Hint",
        desc: "Buka kisi-kisi untuk dapat jawaban tepat!",
        getCount: () => getHintCount(),
    },
    {
        key: "double",
        className: "booster-card--double",
        img: "./img/icon-booster-double-pts.png",
        title: "Double Pts",
        desc: "Benar 2x rating, tapi kalau salah 2x minus.",
        getCount: () => 0,
    },
    {
        key: "skip",
        className: "booster-card--skip",
        img: "./img/icon-booster-skip.png",
        title: "Skip",
        desc: "Lompati soal sulit, ratingmu tetap aman.",
        getCount: () => 0,
    },
    {
        key: "fifty",
        className: "booster-card--fifty",
        img: "./img/icon-booster-fifty-fifty.png",
        title: "50:50",
        desc: "Hapus jawaban salah. Peluang benar 50%!",
        getCount: () => 0,
    },
];

const MISSIONS = [
    { title: "Menang Battle", progress: "0/3", icon: "./img/icon-battle-win.png" },
    { xplain: true, icon: "./img/icon-book-outline.png" },
    { title: "Benar 10 Soal di Freestyle", progress: "0/10", icon: "./img/icon-freestyle-correct.png" },
    { title: "Mendapatkan Badge", progress: "0/1", icon: "./img/icon-badge.png" },
    { title: "Post diskusi di squad, minimal 10 likes", progress: "0/10", icon: "./img/icon-squad-post.png" },
    { title: "Mengomentari 5 Diskusi di Squad", progress: "0/5", icon: "./img/icon-squad-comment.png" },
    { title: "Mengerjakan 1 Try Out", progress: "0/1", icon: "./img/icon-tryout.png" },
];

function renderBoosters() {
    const grid = document.getElementById("boosterGrid");
    if (!grid) return;

    grid.innerHTML = BOOSTERS.map(booster => {
        const count = booster.getCount();
        return `
            <div class="booster-card ${booster.className}${count === 0 ? " is-disabled" : ""}">
                <span class="booster-card-icon"><img src="${booster.img}" alt=""></span>
                <span class="booster-card-body">
                    <span class="booster-card-title">${booster.title} (${count})</span>
                    <span class="booster-card-desc">${booster.desc}</span>
                </span>
            </div>
        `;
    }).join("");
}

function renderMissions() {
    const list = document.getElementById("misiList");
    if (!list) return;

    list.innerHTML = MISSIONS.map(mission => {
        if (mission.xplain) {
            const claimable = isXplainMissionClaimable();
            const progress = claimable ? "1/1" : "0/1";
            return `
                <div class="misi-row${claimable ? " is-active" : ""}">
                    <span class="misi-row-left">
                        <span class="misi-row-icon"><img src="${mission.icon}" alt=""></span>
                        <span class="misi-row-title">Menyelesaikan Modul Xplain 50% (${progress})</span>
                    </span>
                    <button type="button" class="misi-claim-btn${claimable ? " is-claimable" : ""}"
                        id="xplainClaimBtn" ${claimable ? "" : "disabled data-not-in-scenario"}>Claim</button>
                </div>
            `;
        }
        return `
            <div class="misi-row">
                <span class="misi-row-left">
                    <span class="misi-row-icon"><img src="${mission.icon}" alt=""></span>
                    <span class="misi-row-title">${mission.title} (${mission.progress})</span>
                </span>
                <button type="button" class="misi-claim-btn" disabled data-not-in-scenario>Claim</button>
            </div>
        `;
    }).join("");

    const xplainBtn = document.getElementById("xplainClaimBtn");
    if (xplainBtn && isXplainMissionClaimable()) {
        xplainBtn.addEventListener("click", openSpinOverlay);
    }
}

function renderRatingPill() {
    const el = document.getElementById("ratingCount");
    if (el) el.textContent = String(getHintCount());
}

function renderAll() {
    renderBoosters();
    renderMissions();
    renderRatingPill();
    bindMissionCount();
}

function updateCountdown() {
    const el = document.getElementById("countdownTimer");
    if (!el) return;
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    const diff = Math.max(0, midnight - now);
    const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
    el.textContent = `${h}:${m}:${s}`;
}

function renderSpinGrid() {
    const grid = document.getElementById("spinGrid");
    if (!grid) return;
    grid.innerHTML = BOOSTERS.map(booster => `
        <div class="spin-tile ${booster.className.replace("booster-card", "spin-tile")}" data-key="${booster.key}">
            <img src="${booster.img}" alt="">
            <span class="spin-tile-label">${booster.title}</span>
        </div>
    `).join("");
}

function showOverlay(overlay) {
    overlay.hidden = false;

    void overlay.offsetWidth;
    overlay.classList.add("is-visible");
}

function hideOverlay(overlay) {
    overlay.classList.remove("is-visible");
    overlay.addEventListener("transitionend", () => {
        overlay.hidden = true;
    }, { once: true });
}

function openSpinOverlay() {
    renderSpinGrid();
    const spinBtn = document.getElementById("spinBtn");
    spinBtn.disabled = false;
    spinBtn.textContent = "Spin";
    document.getElementById("spinStage").hidden = false;
    document.getElementById("spinResultStage").hidden = true;
    showOverlay(document.getElementById("spinOverlay"));
}

function closeSpinOverlay() {
    hideOverlay(document.getElementById("spinOverlay"));
}

function runSpinAnimation() {
    const spinBtn = document.getElementById("spinBtn");
    spinBtn.disabled = true;
    spinBtn.textContent = "Spinning...";

    const tiles = Array.from(document.querySelectorAll(".spin-tile"));
    const hintTile = tiles.find(t => t.dataset.key === "hint");
    const duration = 1400 + Math.random() * 800;
    const start = Date.now();
    let activeTile = null;

    function tick() {
        const elapsed = Date.now() - start;
        if (activeTile) activeTile.classList.remove("is-lit");

        if (elapsed >= duration) {
            hintTile.classList.add("is-lit");
            setTimeout(() => {
                grantHintReward();
                openSpinCompleteOverlay();
            }, 300);
            return;
        }

        const remaining = duration - elapsed;
        const intervalMs = remaining < 400 ? 110 : remaining < 900 ? 70 : 45;

        activeTile = remaining < 250
            ? hintTile
            : tiles[Math.floor(Math.random() * tiles.length)];
        activeTile.classList.add("is-lit");

        setTimeout(tick, intervalMs);
    }

    tick();
}

function openSpinCompleteOverlay() {
    const result = document.getElementById("spinResult");
    result.innerHTML = `
        <div class="spin-result-card">
            <span class="spin-result-pill">Selamat! Kamu dapat...</span>
            <img class="spin-result-icon" src="./img/icon-booster-hint-reward.png" alt="">
            <span class="spin-result-body">
                <span class="spin-result-title">Hint</span>
                <span class="spin-result-desc">Buka kisi-kisi untuk dapat jawaban tepat!</span>
            </span>
        </div>
    `;
    document.getElementById("spinStage").hidden = true;
    document.getElementById("spinResultStage").hidden = false;
}

function closeSpinCompleteOverlay() {
    hideOverlay(document.getElementById("spinOverlay"));
    renderAll();
}

function grantHintReward() {
    markXplainMissionClaimed();
    incrementHintCount();
}

function bindEvents() {

    document.getElementById("spinCloseBtn").addEventListener("click", () => {
        const resultShowing = !document.getElementById("spinResultStage").hidden;
        if (resultShowing) closeSpinCompleteOverlay();
        else closeSpinOverlay();
    });
    document.getElementById("spinBtn").addEventListener("click", runSpinAnimation);
    document.getElementById("spinOkBtn").addEventListener("click", closeSpinCompleteOverlay);

    const spinOverlay = document.getElementById("spinOverlay");
    spinOverlay.addEventListener("click", (e) => {
        if (e.target !== spinOverlay) return;
        const resultShowing = !document.getElementById("spinResultStage").hidden;
        if (resultShowing) closeSpinCompleteOverlay();
        else closeSpinOverlay();
    });

    const backBtn = document.querySelector(".back-btn");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            if (document.referrer) {
                history.back();
            } else {
                window.location.href = "./beranda.html";
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderAll();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    bindEvents();
});
