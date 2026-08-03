document.body.dataset.page = "battle";

// QUESTIONS comes from scripts/battle-questions.js (loaded before this file),
// shared with pembahasan.html so both pages show identical question content.
const TOTAL_QUESTIONS = QUESTIONS.length;
const BATTLE_DURATION_S = 6 * 60;
const USER_RATING = 1500;
const OPPONENT_RATING = 2142;

// Exact stakes shown on the "Starting Soon" screen in Figma — not computed
// Elo, just fixed design values applied to whichever side wins/loses/draws.
const RESULT_DELTAS = { win: 110, lose: -65, draw: 23 };

// ============ RESPONDENT (from kenalan.html registration) ============
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

// ============ STATE ============
const state = {
    currentIndex: 0,
    userResults: new Array(TOTAL_QUESTIONS).fill(null), // 'correct' | 'wrong' | null
    userChoices: new Array(TOTAL_QUESTIONS).fill(null), // which letter (A-E) the user picked, for pembahasan.html
    opponentResults: new Array(TOTAL_QUESTIONS).fill(null),
    userTimestamps: [],
    opponentTimestamps: [],
    hintCount: typeof getHintCount === "function" ? getHintCount() : 0,
    fiftyCount: 0, // matches misi.js's BOOSTERS placeholder — 50:50 isn't live yet.
    timeLeft: BATTLE_DURATION_S,
    quizStart: null,
    finished: false,
    outcomeShown: false,
    outcomeDismissed: false, // true once the user picks "Jawab Sisa Soal" — never prompt again this battle
    timerInterval: null,
    opponentTimeoutId: null,
    opponentNextDue: null, // absolute timestamp Kak Aji's next answer is due
    opponentCorrectPattern: [], // which of the 10 questions Kak Aji gets right, decided upfront
};

// ============ PERSISTENCE (resume an in-progress battle after a refresh) ============
// sessionStorage (not localStorage) on purpose — a refresh mid-battle should
// resume exactly where it was, but a battle should never silently reappear
// in a brand-new tab/session days later.
const BATTLE_STATE_KEY = "skuling_battle_state";
const PERSISTED_FIELDS = [
    "currentIndex", "userResults", "userChoices", "opponentResults", "userTimestamps",
    "opponentTimestamps", "hintCount", "fiftyCount", "quizStart",
    "finished", "opponentNextDue", "outcomeDismissed", "opponentCorrectPattern",
];

function saveBattleState() {
    try {
        const snapshot = {};
        PERSISTED_FIELDS.forEach(key => { snapshot[key] = state[key]; });
        sessionStorage.setItem(BATTLE_STATE_KEY, JSON.stringify(snapshot));
    } catch (e) { /* storage unavailable — battle just won't survive a refresh */ }
}

function loadBattleState() {
    try {
        const raw = sessionStorage.getItem(BATTLE_STATE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function clearBattleState() {
    try { sessionStorage.removeItem(BATTLE_STATE_KEY); } catch (e) { /* ignore */ }
}

// ============ DOM REFS ============
const screenStarting = document.getElementById("screenStarting");
const screenQuiz = document.getElementById("screenQuiz");
const screenResult = document.getElementById("screenResult");
const timerText = document.getElementById("timerText");

const questionAreaEl = document.getElementById("questionArea");
const questionTitleEl = document.getElementById("question-title");
const questionNumberEl = document.getElementById("questionNumber");
const questionTextEl = document.getElementById("questionText");
const choiceFieldsetEl = document.getElementById("choiceFieldset");
const choiceFormEl = document.getElementById("choiceForm");
const btnLanjut = document.getElementById("btnLanjutBattle");
const btnHint = document.getElementById("btn-hint");
const btnFifty = document.getElementById("btn-fifty");
const btnHelp = document.getElementById("btn-help");

const userSquaresEl = document.getElementById("userSquares");
const userProgressTextEl = document.getElementById("userProgressText");
const opponentSquaresEl = document.getElementById("opponentSquares");
const opponentProgressTextEl = document.getElementById("opponentProgressText");

const infoOverlay = document.getElementById("info-overlay");
const outcomeOverlay = document.getElementById("outcome-overlay");
const outcomeCard = document.getElementById("outcomeCard");
const outcomeText = document.getElementById("outcomeText");

// ============ OVERLAY HELPERS ============
function showOverlay(overlay) {
    overlay.style.display = "flex";
    overlay.classList.remove("hiding");
    overlay.classList.add("visible");
}

function hideOverlay(overlay) {
    overlay.classList.add("hiding");
    overlay.addEventListener("animationend", () => {
        overlay.classList.remove("visible", "hiding");
        overlay.style.display = "none";
    }, { once: true });
}

// ============ STARTING SOON — subtes roll ============
const ALL_SUBTES = [
    "Penalaran Umum",
    "Pengetahuan Kuantitatif",
    "Pengetahuan dan Pemahaman Umum",
    "Pemahaman Bacaan dan Menulis",
    "Literasi Bahasa Indonesia",
    "Literasi Bahasa Inggris",
    "Penalaran Matematika",
];
const FINAL_SUBTES = ["Penalaran Umum", "Literasi Bahasa Inggris"];
const SUBTES_ROLL_DURATION_MS = 2000;

function initStartingScreen() {
    const respondent = getRespondent();
    document.getElementById("userNameLabel").textContent = respondent.name;
    document.getElementById("userSchoolLabel").textContent = respondent.school;
    document.getElementById("userAvatar").textContent = respondent.name.trim().charAt(0).toUpperCase() || "R";
    runSubjectRoll();
}

// Flashes rapidly through every SNBT subtest for ~2s (accelerating tick,
// slowing right before it lands), then locks onto finalValue.
function rollOneSubtes(targetEl, finalValue, onDone) {
    const start = Date.now();

    function tick() {
        const elapsed = Date.now() - start;
        if (elapsed >= SUBTES_ROLL_DURATION_MS) {
            targetEl.textContent = finalValue;
            onDone();
            return;
        }
        targetEl.textContent = ALL_SUBTES[Math.floor(Math.random() * ALL_SUBTES.length)];
        const remaining = SUBTES_ROLL_DURATION_MS - elapsed;
        const intervalMs = remaining < 350 ? 90 : remaining < 900 ? 60 : 40;
        setTimeout(tick, intervalMs);
    }
    tick();
}

function runSubjectRoll() {
    const row1 = document.getElementById("subtesName1");
    const row2 = document.getElementById("subtesName2");
    rollOneSubtes(row1, FINAL_SUBTES[0], () => {
        setTimeout(() => {
            rollOneSubtes(row2, FINAL_SUBTES[1], () => {
                setTimeout(beginQuiz, 700);
            });
        }, 300);
    });
}

// ============ QUIZ ============
function beginQuiz() {
    screenStarting.setAttribute("hidden", "");
    screenQuiz.removeAttribute("hidden");

    state.quizStart = Date.now();
    state.opponentCorrectPattern = buildOpponentCorrectPattern();
    renderUserSquares();
    renderOpponentSquares();
    renderQuestion(0);
    setPowerupCount(btnHint, state.hintCount);
    setPowerupCount(btnFifty, state.fiftyCount);

    state.timerInterval = setInterval(tickTimer, 1000);
    scheduleOpponentAnswer(0);
    saveBattleState();
}

// Restores an in-progress (or just-finished) battle after a page refresh,
// skipping the starting-soon screen and jumping straight back in.
function resumeFromSaved(saved) {
    PERSISTED_FIELDS.forEach(key => { state[key] = saved[key]; });

    screenStarting.setAttribute("hidden", "");
    renderUserSquares();
    renderOpponentSquares();

    if (state.finished) {
        screenQuiz.setAttribute("hidden", "");
        screenResult.removeAttribute("hidden");
        renderResult();
        return;
    }

    screenQuiz.removeAttribute("hidden");
    const nextIndex = state.userResults.findIndex(r => r === null);
    renderQuestion(nextIndex === -1 ? TOTAL_QUESTIONS - 1 : nextIndex);
    setPowerupCount(btnHint, state.hintCount);
    setPowerupCount(btnFifty, state.fiftyCount);

    const elapsedS = Math.floor((Date.now() - state.quizStart) / 1000);
    state.timeLeft = BATTLE_DURATION_S - elapsedS;
    if (state.timeLeft <= 0) {
        finishBattle();
        return;
    }
    timerText.textContent = formatTime(state.timeLeft);
    state.timerInterval = setInterval(tickTimer, 1000);

    const opponentIndex = state.opponentResults.findIndex(r => r === null);
    if (opponentIndex !== -1) {
        const remainingDelay = Math.max(0, (state.opponentNextDue || Date.now()) - Date.now());
        scheduleOpponentAnswer(opponentIndex, remainingDelay);
    }

    // The early-end popup itself doesn't survive a refresh — just let the
    // check re-run on the next answer so it can resurface if still true.
    checkGuaranteedOutcome();
}

function formatTime(totalSeconds) {
    const s = Math.max(0, totalSeconds);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function tickTimer() {
    state.timeLeft--;
    timerText.textContent = formatTime(state.timeLeft);
    if (state.timeLeft <= 0) {
        clearInterval(state.timerInterval);
        finishBattle();
    }
}

function renderQuestion(index) {
    state.currentIndex = index;
    const q = QUESTIONS[index];

    questionTitleEl.textContent = q.subtest;
    questionNumberEl.textContent = `#${index + 1}`;

    questionTextEl.innerHTML = q.paragraphs.map(p => `<p>${p}</p>`).join("") +
        '<p class="pem-hint-text" id="hintText" hidden></p>';

    choiceFieldsetEl.innerHTML = '<legend class="sr-only">Pilih jawaban yang benar</legend>' +
        q.choices.map(c => `
            <label class="pem-choice">
                <input type="radio" name="jawaban-battle" value="${c.value}">
                <span class="pem-choice__letter" aria-hidden="true">${c.value}</span>
                <span class="pem-choice__text">${c.text}</span>
            </label>
        `).join("");

    updateLanjutState();

    questionAreaEl.classList.remove("bm-question-transition");
    void questionAreaEl.offsetWidth;
    questionAreaEl.classList.add("bm-question-transition");
}

function hasAnswer() {
    return !!choiceFormEl.querySelector('input[type="radio"]:checked');
}

function updateLanjutState() {
    btnLanjut.disabled = !hasAnswer();
}

choiceFormEl.addEventListener("change", updateLanjutState);

btnLanjut.addEventListener("click", () => {
    if (!hasAnswer()) return;
    const selected = choiceFormEl.querySelector("input:checked").value;
    const q = QUESTIONS[state.currentIndex];
    state.userResults[state.currentIndex] = selected === q.correct ? "correct" : "wrong";
    state.userChoices[state.currentIndex] = selected;
    state.userTimestamps.push(Date.now());
    renderUserSquares();
    saveBattleState();

    const nextIndex = state.userResults.findIndex(r => r === null);
    if (checkGuaranteedOutcome()) return; // overlay takes over; don't auto-advance yet

    if (nextIndex === -1) {
        finishBattle();
    } else {
        renderQuestion(nextIndex);
    }
});

// ============ POWER-UPS ============
function disablePowerup(btn) {
    btn.classList.add("is-used");
    btn.disabled = true;
}

function setPowerupCount(btn, count) {
    const countEl = btn.querySelector(".bm-powerup__count");
    if (countEl) countEl.textContent = String(count);
    if (count <= 0) disablePowerup(btn);
}

btnHint.addEventListener("click", () => {
    if (state.hintCount <= 0) return;
    state.hintCount--;
    setPowerupCount(btnHint, state.hintCount);
    const hintEl = document.getElementById("hintText");
    hintEl.textContent = QUESTIONS[state.currentIndex].hint;
    hintEl.hidden = false;
    saveBattleState();
});

btnFifty.addEventListener("click", () => {
    if (state.fiftyCount <= 0) return;
    state.fiftyCount--;
    setPowerupCount(btnFifty, state.fiftyCount);
    const q = QUESTIONS[state.currentIndex];
    choiceFormEl.querySelectorAll(".pem-choice").forEach(choice => {
        const input = choice.querySelector('input[type="radio"]');
        if (!q.fiftyKeep.includes(input.value)) choice.classList.add("pem-choice--faded");
    });
    saveBattleState();
});

function updateInfoPopupCounts() {
    document.getElementById("info-count-hint").textContent = String(state.hintCount);
    document.getElementById("info-count-fifty").textContent = String(state.fiftyCount);
}

btnHelp.addEventListener("click", () => {
    updateInfoPopupCounts();
    showOverlay(infoOverlay);
});
document.getElementById("info-close").addEventListener("click", () => hideOverlay(infoOverlay));
document.getElementById("info-close-x").addEventListener("click", () => hideOverlay(infoOverlay));

// ============ OPPONENT AI ============
// Kak Aji answers fast (15-40s) and is still biased to get more wrong than
// right — so the battle has a good chance of resolving itself before the
// clock runs out — but he's a 2142-rated "star", so he's guaranteed a floor
// of correct answers rather than being able to roll near-zero.
const OPPONENT_MIN_CORRECT = 4;
const OPPONENT_MAX_CORRECT = 6;

function buildOpponentCorrectPattern() {
    const correctCount = OPPONENT_MIN_CORRECT +
        Math.floor(Math.random() * (OPPONENT_MAX_CORRECT - OPPONENT_MIN_CORRECT + 1));
    const pattern = new Array(TOTAL_QUESTIONS).fill(false).fill(true, 0, correctCount);
    for (let i = pattern.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pattern[i], pattern[j]] = [pattern[j], pattern[i]];
    }
    return pattern;
}

function scheduleOpponentAnswer(index, overrideDelay) {
    if (index >= TOTAL_QUESTIONS || state.finished) return;
    const delay = overrideDelay != null ? overrideDelay : 15000 + Math.random() * 25000; // 15-40s
    state.opponentNextDue = Date.now() + delay;
    saveBattleState();
    state.opponentTimeoutId = setTimeout(() => {
        if (state.finished) return;
        const correct = state.opponentCorrectPattern[index];
        state.opponentResults[index] = correct ? "correct" : "wrong";
        state.opponentTimestamps.push(Date.now());
        renderOpponentSquares();
        saveBattleState();
        checkGuaranteedOutcome();
        // Kak Aji keeps answering in the background even while the outcome
        // popup is up — it only blocks the user's own input, not the sim.
        scheduleOpponentAnswer(index + 1);
    }, delay);
}

function renderSquares(container, progressEl, results) {
    const answered = results.filter(r => r !== null).length;
    progressEl.textContent = `${answered}/${TOTAL_QUESTIONS}`;
    container.innerHTML = results.map(r => {
        if (r === "correct") return '<span class="bm-square bm-square--correct"><span class="material-symbols-outlined">check</span></span>';
        if (r === "wrong") return '<span class="bm-square bm-square--wrong"><span class="material-symbols-outlined">close</span></span>';
        return '<span class="bm-square"></span>';
    }).join("");
}

function renderUserSquares() {
    renderSquares(userSquaresEl, userProgressTextEl, state.userResults);
}

function renderOpponentSquares() {
    renderSquares(opponentSquaresEl, opponentProgressTextEl, state.opponentResults);
}

// ============ GUARANTEED-OUTCOME CHECK ============
// If one side's maximum possible final score can no longer catch up to the
// other side's current score, the result is already decided — offer to end
// the battle early instead of grinding through the remaining questions.
function checkGuaranteedOutcome() {
    if (state.outcomeDismissed || state.finished) return false;
    if (state.outcomeShown) return true; // popup already open, waiting on the user's choice

    const userAnswered = state.userResults.filter(r => r !== null).length;
    const userCorrect = state.userResults.filter(r => r === "correct").length;
    const opponentAnswered = state.opponentResults.filter(r => r !== null).length;
    const opponentCorrect = state.opponentResults.filter(r => r === "correct").length;

    const userMaxPossible = userCorrect + (TOTAL_QUESTIONS - userAnswered);
    const opponentMaxPossible = opponentCorrect + (TOTAL_QUESTIONS - opponentAnswered);

    let verdict = null;
    if (opponentMaxPossible < userCorrect) verdict = "win";
    else if (userMaxPossible < opponentCorrect) verdict = "lose";

    if (!verdict) return false;

    state.outcomeShown = true;
    showOutcomeOverlay(verdict, userCorrect, opponentCorrect, userAnswered);
    return true;
}

function showOutcomeOverlay(verdict, userCorrect, opponentCorrect, userAnswered) {
    outcomeCard.classList.remove("is-win", "is-lose");
    outcomeCard.classList.add(verdict === "win" ? "is-win" : "is-lose");

    const remaining = TOTAL_QUESTIONS - userAnswered;
    const youWrong = state.userResults.filter(r => r === "wrong").length;
    const opponentWrong = state.opponentResults.filter(r => r === "wrong").length;

    // Mirrors the exact Figma copy: "Sejauh ini, lawan kamu salah 7 soal,
    // sedangkan kamu sudah benar 4 soal. Jadi, kamu otomatis menang."
    if (verdict === "win") {
        outcomeText.innerHTML =
            `Sejauh ini, lawan kamu <strong class="bm-bad">salah ${opponentWrong} soal</strong>, ` +
            `sedangkan kamu sudah <strong class="bm-good">benar ${userCorrect} soal</strong>. ` +
            `Jadi, kamu <strong class="bm-good">otomatis menang</strong>. ` +
            `<br><br>Kamu bisa memilih untuk tetap lanjut ke ${remaining} soal yang belum terjawab, atau menyudahi Battle-nya di sini.`;
    } else {
        outcomeText.innerHTML =
            `Sejauh ini, kamu sudah <strong class="bm-bad">salah ${youWrong} soal</strong>, ` +
            `sedangkan lawan kamu sudah <strong class="bm-good">benar ${opponentCorrect} soal</strong>. ` +
            `Jadi, kamu <strong class="bm-bad">otomatis kalah</strong>. ` +
            `<br><br>Kamu bisa memilih untuk tetap lanjut ke ${remaining} soal yang belum terjawab, atau menyudahi Battle-nya di sini.`;
    }
    showOverlay(outcomeOverlay);
}

document.getElementById("btnContinuePlaying").addEventListener("click", () => {
    hideOverlay(outcomeOverlay);
    state.outcomeShown = false;
    state.outcomeDismissed = true; // the outcome is already decided — don't ask again
    saveBattleState();
    const nextIndex = state.userResults.findIndex(r => r === null);
    if (nextIndex === -1) finishBattle();
    else renderQuestion(nextIndex);
});

document.getElementById("btnFinishNow").addEventListener("click", () => {
    hideOverlay(outcomeOverlay);
    finishBattle();
});

// ============ FINISH / RESULT ============
function finishBattle() {
    if (state.finished) return;
    state.finished = true;
    clearInterval(state.timerInterval);
    if (state.opponentTimeoutId) clearTimeout(state.opponentTimeoutId);
    // Defensive: the timer can hit 0 while the outcome popup is still open.
    [outcomeOverlay, infoOverlay].forEach(o => {
        o.classList.remove("visible", "hiding");
        o.style.display = "none";
    });

    screenQuiz.setAttribute("hidden", "");
    screenResult.removeAttribute("hidden");
    renderResult();
    saveBattleState(); // keep the finished snapshot so a refresh shows the same result
}

function elapsedLabel(timestamps) {
    if (!timestamps.length || !state.quizStart) return "00:00";
    const last = timestamps[timestamps.length - 1];
    return formatTime(Math.round((last - state.quizStart) / 1000));
}

function ratingLabel(base, delta) {
    return `${base + delta} (${delta >= 0 ? "+" : ""}${delta})`;
}

function renderResult() {
    const userCorrect = state.userResults.filter(r => r === "correct").length;
    const userWrong = state.userResults.filter(r => r === "wrong").length;
    const userSkipped = TOTAL_QUESTIONS - userCorrect - userWrong;

    const opponentCorrect = state.opponentResults.filter(r => r === "correct").length;
    const opponentWrong = state.opponentResults.filter(r => r === "wrong").length;
    const opponentSkipped = TOTAL_QUESTIONS - opponentCorrect - opponentWrong;

    let outcome = "draw";
    if (userCorrect > opponentCorrect) outcome = "win";
    else if (userCorrect < opponentCorrect) outcome = "lose";

    const userDelta = outcome === "draw" ? RESULT_DELTAS.draw : (outcome === "win" ? RESULT_DELTAS.win : RESULT_DELTAS.lose);
    const opponentDelta = outcome === "draw" ? RESULT_DELTAS.draw : (outcome === "win" ? RESULT_DELTAS.lose : RESULT_DELTAS.win);

    const screenResultEl = screenResult;
    screenResultEl.classList.remove("bm-result--win", "bm-result--lose", "bm-result--draw");
    screenResultEl.classList.add(`bm-result--${outcome}`);

    const titleMap = { win: "You WIN!", lose: "You LOSE!", draw: "Draw!" };
    document.getElementById("resultTitle").textContent = titleMap[outcome];

    // Cards are colored by fixed identity: user is always green, opponent always red.
    const userCard = document.getElementById("resultUserCard");
    const opponentCard = document.getElementById("resultOpponentCard");
    [userCard, opponentCard].forEach(c => c.classList.remove("bm-result-card--green", "bm-result-card--red", "bm-result-card--blue"));
    userCard.classList.add("bm-result-card--green");
    opponentCard.classList.add("bm-result-card--red");

    const respondent = getRespondent();
    document.getElementById("resultUserName").textContent = respondent.name;
    document.getElementById("resultUserAvatar").textContent = respondent.name.trim().charAt(0).toUpperCase() || "R";

    document.getElementById("resultUserTime").textContent = elapsedLabel(state.userTimestamps);
    document.getElementById("resultUserCorrect").textContent = String(userCorrect);
    document.getElementById("resultUserWrong").textContent = String(userWrong);
    document.getElementById("resultUserSkipped").textContent = String(userSkipped);
    document.getElementById("resultUserRating").textContent = ratingLabel(USER_RATING, userDelta);

    document.getElementById("resultOpponentTime").textContent = elapsedLabel(state.opponentTimestamps);
    document.getElementById("resultOpponentCorrect").textContent = String(opponentCorrect);
    document.getElementById("resultOpponentWrong").textContent = String(opponentWrong);
    document.getElementById("resultOpponentSkipped").textContent = String(opponentSkipped);
    document.getElementById("resultOpponentRating").textContent = ratingLabel(OPPONENT_RATING, opponentDelta);

    persistBattleHistory({
        outcome, respondent,
        userCorrect, userWrong, userSkipped,
        opponentCorrect, opponentWrong, opponentSkipped,
        userDelta, opponentDelta,
        userTime: elapsedLabel(state.userTimestamps),
        opponentTime: elapsedLabel(state.opponentTimestamps),
    });
}

// ============ HISTORY PERSISTENCE (for insight.html / battle-hasil.html / pembahasan.html) ============
// localStorage (not sessionStorage) on purpose — unlike the in-progress
// battle state, a completed battle's result should still show up on the
// Insight page in a brand-new tab/session, not just this one.
const BATTLE_HISTORY_KEY = "skuling_battle_last_result";
const INDO_MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatIndoDate(date) {
    return `${INDO_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function persistBattleHistory(summary) {
    const now = new Date();
    const record = {
        dateISO: now.toISOString(),
        dateLabel: formatIndoDate(now),
        opponentName: "Kak Aji",
        opponentRating: OPPONENT_RATING,
        userRating: USER_RATING,
        respondentName: summary.respondent.name,
        respondentSchool: summary.respondent.school,
        outcome: summary.outcome,
        userCorrect: summary.userCorrect,
        userWrong: summary.userWrong,
        userSkipped: summary.userSkipped,
        opponentCorrect: summary.opponentCorrect,
        opponentWrong: summary.opponentWrong,
        opponentSkipped: summary.opponentSkipped,
        userDelta: summary.userDelta,
        opponentDelta: summary.opponentDelta,
        userTime: summary.userTime,
        opponentTime: summary.opponentTime,
        // Enough per-question detail for pembahasan.html to review each soal.
        questions: QUESTIONS.map((q, i) => ({
            subtest: q.subtest,
            userChoice: state.userChoices[i],
            userResult: state.userResults[i],
        })),
    };
    try {
        localStorage.setItem(BATTLE_HISTORY_KEY, JSON.stringify(record));
    } catch (e) { /* storage unavailable — history just won't be recorded */ }
}

document.getElementById("btnBattleAgain").addEventListener("click", () => {
    clearBattleState();
    window.location.href = "battle-stars.html";
});

// ============ INIT ============
// A refresh mid-battle (or right after finishing) resumes instead of
// restarting from the starting-soon screen.
const savedBattle = loadBattleState();
if (savedBattle && savedBattle.quizStart) {
    resumeFromSaved(savedBattle);
} else {
    initStartingScreen();
}
