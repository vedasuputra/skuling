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
    watchImageLoading();

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

    document.addEventListener("click", (e) => {
        const target = e.target.closest("[data-not-in-scenario], #upgradeBtn, #notifBtn");
        if (target) showToast(NOT_IN_SCENARIO_MSG);
    });
}

function getClaimableMissionsCount() {
    return isXplainMissionClaimable() ? 1 : 0;
}

function bindMissionCount() {
    const countEl = document.getElementById("missionCount");
    if (countEl) countEl.textContent = String(getHintCount());

    const missionsClaimable = getClaimableMissionsCount();
    const labelEl = document.getElementById("missionLabel");
    if (labelEl) labelEl.textContent = missionsClaimable > 0 ? `Missions (${missionsClaimable})` : "Missions";
}

const MATERI_VISITED_KEY = "skuling_materi_visited_bahasa_indonesia";

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

const HINT_COUNT_KEY = "skuling_hint_count";

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

function watchImageLoading(root = document) {
    root.querySelectorAll("img").forEach((img) => {
        if (img.dataset.skelBound) return;
        img.dataset.skelBound = "1";
        if (img.complete && img.naturalWidth > 0) return;
        img.classList.add("img-skeleton");
        const clear = () => img.classList.remove("img-skeleton");
        img.addEventListener("load", clear, { once: true });
        img.addEventListener("error", clear, { once: true });
    });
}

document.addEventListener("DOMContentLoaded", () => watchImageLoading());
document.addEventListener("DOMContentLoaded", initLayout);

document.addEventListener("contextmenu", (e) => {
    if (e.target.closest("img, video, canvas")) e.preventDefault();
});
document.addEventListener("dragstart", (e) => {
    if (e.target.closest("img, video, canvas")) e.preventDefault();
});

(function () {
    function getBar() {
        let bar = document.querySelector(".page-loading-bar");
        if (!bar) {
            bar = document.createElement("div");
            bar.className = "page-loading-bar";
            document.body.appendChild(bar);
        }
        return bar;
    }

    function showPageLoadingBar() {
        const bar = getBar();
        bar.classList.remove("active");
        void bar.offsetWidth;
        bar.classList.add("active");
    }

    window.addEventListener("pagehide", showPageLoadingBar);
    window.addEventListener("beforeunload", showPageLoadingBar);

    document.addEventListener("click", (e) => {
        const link = e.target.closest("a[href]");
        if (!link) return;
        const href = link.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
        if (link.target === "_blank" || e.defaultPrevented || e.metaKey || e.ctrlKey) return;

        const destination = new URL(href, window.location.href);
        if (destination.pathname === window.location.pathname && destination.search === window.location.search) {
            e.preventDefault();
            return;
        }

        showPageLoadingBar();
    });
})();

(function () {
    const BATTLE_STATE_KEY = "skuling_battle_state";
    const BATTLE_HISTORY_KEY = "skuling_battle_last_result";
    const BATTLE_RESULT_READY_KEY = "skuling_battle_result_ready";
    const OPPONENT_MIN_DELAY_MS = 15000;
    const OPPONENT_MAX_DELAY_MS = 40000;
    const RESULT_DELTAS = { win: 110, lose: -65, draw: 23 };
    const USER_RATING = 1500;
    const OPPONENT_RATING = 2142;
    const INDO_MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    function loadPendingBattleState() {
        try {
            const raw = sessionStorage.getItem(BATTLE_STATE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function savePendingBattleState(state) {
        try {
            sessionStorage.setItem(BATTLE_STATE_KEY, JSON.stringify(state));
        } catch (e) {  }
    }

    function isDone(results) {
        return results.every(r => r !== null);
    }

    function computeGuaranteedVerdict(state) {
        const total = state.userResults.length;
        const userAnswered = state.userResults.filter(r => r !== null).length;
        const userCorrect = state.userResults.filter(r => r === "correct").length;
        const opponentAnswered = state.opponentResults.filter(r => r !== null).length;
        const opponentCorrect = state.opponentResults.filter(r => r === "correct").length;
        const userMaxPossible = userCorrect + (total - userAnswered);
        const opponentMaxPossible = opponentCorrect + (total - opponentAnswered);
        if (opponentMaxPossible < userCorrect) return "win";
        if (userMaxPossible < opponentCorrect) return "lose";
        return null;
    }

    function elapsedLabel(timestamps, quizStart) {
        if (!timestamps || !timestamps.length || !quizStart) return "00:00";
        const last = timestamps[timestamps.length - 1];
        const s = Math.max(0, Math.round((last - quizStart) / 1000));
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    }

    function getRespondent() {
        try {
            const draft = JSON.parse(localStorage.getItem("skuling_kenalan_draft") || "{}");
            return {
                name: draft["full-name"] && draft["full-name"].trim() ? draft["full-name"].trim() : "Responden",
                school: draft["school"] && draft["school"].trim() ? draft["school"].trim() : "-",
            };
        } catch (e) {
            return { name: "Responden", school: "-" };
        }
    }

    function finalizePendingBattle(state) {
        state.finished = true;
        savePendingBattleState(state);

        const total = state.userResults.length;
        const userCorrect = state.userResults.filter(r => r === "correct").length;
        const userWrong = state.userResults.filter(r => r === "wrong").length;
        const userSkipped = total - userCorrect - userWrong;
        const opponentCorrect = state.opponentResults.filter(r => r === "correct").length;
        const opponentWrong = state.opponentResults.filter(r => r === "wrong").length;
        const opponentSkipped = total - opponentCorrect - opponentWrong;

        let outcome = "draw";
        if (userCorrect > opponentCorrect) outcome = "win";
        else if (userCorrect < opponentCorrect) outcome = "lose";

        const userDelta = outcome === "draw" ? RESULT_DELTAS.draw : (outcome === "win" ? RESULT_DELTAS.win : RESULT_DELTAS.lose);
        const opponentDelta = outcome === "draw" ? RESULT_DELTAS.draw : (outcome === "win" ? RESULT_DELTAS.lose : RESULT_DELTAS.win);

        const respondent = getRespondent();
        const now = new Date();
        const record = {
            dateISO: now.toISOString(),
            dateLabel: `${INDO_MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`,
            opponentName: "Kak Aji",
            opponentRating: OPPONENT_RATING,
            userRating: USER_RATING,
            respondentName: respondent.name,
            respondentSchool: respondent.school,
            outcome, userCorrect, userWrong, userSkipped,
            opponentCorrect, opponentWrong, opponentSkipped,
            userDelta, opponentDelta,
            userTime: elapsedLabel(state.userTimestamps, state.quizStart),
            opponentTime: elapsedLabel(state.opponentTimestamps, state.quizStart),
            questions: (state.userChoices || []).map((choice, i) => ({
                subtest: "",
                userChoice: choice,
                userResult: state.userResults[i],
            })),
        };

        try { localStorage.setItem(BATTLE_HISTORY_KEY, JSON.stringify(record)); } catch (e) {  }
        try { localStorage.setItem(BATTLE_RESULT_READY_KEY, "1"); } catch (e) {  }
        renderBattleResultNotice();
    }

    function advancePendingBattle() {
        const page = document.body.dataset.page;
        if (page === "battle" || page === "battle-hasil") return;

        const state = loadPendingBattleState();
        if (!state || state.finished || !isDone(state.userResults)) return;

        let changed = false;
        while (true) {
            const oppIndex = state.opponentResults.findIndex(r => r === null);
            if (oppIndex === -1) break;
            if (!state.opponentNextDue || Date.now() < state.opponentNextDue) break;

            state.opponentResults[oppIndex] = state.opponentCorrectPattern[oppIndex] ? "correct" : "wrong";
            state.opponentTimestamps = state.opponentTimestamps || [];
            state.opponentTimestamps.push(state.opponentNextDue);
            changed = true;

            if (oppIndex + 1 >= state.opponentResults.length) {
                state.opponentNextDue = null;
                break;
            }
            state.opponentNextDue += OPPONENT_MIN_DELAY_MS + Math.random() * (OPPONENT_MAX_DELAY_MS - OPPONENT_MIN_DELAY_MS);
        }

        if (!changed) return;

        if (computeGuaranteedVerdict(state) || isDone(state.opponentResults)) {
            finalizePendingBattle(state);
        } else {
            savePendingBattleState(state);
        }
    }

    function removeBattleProgressToast() {
        const toast = document.querySelector(".battle-progress-toast");
        if (toast) toast.remove();
    }

    function renderBattleProgressToast() {
        const page = document.body.dataset.page;
        if (page === "battle" || page === "battle-hasil") {
            removeBattleProgressToast();
            return;
        }

        const isReady = localStorage.getItem(BATTLE_RESULT_READY_KEY) === "1";
        const state = isReady ? null : loadPendingBattleState();
        const isWaiting = !isReady && state && !state.finished &&
            isDone(state.userResults) && !isDone(state.opponentResults);

        if (!isReady && !isWaiting) {
            removeBattleProgressToast();
            return;
        }

        let toast = document.querySelector(".battle-progress-toast");
        if (!toast) {
            toast = document.createElement("button");
            toast.type = "button";
            toast.className = "battle-progress-toast";
            toast.innerHTML =
                '<span class="battle-progress-toast-left">' +
                '<span class="material-symbols-outlined battle-progress-toast-icon" aria-hidden="true"></span>' +
                '<span class="battle-progress-toast-label"></span>' +
                '</span>' +
                '<span class="battle-progress-toast-count"></span>';
            document.body.appendChild(toast);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => toast.classList.add("visible"));
            });
        }

        const icon = toast.querySelector(".battle-progress-toast-icon");
        const label = toast.querySelector(".battle-progress-toast-label");
        const count = toast.querySelector(".battle-progress-toast-count");

        if (isReady) {
            toast.classList.add("is-done");
            icon.textContent = "check_circle";
            label.textContent = "Battle done!";
            count.textContent = "View Results";
            toast.onclick = () => {
                try { localStorage.removeItem(BATTLE_RESULT_READY_KEY); } catch (e) {  }
                removeBattleProgressToast();
                window.location.href = "battle-hasil.html";
            };
        } else {
            const total = state.opponentResults.length;
            const answered = state.opponentResults.filter(r => r !== null).length;
            toast.classList.remove("is-done");
            icon.textContent = "progress_activity";
            label.textContent = "Battle in progress...";
            count.textContent = `${answered}/${total}`;
            toast.onclick = null;
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        advancePendingBattle();
        renderBattleProgressToast();
        setInterval(() => {
            advancePendingBattle();
            renderBattleProgressToast();
        }, 7000);
    });
})();