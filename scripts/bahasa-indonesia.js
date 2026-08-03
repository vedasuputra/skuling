const MODULES = [
    {
        title: "Mengenal Bahasa Indonesia di TKA ",
        sections: 4,
        duration: "18 menit",
        progress: 0,
        img: "./img/module-mengenal-bahasa-indonesia.png",
        locked: false,
    },
    {
        title: "Tiga Kompetensi Utama",
        sections: 4,
        duration: "23 menit",
        progress: 0,
        img: "./img/module-tiga-kompetensi-utama.png",
        locked: true,
    },
    {
        title: "Menaklukkan Teks Informasi ",
        sections: 10,
        duration: "54 menit",
        progress: 0,
        img: "./img/module-teks-informasi.png",
        locked: true,
    },
    {
        title: "Menyelami Dunia Teks Fiksi ",
        sections: 2,
        duration: "20 menit",
        progress: 0,
        img: "./img/module-teks-fiksi.png",
        locked: true,
    },
];

function renderModules() {
    const container = document.getElementById("moduleList");
    if (!container) return;

    MODULES[0].progress = getMateriProgress();

    container.innerHTML = MODULES.map(module => {
        const tag = module.locked ? "button" : "a";
        const attrs = module.locked
            ? `type="button" data-not-in-scenario`
            : `href="./ringkasan-materi.html"`;
        return `
        <${tag} class="module-card btn-reset" ${attrs}
            aria-label="Buka ${module.title.trim()}, ${module.sections} bagian, ${module.duration}${module.locked ? ", terkunci" : ""}">
            <span class="module-card-thumb">
                <img src="${module.img}" alt="">
                ${module.locked ? `
                    <span class="module-card-lock">
                        <span class="material-symbols-outlined icon-lock" aria-hidden="true">lock</span>
                        <span class="module-card-lock-badge">Skuling<span class="pro-accent">Pro</span></span>
                    </span>
                ` : ""}
            </span>
            <span class="module-card-body">
                <span class="module-card-top">
                    <span class="module-card-title">${module.title}</span>
                    <span class="module-card-subtitle">Tes Kemampuan Akademik (TKA)</span>
                </span>
                <span class="module-card-meta">
                    <span class="module-card-meta-left">
                        <span class="module-card-meta-badge">
                            <span class="material-symbols-outlined icon-sm" aria-hidden="true">menu_book</span>
                            <span>${module.sections} bagian</span>
                        </span>
                        <span class="module-card-meta-badge">
                            <span class="material-symbols-outlined icon-sm" aria-hidden="true">schedule</span>
                            <span>${module.duration}</span>
                        </span>
                    </span>
                    <span class="module-card-progress">
                        <span class="module-card-progress-value">${module.progress}%</span>
                        <span class="module-card-progress-track">
                            <span class="module-card-progress-fill" style="width: ${module.progress}%"></span>
                        </span>
                    </span>
                </span>
            </span>
        </${tag}>
    `;}).join("");
}

function bindBackButton() {
    const backBtn = document.querySelector(".back-btn");
    if (!backBtn) return;
    backBtn.addEventListener("click", () => {
        if (document.referrer) {
            history.back();
        } else {
            window.location.href = "./tka.html";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderModules();
    bindBackButton();
});
