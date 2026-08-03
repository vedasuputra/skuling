document.body.dataset.page = "beranda";

const MATERI = [
    { title: "Level Up! Dari Teks Biasa ke Teks Kritis", subtitle: "Bahasa Inggris Tingkat Lanjut", parts: 7, minutes: 29, progress: 0, img: "./img/materi-bahasa-inggris.png" },
    { title: "PPKn di TKA!", subtitle: "Pendidikan Pancasila dan Kewarganegaraan", parts: 8, minutes: 53, progress: 0, img: "./img/materi-ppkn.png" },
    { title: "Introduction TKA Bahasa Arab", subtitle: "Bahasa Arab", parts: 3, minutes: 20, progress: 0, img: "./img/materi-bahasa-arab.png" },
    { title: "Matematika Tingkat Lanjut di TKA", subtitle: "Matematika Tingkat Lanjut", parts: 6, minutes: 33, progress: 0, img: "./img/materi-matematika-lanjut.png" },
    { title: "Tiga Kompetensi Utama", subtitle: "Bahasa Indonesia", parts: 4, minutes: 23, progress: 0, locked: true, img: "./img/materi-bahasa-indonesia.png" },
    { title: "Menaklukkan Teks Informasi", subtitle: "Bahasa Indonesia", parts: 10, minutes: 54, progress: 0, locked: true, img: "./img/materi-bahasa-indonesia.png" },
    { title: "Menyelami Dunia Teks Fiksi", subtitle: "Bahasa Indonesia", parts: 2, minutes: 20, progress: 0, locked: true, img: "./img/materi-bahasa-indonesia.png" }
];

function renderMateriList() {
    const container = document.getElementById("materiList");
    if (!container) return;

    container.innerHTML = MATERI.map(m => {
        const isLocked = m.locked;
        return `
        <button type="button" class="materi-card ${isLocked ? 'locked' : ''}" aria-label="${m.title}">
            <div class="${isLocked ? 'materi-card-thumb' : ''}">
                <img src="${m.img}" alt="" class="materi-card-img">
                ${isLocked ? `
                <div class="materi-card-blur-overlay">
                    <span class="material-symbols-outlined icon-lock-sm" aria-hidden="true">lock</span>
                    <span class="materi-lock-badge">
                        <span>Skuling<span class="pro-text">Pro</span></span>
                    </span>
                </div>` : ''}
            </div>
            <div class="materi-card-body">
                <span class="materi-card-title">${m.title}</span>
                <span class="materi-card-subtitle">${m.subtitle}</span>
                <div class="materi-card-meta-row">
                    <span class="materi-meta-item">
                        <span class="material-symbols-outlined icon-xs" aria-hidden="true">dns</span>
                        ${m.parts} bagian
                    </span>
                    <span class="materi-meta-item">
                        <span class="material-symbols-outlined icon-xs" aria-hidden="true">schedule</span>
                        ${m.minutes} menit
                    </span>
                    <div class="materi-progress-group">
                        <span class="materi-progress-label">${m.progress}%</span>
                        <div class="materi-progress-track">
                            <div class="materi-progress-fill" style="width: ${m.progress}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </button>`;
    }).join("");
}

renderMateriList();

document.querySelectorAll(".materi-card").forEach(card => {
    card.addEventListener("click", () => showToast(NOT_IN_SCENARIO_MSG));
});

document.getElementById("mandiriBtn")?.addEventListener("click", () => showToast(NOT_IN_SCENARIO_MSG));
document.getElementById("kedinasanBtn")?.addEventListener("click", () => showToast(NOT_IN_SCENARIO_MSG));
document.getElementById("snbtBtn")?.addEventListener("click", () => showToast(NOT_IN_SCENARIO_MSG));

document.getElementById("tkaBtn")?.addEventListener("click", () => {
    window.location.href = "tka.html";
});

document.getElementById("battleStarsBtn")?.addEventListener("click", () => {
    window.location.href = "battle-stars.html";
});