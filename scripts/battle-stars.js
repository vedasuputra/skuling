document.body.dataset.page = "battle-stars";

const STARS = [
    { key: "geraeldo-s", name: "Geraeldo S", img: "./img/battle-star-geraeldo-s.png", unlocked: true },
    { key: "aditya-w", name: "Aditya W", img: "./img/battle-star-aditya-w.png", unlocked: true },
    { key: "kak-sandro", name: "Kak Sandro", img: "./img/battle-star-kak-sandro.png", unlocked: true },
    { key: "kak-aji", name: "Kak Aji", img: "./img/battle-star-kak-aji.png", unlocked: true, isKakAji: true },
    { key: "master-safrezaa", name: "Master Safrezaa", img: "./img/battle-star-master-safrezaa.png", unlocked: false },
    { key: "nayla-efendi", name: "Nayla Efendi", img: "./img/battle-star-nayla-efendi.png", unlocked: false },
    { key: "kak-deni", name: "Kak Deni", img: "./img/battle-star-kak-deni.png", unlocked: false },
    { key: "kak-clara", name: "Kak Clara", img: "./img/battle-star-kak-clara.png", unlocked: false },
    { key: "kak-aleesha", name: "Kak Aleesha", img: "./img/battle-star-kak-aleesha.png", unlocked: false },
    { key: "salmahita", name: "Salmahita", img: "./img/battle-star-salmahita.png", unlocked: false },
    { key: "wina-panjali", name: "Wina Panjali", img: "./img/battle-star-wina-panjali.png", unlocked: false },
    { key: "kak-cipa", name: "Kak Cipa", img: "./img/battle-star-kak-cipa.png", unlocked: false },
];

function renderStarGrid() {
    const grid = document.getElementById("starGrid");
    if (!grid) return;

    grid.innerHTML = STARS.map(star => `
        <button type="button" class="star-card${star.unlocked ? " is-unlocked" : ""}"
            ${star.isKakAji ? 'id="kakAjiCard"' : "data-not-in-scenario"}
            aria-label="${star.name}">
            <span class="star-photo-wrap">
                <img class="star-photo" src="${star.img}" alt="">
                ${star.unlocked ? "" : `
                <span class="star-lock-overlay">
                    <span class="material-symbols-outlined" aria-hidden="true">lock</span>
                </span>`}
            </span>
            <span class="star-name">${star.name}</span>
        </button>
    `).join("");
}

renderStarGrid();

const starProfileOverlay = document.getElementById("starProfileOverlay");

function openOverlay(overlay) {
    if (!overlay) return;
    overlay.hidden = false;

    void overlay.offsetWidth;
    overlay.classList.add("is-visible");
}

function closeOverlay(overlay) {
    if (!overlay) return;
    overlay.classList.remove("is-visible");
    overlay.addEventListener("transitionend", () => { overlay.hidden = true; }, { once: true });
}

document.getElementById("kakAjiCard")?.addEventListener("click", () => openOverlay(starProfileOverlay));
document.getElementById("profileCloseBtn")?.addEventListener("click", () => closeOverlay(starProfileOverlay));
starProfileOverlay?.addEventListener("click", (e) => {
    if (e.target === starProfileOverlay) closeOverlay(starProfileOverlay);
});

const adjustBattleOverlay = document.getElementById("adjustBattleOverlay");
const SOAL_MIN = 5;
const SOAL_MAX = 10;
const WAKTU_MIN = 5;
const WAKTU_MAX = 10;
const TASK_SOAL = 10;
const TASK_WAKTU = 6;

let soalCount = SOAL_MIN;
let waktuCount = WAKTU_MIN;

const soalValueEl = document.getElementById("soalValue");
const waktuValueEl = document.getElementById("waktuValue");
const soalMinusBtn = document.getElementById("soalMinusBtn");
const soalPlusBtn = document.getElementById("soalPlusBtn");
const waktuMinusBtn = document.getElementById("waktuMinusBtn");
const waktuPlusBtn = document.getElementById("waktuPlusBtn");

function updateStepperButtons() {
    if (soalMinusBtn) soalMinusBtn.disabled = soalCount <= SOAL_MIN;
    if (soalPlusBtn) soalPlusBtn.disabled = soalCount >= SOAL_MAX;
    if (waktuMinusBtn) waktuMinusBtn.disabled = waktuCount <= WAKTU_MIN;
    if (waktuPlusBtn) waktuPlusBtn.disabled = waktuCount >= WAKTU_MAX;
}

function renderStepperValues() {
    if (soalValueEl) soalValueEl.value = String(soalCount);
    if (waktuValueEl) waktuValueEl.value = String(waktuCount);
    updateStepperButtons();
}

function bindTypableStepper(input, min, max, setCount) {
    if (!input) return;

    input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, "");
    });

    const commit = () => {
        const parsed = parseInt(input.value, 10);
        const clamped = Number.isNaN(parsed) ? min : Math.min(max, Math.max(min, parsed));
        setCount(clamped);
        renderStepperValues();
    };

    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            input.blur();
        }
    });
}

document.getElementById("tantangBtn")?.addEventListener("click", () => {
    closeOverlay(starProfileOverlay);
    soalCount = SOAL_MIN;
    waktuCount = WAKTU_MIN;
    renderStepperValues();
    openOverlay(adjustBattleOverlay);
});

document.getElementById("adjustCloseBtn")?.addEventListener("click", () => closeOverlay(adjustBattleOverlay));
adjustBattleOverlay?.addEventListener("click", (e) => {
    if (e.target === adjustBattleOverlay) closeOverlay(adjustBattleOverlay);
});

soalMinusBtn?.addEventListener("click", () => {
    if (soalCount > SOAL_MIN) soalCount--;
    renderStepperValues();
});
soalPlusBtn?.addEventListener("click", () => {
    if (soalCount < SOAL_MAX) soalCount++;
    renderStepperValues();
});
waktuMinusBtn?.addEventListener("click", () => {
    if (waktuCount > WAKTU_MIN) waktuCount--;
    renderStepperValues();
});
waktuPlusBtn?.addEventListener("click", () => {
    if (waktuCount < WAKTU_MAX) waktuCount++;
    renderStepperValues();
});

bindTypableStepper(soalValueEl, SOAL_MIN, SOAL_MAX, (value) => { soalCount = value; });
bindTypableStepper(waktuValueEl, WAKTU_MIN, WAKTU_MAX, (value) => { waktuCount = value; });

document.getElementById("mulaiBattleBtn")?.addEventListener("click", () => {
    if (soalCount !== TASK_SOAL || waktuCount !== TASK_WAKTU) {
        showToast("Pengaturan tidak sesuai dengan skenario tugas yang diberikan.");
        return;
    }
    window.location.href = "battle.html";
});

renderStepperValues();
