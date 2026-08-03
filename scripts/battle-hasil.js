document.body.dataset.page = "battle-hasil";

const BATTLE_HISTORY_KEY = "skuling_battle_last_result";

function getLastBattleResult() {
    try {
        const raw = localStorage.getItem(BATTLE_HISTORY_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function ratingLabel(base, delta) {
    return `${base + delta} (${delta >= 0 ? "+" : ""}${delta})`;
}

const INDO_MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatIndoDate(date) {
    return `${INDO_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function resolveResultDateLabel(record) {
    return record.dateLabel || formatIndoDate(new Date());
}

function renderResult() {
    const record = getLastBattleResult();
    if (!record) {

        window.location.href = "insight.html";
        return;
    }

    const screenResultEl = document.getElementById("screenResult");
    screenResultEl.classList.add(`bm-result--${record.outcome}`);

    const titleMap = { win: "You WIN!", lose: "You LOSE!", draw: "Draw!" };
    document.getElementById("resultTitle").textContent = titleMap[record.outcome] || "Hasil Battle";

    const userCard = document.getElementById("resultUserCard");
    const opponentCard = document.getElementById("resultOpponentCard");
    userCard.classList.add("bm-result-card--green");
    opponentCard.classList.add("bm-result-card--red");

    document.getElementById("resultUserName").textContent = record.respondentName;
    document.getElementById("resultUserAvatar").textContent = record.respondentName.trim().charAt(0).toUpperCase() || "R";

    document.getElementById("resultUserTime").textContent = record.userTime;
    document.getElementById("resultUserCorrect").textContent = String(record.userCorrect);
    document.getElementById("resultUserWrong").textContent = String(record.userWrong);
    document.getElementById("resultUserSkipped").textContent = String(record.userSkipped);
    document.getElementById("resultUserRating").textContent = ratingLabel(record.userRating, record.userDelta);

    document.getElementById("resultOpponentTime").textContent = record.opponentTime;
    document.getElementById("resultOpponentCorrect").textContent = String(record.opponentCorrect);
    document.getElementById("resultOpponentWrong").textContent = String(record.opponentWrong);
    document.getElementById("resultOpponentSkipped").textContent = String(record.opponentSkipped);
    document.getElementById("resultOpponentRating").textContent = ratingLabel(record.opponentRating, record.opponentDelta);
}

document.getElementById("btnBattleAgain").addEventListener("click", () => {
    window.location.href = "battle-stars.html";
});

document.addEventListener("DOMContentLoaded", () => {
    renderResult();
    try { localStorage.removeItem("skuling_battle_result_ready"); } catch (e) {  }
});
