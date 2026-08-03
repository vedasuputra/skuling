document.getElementById("rankHelpIcon")?.addEventListener("click", () => {
    showToast("Bukan bagian dari skenario tugas, coba lagi.");
});

const LEADERBOARD = [
    { rank: 1, name: "Miftah Adyatma Halim", school: "SMAN JOGOROTO", score: 2288, tier: "gold", trend: "up", img: "./img/leaderboard-1-miftah-adyatma-halim.png" },
    { rank: 2, name: "Aditiya Widodo Putra", school: "SMKN 8 SEMARANG", score: 2142, tier: "blue", trend: "down", img: "./img/leaderboard-2-aditiya-widodo-putra.png" },
    { rank: 3, name: "Reni Hasanah", school: "SMA TERPADU RIYADLUL HUDA", score: 2122, tier: "purple", trend: "up", img: "./img/leaderboard-3-reni-hasanah.png" },
    { rank: 4, name: "A.A. Gede Pramananda Kusuma Yasa", school: "SMAN 1 DENPASAR", score: 2102, tier: "gold", trend: "up", img: "./img/leaderboard-4-aa-gede-pramananda-kusuma-yasa.png" },
    { rank: 5, name: "Samuel Jowan Nalle", school: "SMAN 1 TAMBUN UTARA", score: 1988, tier: "gold", trend: "down", img: "./img/leaderboard-5-samuel-jowan-nalle.png" },
    { rank: 6, name: "Sabiq Maqil Raza Oetomo", school: "MAN 2 KUDUS", score: 1934, tier: "purple", trend: "up", img: "./img/leaderboard-6-sabiq-maqil-raza-oetomo.png" },
    { rank: 7, name: "Riffatz Arbi Ananta", school: "SMAN 1 SINGOSARI", score: 1877, tier: "blue", trend: "down", img: "./img/leaderboard-7-riffatz-arbi-ananta.png" },
    { rank: 8, name: "Handika Yudistira Pratama", school: "MAN 1 BEKASI", score: 1867, tier: "purple", trend: "up", img: "./img/leaderboard-8-handika-yudistira-pratama.png" },
    { rank: 9, name: "Yang Wulandini", school: "SMAN 20 SURABAYA", score: 1866, tier: "blue", trend: "down", img: "./img/leaderboard-9-yang-wulandini.png" },
    { rank: 10, name: "Yunita Ika Rahma", school: "SMAN 1 NGADILUWIH KABUPATEN KEDIRI", score: 1820, tier: "gold", trend: "down", img: "./img/leaderboard-10-yunita-ika-rahma.png" },
    { rank: 11, name: "Rhaditya Kaindra Hartanto Cahaya Putra", school: "SMAN 3 BATAM", score: 1766, tier: "purple", trend: "up", img: "./img/leaderboard-11-rhaditya-kaindra-hartanto-ca.png" },
    { rank: 12, name: "Sonia Zahrotun Nisa", school: "MAN 3 JOMBANG", score: 1743, tier: "blue", trend: "down", img: "./img/leaderboard-12-sonia-zahrotun-nisa.png" },
    { rank: 13, name: "Noval Triady Silaban", school: "SMAN 17 BATAM", score: 1722, tier: "purple", trend: "up", img: "./img/leaderboard-13-noval-triady-silaban.png" },
    { rank: 14, name: "Tegar Aldiaksya Catur Agung", school: "MAN 1 KOTA MALANG", score: 1688, tier: "blue", trend: "down", img: "./img/leaderboard-14-tegar-aldiaksya-catur-agung.png" },
    { rank: 15, name: "Surya Fatahilah", school: "SMAS YADIKA SUMEDANG", score: 1650, tier: "blue", trend: "down", img: "./img/leaderboard-15-surya-fatahilah.png" }
];
function renderLeaderboard() {
    const list = document.getElementById("rankList");
    if (!list) return;

    list.innerHTML = LEADERBOARD.map(p => {
        const isMiftah = p.rank === 1;
        const topClass = p.rank <= 3 ? ` rank-row--top${p.rank}` : "";
        return `
        <button type="button" class="rank-row${topClass}" ${isMiftah ? "" : "data-not-in-scenario"} aria-label="${p.name}, peringkat ${p.rank}, ${p.score} poin">
            <span class="rank-row-number">${p.rank}</span>
            <span class="rank-row-avatar">
                <img class="rank-row-photo" src="${p.img}" alt="">
            </span>
            <span class="rank-row-info">
                <span class="rank-row-name-row">
                 <img class="rank-row-tier" src="./img/leaderboard-badge-${p.tier}.png" alt="">
                    <span class="rank-row-name">${p.name}</span>
                   
                </span>
                <span class="rank-row-school">${p.school}</span>
            </span>
            <span class="rank-row-score rank-row-score--${p.trend}">
                ${p.score}
                <span class="rank-row-trend rank-row-trend--${p.trend}">
                    <span class="material-symbols-outlined icon-xxs" aria-hidden="true">${p.trend === "up" ? "arrow_drop_up" : "arrow_drop_down"}</span>
                </span>
            </span>
        </button>`;
    }).join("");
}

renderLeaderboard();

document.getElementById("rankList")?.addEventListener("click", (e) => {
    const row = e.target.closest(".rank-row");
    if (row && !row.hasAttribute("data-not-in-scenario")) {
        window.location.href = "rank-profile.html";
    }
});
