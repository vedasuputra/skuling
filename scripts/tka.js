const SUBJECT_GROUPS = [
    {
        title: "Mata Pelajaran Wajib",
        subjects: [
            { name: "Matematika", modules: 30, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/581207d6-57d3-4e32-a832-3d7b1ca5ce77-1756107447446" },
            { name: "Bahasa Indonesia", modules: 4, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/02e862fd-bafa-4415-bef4-917b693ad8fa-1755657467987" },
            { name: "Bahasa Inggris", modules: 6, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/d9a8434b-c2ef-4c91-a12e-0faef1cb24f9-1755657388543" },
        ],
    },
    {
        title: "Ilmu Pengetahuan Alam (IPA)",
        subjects: [
            { name: "Fisika", modules: 39, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/9298e592-1de5-4a4f-b15c-3271328c10c1-1755758234376" },
            { name: "Kimia", modules: 33, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/13af281e-956f-485f-bcae-2efcb9095db7-1755855757408" },
            { name: "Biologi", modules: 31, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/b801def9-c14c-4cb2-a59d-7b500bdd9177-1755855783491" },
            { name: "Matematika Tingkat Lanjut", modules: 29, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/58032f72-696b-4f2a-9e68-247165069ec3-1756093706923" },
        ],
    },
    {
        title: "Ilmu Pengetahuan Sosial (IPS)",
        subjects: [
            { name: "Ekonomi", modules: 24, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/66dae476-4853-4a3f-99dd-35288cad2fbd-1755657404035" },
            { name: "Geografi", modules: 10, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/1a373561-92a5-4f94-9a0e-6225640add69-1755657431004" },
            { name: "Sosiologi", modules: 9, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/bc6ad9ac-317a-4c46-bf20-9db0df7c0def-1755657438357" },
            { name: "Sejarah", modules: 27, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/f6907206-b107-4a47-9b12-a6dbe5543939-1755657449936" },
            { name: "Antropologi", modules: 7, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/915bb85f-6fb5-4ed1-a613-5c7fed771258-1756392837467" },
        ],
    },
    {
        title: "Bahasa",
        subjects: [
            { name: "Bahasa Jerman", modules: 11, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/017f9328-bfbd-46da-a5fc-63422532c842-1756248053262" },
            { name: "Bahasa Arab", modules: 7, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/34fdd109-e16d-454f-901f-a72bf6601f7b-1757147200497" },
            { name: "Bahasa Jepang", modules: 12, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/e3943a01-d9fe-47d3-809f-4e0b3e41a803-1757147209539" },
            { name: "Bahasa Korea", modules: 12, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/0433ca23-810a-4cdc-8a11-3807cf2d16f7-1757147222002" },
            { name: "Bahasa Mandarin", modules: 7, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/1c250ae0-5da5-458a-bd79-645fd8d2e542-1757147235006" },
            { name: "Bahasa Prancis", modules: 13, img: "https://dyn-assets.skuling.id/skuling-storage/uploaded/file/f20b7cf7-5087-4838-9641-60b13d0d3a8f-1757147321452" },
        ],
    },
];

function renderSubjectGroups() {
    const container = document.getElementById("subjectGroups");
    if (!container) return;

    container.innerHTML = SUBJECT_GROUPS.map(group => `
        <div class="subject-group">
            <h2 class="subject-group-title">${group.title}</h2>
            <div class="subject-grid">
                ${group.subjects.map(subject => {
                    const isBahasaIndonesia = subject.name === "Bahasa Indonesia";
                    const tag = isBahasaIndonesia ? "a" : "button";
                    const attrs = isBahasaIndonesia
                        ? `href="./bahasa-indonesia.html"`
                        : `type="button" data-not-in-scenario`;
                    return `
                    <${tag} class="subject-card btn-reset" ${attrs}
                        aria-label="Buka ${subject.name}, ${subject.modules} modul">
                        <span class="subject-card-thumb">
                            <img src="${subject.img}" alt="">
                        </span>
                        <span class="subject-card-body">
                            <span class="subject-card-name">${subject.name}</span>
                            <span class="subject-card-meta">
                                <span class="subject-card-count">${subject.modules} Modul</span>
                            </span>
                        </span>
                    </${tag}>
                `;}).join("")}
            </div>
        </div>
    `).join("");
}

function bindBackButton() {
    const backBtn = document.querySelector(".back-btn");
    if (!backBtn) return;
    backBtn.addEventListener("click", () => {
        if (document.referrer) {
            history.back();
        } else {
            window.location.href = "./beranda.html";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderSubjectGroups();
    bindBackButton();
});
