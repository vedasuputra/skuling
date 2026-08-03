document.body.dataset.page = "pembahasan";

const BATTLE_HISTORY_KEY = "skuling_battle_last_result";

function getLastBattleResult() {
    try {
        const raw = localStorage.getItem(BATTLE_HISTORY_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function renderReview() {
    const record = getLastBattleResult();
    if (!record) {
        window.location.href = "insight.html";
        return;
    }

    const qRecord = (record.questions && record.questions[0]) || { userChoice: null, userResult: null };
    const isCorrect = qRecord.userResult === "correct";

    document.getElementById("pmbCard").classList.toggle("is-wrong", !isCorrect);
    document.getElementById("pmbCardBadgeIcon").textContent = isCorrect ? "check" : "close";

    if (qRecord.userChoice && qRecord.userChoice !== "D") {
        const wrongChoiceEl = document.getElementById(`pmbChoice${qRecord.userChoice}`);
        if (wrongChoiceEl) wrongChoiceEl.classList.add("pmb-choice--wrong-pick");
    }
}

const proOverlay = document.getElementById("pro-overlay");

function showProOverlay() {
    proOverlay.style.display = "flex";
    proOverlay.classList.remove("hiding");
    proOverlay.classList.add("visible");
}

function hideProOverlay() {
    proOverlay.classList.add("hiding");
    proOverlay.addEventListener("animationend", () => {
        proOverlay.classList.remove("visible", "hiding");
        proOverlay.style.display = "none";
    }, { once: true });
}

document.getElementById("pro-close-x").addEventListener("click", hideProOverlay);
proOverlay.addEventListener("click", (e) => {
    if (e.target === proOverlay) hideProOverlay();
});

["pmbNav2", "pmbNav3", "pmbNav4", "pmbNav5", "pmbNavMore", "pmbNextBtn"].forEach(id => {
    document.getElementById(id).addEventListener("click", showProOverlay);
});

document.getElementById("pmbNav1").addEventListener("click", () => { });

document.addEventListener("DOMContentLoaded", renderReview);
