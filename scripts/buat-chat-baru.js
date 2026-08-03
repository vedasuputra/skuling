document.getElementById("bcbBackBtn")?.addEventListener("click", () => {
    window.history.back();
});

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

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function buildFriendRows() {
    const list = document.getElementById("friendList");
    if (!list) return;

    list.innerHTML = FRIENDS.map(f => {
        const isScenario = f.username === "vedasuputra";
        const avatar = f.initials
            ? `<span class="friend-row-avatar friend-row-avatar--initials">${f.initials}</span>`
            : `<img class="friend-row-avatar" src="${f.img}" alt="">`;

        const lastMessage = f.username === "vedasuputra"
            ? localStorage.getItem("skuling_chat_vedasuputra_last")
            : null;
        const secondLine = lastMessage
            ? `<span class="friend-row-message-row">
                    <span class="material-symbols-outlined friend-row-check" aria-hidden="true">done_all</span>
                    <span class="friend-row-message">${escapeHtml(lastMessage)}</span>
                </span>`
            : `<span class="friend-row-school">${f.school}</span>`;
        return `
        <button type="button" class="friend-row" data-username="${f.username}" ${isScenario ? "" : "data-not-in-scenario"} aria-label="${f.name}">
            ${avatar}
            <span class="friend-row-info">
                <span class="friend-row-name-row">
                    <img class="friend-row-badge" src="./img/leaderboard-badge-${f.tier}.png" alt="">
                    <span class="friend-row-name">${f.name}</span>
                </span>
                ${secondLine}
            </span>
            <span class="friend-row-date">${LAST_ACTIVE_DATE}</span>
        </button>`;
    }).join("") + `<p class="friend-row-empty" id="friendListEmpty" hidden>Tidak ada teman yang ditemukan.</p>`;

    list.querySelectorAll("[data-username='vedasuputra']").forEach(row => {
        row.addEventListener("click", () => {
            window.location.href = "chatroom.html";
        });
    });
}

function filterFriendList(query) {
    const list = document.getElementById("friendList");
    if (!list) return;

    const q = query.trim().toLowerCase();
    let anyVisible = false;

    FRIENDS.forEach((f) => {
        const row = list.querySelector(`.friend-row[data-username="${f.username}"]`);
        if (!row) return;
        const matches = q
            ? f.name.toLowerCase().includes(q) || f.username.toLowerCase().includes(q)
            : f.username !== "vedasuputra";
        row.hidden = !matches;
        if (matches) anyVisible = true;
    });

    const emptyMsg = document.getElementById("friendListEmpty");
    if (emptyMsg) emptyMsg.hidden = anyVisible;
}

const searchInput = document.getElementById("friendSearchInput");
searchInput?.addEventListener("input", (e) => filterFriendList(e.target.value));

buildFriendRows();
filterFriendList("");
