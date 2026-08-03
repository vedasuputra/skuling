function showToast(message) {
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
            <span class="toast-icon" aria-hidden="true">info</span>
            <span class="toast-message"></span>
        `;
    toast.querySelector(".toast-message").textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.add("visible");
        });
    });

    setTimeout(() => {
        toast.classList.remove("visible");
        toast.addEventListener("transitionend", () => toast.remove(), { once: true });
    }, 2500);
}
async function loadComponent(placeholderId, path) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;
    const res = await fetch(path);
    const html = await res.text();
    placeholder.outerHTML = html;
}

async function initLayout() {
    const streakPlaceholders = ["streakPlaceholder", "streakPlaceholderXplain", "streakPlaceholderBattle"]
        .filter(id => document.getElementById(id));
    // Pages that show the pill-tab strip under the top bar (Xplain/Battle on
    // beranda.html, Battle/Freestyle/Tryout on peringkat.html, etc.) share the
    // same .home-navbar markup/CSS/JS — only which buttons render differs.
    const homeNavbarVariant = document.body.dataset.homeNavbar || "home-navbar";

    await Promise.all([
        loadComponent("topbarPlaceholder", "./components/top.html"),
        loadComponent("navbarPlaceholder", "./components/nav.html"),
        loadComponent("homeNavbarPlaceholder", `./components/${homeNavbarVariant}.html`),
        ...streakPlaceholders.map(id => loadComponent(id, "./components/streak.html"))
    ]);
    highlightActiveNav();
    highlightActiveHomeTab();
    bindMissionCount();
    bindGlobalToastButtons();

    const deviceFrame = document.querySelector(".device-frame");
    if (deviceFrame) deviceFrame.classList.add("layout-ready");
}

function highlightActiveNav() {
    const currentPage = document.body.dataset.page;
    document.querySelectorAll(".app-navbar [data-page]").forEach(link => {
        if (link.dataset.page === currentPage) {
            link.setAttribute("aria-current", "page");
        }
    });
}

function highlightActiveHomeTab() {
    const currentTab = document.body.dataset.homeTab;
    if (!currentTab) return;
    document.querySelectorAll(".home-navbar [data-tab]").forEach(tab => {
        if (tab.dataset.tab === currentTab) {
            tab.setAttribute("aria-current", "page");
        }
    });
}
const NOT_IN_SCENARIO_MSG = "Bukan bagian dari skenario tugas, coba lagi.";

function bindGlobalToastButtons() {
    // Delegated on document so it works no matter when the target element
    // was added to the DOM (dynamically-rendered cards, async-loaded
    // topbar/navbar components, etc.) and is safe to call only once.
    document.addEventListener("click", (e) => {
        const target = e.target.closest("[data-not-in-scenario], #upgradeBtn, #notifBtn");
        if (target) showToast(NOT_IN_SCENARIO_MSG);
    });
}

// How many missions are currently claimable (right now just the Xplain
// module mission, but written to sum over more later if any get added).
// This drives the "Missions" label text only — NOT the rocket pill number,
// which shows the power-up/hint count instead (see bindMissionCount).
function getClaimableMissionsCount() {
    return isXplainMissionClaimable() ? 1 : 0;
}

// The top bar's rocket pill is a power-up indicator, so its number must
// match the same power-up count shown on misi.html's own header pill
// (getHintCount), not the claimable-missions count.
function bindMissionCount() {
    const countEl = document.getElementById("missionCount");
    if (countEl) countEl.textContent = String(getHintCount());

    const missionsClaimable = getClaimableMissionsCount();
    const labelEl = document.getElementById("missionLabel");
    if (labelEl) labelEl.textContent = missionsClaimable > 0 ? `Missions (${missionsClaimable})` : "Missions";
}

// A section stays unlocked forever once visited (via Next, Back, or the
// dropdown), regardless of how the learner got there or navigated away.
const MATERI_VISITED_KEY = "skuling_materi_visited_bahasa_indonesia";
// Set only once the learner finishes section 4 ("Selesai Belajar") — visiting
// section 4 alone caps progress at 87.5%, matching the "almost full" state.
const MATERI_COMPLETED_KEY = "skuling_materi_completed_bahasa_indonesia";

function getVisitedSections() {
    try {
        return JSON.parse(localStorage.getItem(MATERI_VISITED_KEY) || "[]");
    } catch (e) {
        return [];
    }
}

function markSectionVisited(n) {
    const visited = getVisitedSections();
    if (!visited.includes(n)) {
        visited.push(n);
        localStorage.setItem(MATERI_VISITED_KEY, JSON.stringify(visited));
    }
}

function isSectionUnlocked(n) {
    return getVisitedSections().includes(n);
}

function isMateriCompleted() {
    return localStorage.getItem(MATERI_COMPLETED_KEY) === "1";
}

function markMateriCompleted() {
    localStorage.setItem(MATERI_COMPLETED_KEY, "1");
}

// Tracks whether the celebratory Summary Screen (streak/rookie/mission cards)
// has already been shown once — later completions only show the mascot + text.
const MATERI_SUMMARY_SEEN_KEY = "skuling_materi_summary_seen_bahasa_indonesia";

function hasSeenMateriSummary() {
    return localStorage.getItem(MATERI_SUMMARY_SEEN_KEY) === "1";
}

function markMateriSummarySeen() {
    localStorage.setItem(MATERI_SUMMARY_SEEN_KEY, "1");
}

function getMateriProgress() {
    if (isMateriCompleted()) return 100;
    const visited = getVisitedSections();
    if (!visited.length) return 0;
    return Math.min(87.5, 50 + (Math.max(...visited) - 1) * 12.5);
}

// ============ DAILY MISSIONS / POWER-UPS ============
// New user, power-ups all start at 0 (registration-time power-ups are not
// carried over into this flow).
const HINT_COUNT_KEY = "skuling_hint_count";
// Claiming resets the "Menyelesaikan Modul Xplain 50%" mission back to a
// locked 0/1 state — independent of the underlying materi progress, which
// stays completed.
const XPLAIN_MISSION_CLAIMED_KEY = "skuling_xplain_mission_claimed";

function getHintCount() {
    return parseInt(localStorage.getItem(HINT_COUNT_KEY) || "0", 10);
}

function incrementHintCount() {
    const next = getHintCount() + 1;
    localStorage.setItem(HINT_COUNT_KEY, String(next));
    return next;
}

function hasClaimedXplainMission() {
    return localStorage.getItem(XPLAIN_MISSION_CLAIMED_KEY) === "1";
}

function markXplainMissionClaimed() {
    localStorage.setItem(XPLAIN_MISSION_CLAIMED_KEY, "1");
}

function isXplainMissionClaimable() {
    return isMateriCompleted() && !hasClaimedXplainMission();
}

document.addEventListener("DOMContentLoaded", initLayout);