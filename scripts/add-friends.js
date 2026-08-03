document.getElementById("afBackBtn")?.addEventListener("click", () => {
    window.history.back();
});

// Same roster used across chat/leaderboard — kept in sync there.
// Veda Suputra only appears once actually searched for, matching the
// chat "Buat Chat Baru" flow.
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

function addFriendButtonMarkup(username) {
    const attrs = username === "vedasuputra"
        ? `data-add-btn data-username="${username}" aria-label="Tambah Veda Suputra sebagai teman"`
        : `data-not-in-scenario aria-label="Tambah teman"`;
    return `
    <button type="button" class="add-friend-btn" ${attrs}>
        <span class="material-symbols-outlined add-friend-icon-plus" aria-hidden="true">add</span>
        <span class="material-symbols-outlined add-friend-icon-person" aria-hidden="true">person</span>
        <span class="material-symbols-outlined add-friend-icon-clock" aria-hidden="true">schedule</span>
    </button>`;
}

function renderFriendList(query) {
    const list = document.getElementById("friendList");
    if (!list) return;

    const q = query.trim().toLowerCase();
    const filtered = q
        ? FRIENDS.filter(f => f.name.toLowerCase().includes(q) || f.username.toLowerCase().includes(q))
        : FRIENDS.filter(f => f.username !== "vedasuputra");

    if (!filtered.length) {
        list.innerHTML = `<p class="friend-row-empty">Tidak ada teman yang ditemukan.</p>`;
        return;
    }

    list.innerHTML = filtered.map(f => {
        const avatar = f.initials
            ? `<span class="friend-row-avatar friend-row-avatar--initials">${f.initials}</span>`
            : `<img class="friend-row-avatar" src="${f.img}" alt="">`;
        return `
        <div class="friend-row" data-not-in-scenario aria-label="${f.name}">
            ${avatar}
            <span class="friend-row-info">
                <span class="friend-row-name-row">
                    <img class="friend-row-badge" src="./img/leaderboard-badge-${f.tier}.png" alt="">
                    <span class="friend-row-name">${f.name}</span>
                </span>
                <span class="friend-row-school">${f.school}</span>
            </span>
            ${addFriendButtonMarkup(f.username)}
        </div>`;
    }).join("");

    // Only the add button on Veda Suputra's row performs the real
    // add-friend action; everything else (the row itself, other rows'
    // add buttons) falls through to the global not-in-scenario toast.
    list.querySelector("[data-add-btn]")?.addEventListener("click", (e) => {
        e.stopPropagation();
        const btn = e.currentTarget;
        if (btn.classList.contains("add-friend-btn--pending")) return;
        btn.classList.add("add-friend-btn--pending");
        btn.setAttribute("aria-label", "Permintaan pertemanan terkirim ke Veda Suputra, menunggu persetujuan");
        showToast("Permintaan pertemanan terkirim, menunggu persetujuan Veda Suputra.");
    });
}

const searchInput = document.getElementById("friendSearchInput");
searchInput?.addEventListener("input", (e) => renderFriendList(e.target.value));

renderFriendList("");
