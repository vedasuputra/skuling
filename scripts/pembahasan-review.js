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

// Free users only ever get to review Soal 1 — everything else (2-5, "...",
// and the next arrow) is behind the SkulingPro paywall notice. Soal 1's
// question/choices/pembahasan are hardcoded directly in pembahasan.html (only
// one question ever shows here), so this just layers the actual
// correct/wrong state from the stored battle result on top of that.
function renderReview() {
    const record = getLastBattleResult();
    if (!record) {
        window.location.href = "insight.html";
        return;
    }

    // Falls back gracefully if an older record (saved before per-question
    // detail was tracked) is missing the `questions` array.
    const qRecord = (record.questions && record.questions[0]) || { userChoice: null, userResult: null };
    const isCorrect = qRecord.userResult === "correct";

    document.getElementById("pmbCard").classList.toggle("is-wrong", !isCorrect);
    document.getElementById("pmbCardBadgeIcon").textContent = isCorrect ? "check" : "close";

    if (qRecord.userChoice && qRecord.userChoice !== "D") {
        const wrongChoiceEl = document.getElementById(`pmbChoice${qRecord.userChoice}`);
        if (wrongChoiceEl) wrongChoiceEl.classList.add("pmb-choice--wrong-pick");
    }
}

// ============ SKULINGPRO PAYWALL OVERLAY ============
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

["pmbNav2", "pmbNav3", "pmbNav4", "pmbNav5", "pmbNavMore", "pmbNextBtn"].forEach(id => {
    document.getElementById(id).addEventListener("click", showProOverlay);
});
// Soal 1 is the one already showing — clicking it again is a no-op.
document.getElementById("pmbNav1").addEventListener("click", () => { });

document.addEventListener("DOMContentLoaded", renderReview);
