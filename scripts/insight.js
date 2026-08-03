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

function renderBattleHistory() {
    const record = getLastBattleResult();
    const card = document.getElementById("insightHistory");
    if (!record) {
        card.hidden = true;
        return;
    }
    card.hidden = false;

    document.getElementById("historyDate").textContent = record.dateLabel;
    document.getElementById("historyOpponentRating").textContent = String(record.opponentRating);

    const outcomeLabel = { win: "WIN", lose: "LOSE", draw: "DRAW" }[record.outcome] || "DRAW";
    document.getElementById("historyOutcome").textContent = outcomeLabel;
    document.getElementById("historyRatingChange").textContent = ratingLabel(record.userRating, record.userDelta);

    const resultBtn = document.getElementById("historyResultBtn");
    resultBtn.classList.remove("is-lose", "is-draw");
    if (record.outcome === "lose") resultBtn.classList.add("is-lose");
    else if (record.outcome === "draw") resultBtn.classList.add("is-draw");
}

// The whole row opens the review page — battle-hasil.html is only reachable
// from the "Hasil Battle" pill inside pembahasan.html's own top bar.
["historyReviewBtn", "historyResultBtn"].forEach(id => {
    document.getElementById(id)?.addEventListener("click", () => {
        window.location.href = "pembahasan.html";
    });
});

document.addEventListener("DOMContentLoaded", renderBattleHistory);
