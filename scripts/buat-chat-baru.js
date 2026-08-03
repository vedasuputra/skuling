document.getElementById("bcbBackBtn")?.addEventListener("click", () => {
    window.history.back();
});

// Same roster as the leaderboard, minus the signed-in user — reused so the
// avatars/schools stay consistent across the app instead of inventing a
// second fake dataset. Only vedasuputra is part of the chat scenario.
const FRIENDS = [
    { name: "Reni Hasanah", username: "renihasanah", school: "SMA TERPADU RIYADLUL HUDA", tier: "purple", img: "./img/leaderboard-3-reni-hasanah.png" },
    { name: "A.A. Gede Pramananda Kusuma Yasa", username: "agedepramananda", school: "SMAN 1 DENPASAR", tier: "gold", img: "./img/leaderboard-4-aa-gede-pramananda-kusuma-yasa.png" },
    { name: "Handika Yudistira Pratama", username: "handikayudistira", school: "MAN 1 BEKASI", tier: "purple", img: "./img/leaderboard-8-handika-yudistira-pratama.png" },
    { name: "Sonia Zahrotun Nisa", username: "soniazahrotun", school: "MAN 3 JOMBANG", tier: "blue", img: "./img/leaderboard-12-sonia-zahrotun-nisa.png" },
    { name: "Yunita Ika Rahma", username: "yunitaikarahma", school: "SMAN 6 DENPASAR", tier: "gold", img: "./img/leaderboard-10-yunita-ika-rahma.png" },
    { name: "Sabiq Maqil Raza Oetomo", username: "sabiqmaqil", school: "MAN 2 KUDUS", tier: "purple", img: "./img/leaderboard-6-sabiq-maqil-raza-oetomo.png" },
    { name: "Aditiya Widodo Putra", username: "aditiyawidodo", school: "SMKN 8 SEMARANG", tier: "blue", img: "./img/leaderboard-2-aditiya-widodo-putra.png" },
    { name: "Yang Wulandini", username: "yangwulandini", school: "SMAN 20 SURABAYA", tier: "blue", img: "./img/leaderboard-9-yang-wulandini.png" },
    { name: "Riffatz Arbi Ananta", username: "riffatzarbi", school: "SMAN 1 SINGOSARI", tier: "blue", img: "./img/leaderboard-7-riffatz-arbi-ananta.png" },
    { name: "Miftah Adyatma Halim", username: "miftahadyatma", school: "SMAN JOGOROTO", tier: "gold", img: "./img/leaderboard-1-miftah-adyatma-halim.png" },
    { name: "Samuel Jowan Nalle", username: "samueljowan", school: "SMAN 1 TAMBUN UTARA", tier: "gold", img: "./img/leaderboard-5-samuel-jowan-nalle.png" },
    { name: "Veda Suputra", username: "vedasuputra", school: "SMAN 1 DENPASAR", tier: "gold", initials: "VS" }
];

const LAST_ACTIVE_DATE = "Jul 31, 2026";

function renderFriendList(query) {
    const list = document.getElementById("friendList");
    if (!list) return;

    const q = query.trim().toLowerCase();
    // Veda Suputra only shows up once actually searched for — not in the
    // default/unfiltered list — so the flow only reveals him through search.
    const filtered = q
        ? FRIENDS.filter(f => f.name.toLowerCase().includes(q) || f.username.toLowerCase().includes(q))
        : FRIENDS.filter(f => f.username !== "vedasuputra");

    if (!filtered.length) {
        list.innerHTML = `<p class="friend-row-empty">Tidak ada teman yang ditemukan.</p>`;
        return;
    }

    list.innerHTML = filtered.map(f => {
        const isScenario = f.username === "vedasuputra";
        const avatar = f.initials
            ? `<span class="friend-row-avatar friend-row-avatar--initials">${f.initials}</span>`
            : `<img class="friend-row-avatar" src="${f.img}" alt="">`;
        return `
        <button type="button" class="friend-row" data-username="${f.username}" ${isScenario ? "" : "data-not-in-scenario"} aria-label="${f.name}">
            ${avatar}
            <span class="friend-row-info">
                <span class="friend-row-name-row">
                    <img class="friend-row-badge" src="./img/leaderboard-badge-${f.tier}.png" alt="">
                    <span class="friend-row-name">${f.name}</span>
                </span>
                <span class="friend-row-school">${f.school}</span>
            </span>
            <span class="friend-row-date">${LAST_ACTIVE_DATE}</span>
        </button>`;
    }).join("");

    list.querySelectorAll("[data-username='vedasuputra']").forEach(row => {
        row.addEventListener("click", () => {
            window.location.href = "chatroom.html";
        });
    });
}

const searchInput = document.getElementById("friendSearchInput");
searchInput?.addEventListener("input", (e) => renderFriendList(e.target.value));

renderFriendList("");
