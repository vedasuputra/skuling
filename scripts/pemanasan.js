const soal1 = document.getElementById('soal-1');
const soal2 = document.getElementById('soal-2');
const btnLanjut = document.getElementById('btn-lanjutkan');
const form1 = document.getElementById('form-soal-1');
const form2 = document.getElementById('form-soal-2');
const hasilOverlay = document.getElementById('hasil-overlay');
const infoOverlay = document.getElementById('info-overlay');
const navBtn1s2 = document.getElementById('nav-btn-1-s2');

const btnHint = document.getElementById('btn-hint');
const btnFifty = document.getElementById('btn-fifty');
const btnSkip = document.getElementById('btn-skip');
const btnHelp = document.getElementById('btn-help');

const CORRECT_ANSWER = { 1: 'D', 2: 'D' };
const FIFTY_KEEP = ['D', 'B'];

const HINTS = {
    1: 'Petunjuk: ubah dulu pernyataan pertama jadi bentuk "jika ... maka ...", lalu cari kontraposisinya.',
    2: 'Petunjuk: kalau premis "jika P maka Q dan R" benar, dan P terbukti benar, maka Q dan R otomatis berlaku (modus ponens).',
};

const HASIL_TEXT = {
    0: 'Belum pas nih, tapi nggak masalah — ini baru pemanasan! Yuk lanjut belajar bareng Skuling biar makin jago baca soal penalaran kayak gini.',
    1: 'Kamu punya modal berpikir yang kuat. Tinggal nutup beberapa celah kecil yang bikin jawabanmu kadang meleset. Dengan latihan yang konsisten, kamu bakal naik level lebih cepat dari yang kamu kira!',
    2: 'Mantap, dua-duanya bener! Logika berpikirmu udah kuat banget. Yuk terus diasah bareng Skuling biar makin tajam lagi.',
};

let currentSoal = 1;
let hintCount = 1;
let fiftyCount = 1;
let skipCount = 1;
const results = { 1: null, 2: null };

function hasAnswer(form) {
    return !!form.querySelector('input[type="radio"]:checked');
}

function updateBtn() {
    const activeForm = currentSoal === 1 ? form1 : form2;
    btnLanjut.disabled = !hasAnswer(activeForm);
}

form1.addEventListener('change', updateBtn);
form2.addEventListener('change', updateBtn);

function disablePowerup(btn) {
    btn.classList.add('is-used');
    btn.disabled = true;
}

function setPowerupCount(btn, count) {
    const countEl = btn.querySelector('.pem-powerup__count');
    if (countEl) countEl.textContent = String(count);
    if (count <= 0) disablePowerup(btn);
}

function setNavBadge(result) {
    navBtn1s2.classList.remove('pem-nav-btn--done', 'pem-nav-btn--wrong', 'pem-nav-btn--skip');
    let icon = 'check';
    let label = 'Soal 1 dijawab benar';

    if (result === 'correct') {
        navBtn1s2.classList.add('pem-nav-btn--done');
    } else if (result === 'wrong') {
        navBtn1s2.classList.add('pem-nav-btn--wrong');
        icon = 'close';
        label = 'Soal 1 dijawab salah';
    } else {
        navBtn1s2.classList.add('pem-nav-btn--skip');
        icon = 'skip_next';
        label = 'Soal 1 dilewati';
    }

    navBtn1s2.innerHTML = `<span class="material-symbols-outlined">${icon}</span>`;
    navBtn1s2.setAttribute('aria-label', label);
}

function computeScore() {
    return Object.values(results).filter(r => r === 'correct').length;
}

const SCORE_CLASS = { 0: 'hasil-score--bad', 1: 'hasil-score--mid', 2: 'hasil-score--good' };

function showHasil() {
    const score = computeScore();
    const scoreEl = document.querySelector('.hasil-score');
    scoreEl.textContent = `${score}/2 Benar`;
    scoreEl.classList.remove('hasil-score--bad', 'hasil-score--mid', 'hasil-score--good');
    scoreEl.classList.add(SCORE_CLASS[score]);
    document.querySelector('.hasil-body .pemanasan-text').textContent = HASIL_TEXT[score];

    hasilOverlay.style.display = 'flex';
    hasilOverlay.classList.remove('hiding');
    hasilOverlay.classList.add('visible');
}

function hideHasil() {
    hasilOverlay.classList.add('hiding');
    hasilOverlay.addEventListener('animationend', () => {
        hasilOverlay.classList.remove('visible', 'hiding');
        hasilOverlay.style.display = 'none';
    }, { once: true });
}

function recordAndAdvance(soalNum, result) {
    results[soalNum] = result;

    if (soalNum === 1) {
        setNavBadge(result);
        soal1.setAttribute('hidden', '');
        soal2.removeAttribute('hidden');
        currentSoal = 2;
        updateBtn();
        btnLanjut.querySelector('span').textContent = 'Lihat Hasilku';
    } else {
        showHasil();
    }
}

document.getElementById('hasil-lanjut').addEventListener('click', () => {
    window.location.href = 'fitur.html';
});

btnLanjut.addEventListener('click', () => {
    const activeForm = currentSoal === 1 ? form1 : form2;
    const selected = activeForm.querySelector('input:checked');
    const result = selected && selected.value === CORRECT_ANSWER[currentSoal] ? 'correct' : 'wrong';
    recordAndAdvance(currentSoal, result);
});

btnHint.addEventListener('click', () => {
    if (hintCount <= 0) return;
    hintCount--;
    setPowerupCount(btnHint, hintCount);

    const hintEl = document.getElementById(currentSoal === 1 ? 'hint-text-1' : 'hint-text-2');
    hintEl.textContent = HINTS[currentSoal];
    hintEl.hidden = false;
});

btnFifty.addEventListener('click', () => {
    if (fiftyCount <= 0) return;
    fiftyCount--;
    setPowerupCount(btnFifty, fiftyCount);

    const activeForm = currentSoal === 1 ? form1 : form2;
    activeForm.querySelectorAll('.pem-choice').forEach(choice => {
        const input = choice.querySelector('input[type="radio"]');
        if (!FIFTY_KEEP.includes(input.value)) {
            choice.classList.add('pem-choice--faded');
        }
    });
});

btnSkip.addEventListener('click', () => {
    if (skipCount <= 0) return;
    skipCount--;
    setPowerupCount(btnSkip, skipCount);
    recordAndAdvance(currentSoal, 'skipped');
});

function updateInfoPopupCounts() {
    document.getElementById('info-count-hint').textContent = String(hintCount);
    document.getElementById('info-count-skip').textContent = String(skipCount);
    document.getElementById('info-count-fifty').textContent = String(fiftyCount);
}

function showInfo() {
    updateInfoPopupCounts();
    infoOverlay.style.display = 'flex';
    infoOverlay.classList.remove('hiding');
    infoOverlay.classList.add('visible');
}

function hideInfo() {
    infoOverlay.classList.add('hiding');
    infoOverlay.addEventListener('animationend', () => {
        infoOverlay.classList.remove('visible', 'hiding');
        infoOverlay.style.display = 'none';
    }, { once: true });
}

btnHelp.addEventListener('click', showInfo);
document.getElementById('info-close').addEventListener('click', hideInfo);
document.getElementById('info-close-x').addEventListener('click', hideInfo);
infoOverlay.addEventListener('click', (e) => {
    if (e.target === infoOverlay) hideInfo();
});
