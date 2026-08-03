const STORAGE_KEY = "skuling_impian_draft";

const kampusSelectedField = document.getElementById("kampusSelectedField");
const kampusSelectedValue = document.getElementById("kampusSelectedValue");
const changeKampusBtn = document.getElementById("changeKampusBtn");

const jurusanSection = document.getElementById("jurusanSection");
const jurusanSelectedField = document.getElementById("jurusanSelectedField");
const jurusanSelectedValue = document.getElementById("jurusanSelectedValue");
const changeJurusanBtn = document.getElementById("changeJurusanBtn");

const UNIVERSITIES = [
    "Institut Pertanian Bogor",
    "Institut Teknologi Bandung",
    "Institut Teknologi Sepuluh Nopember",
    "Universitas Airlangga",
    "Universitas Andalas",
    "Universitas Brawijaya",
    "Universitas Diponegoro",
    "Universitas Gadjah Mada",
    "Universitas Hasanuddin",
    "Universitas Indonesia",
    "Universitas Jenderal Soedirman",
    "Universitas Negeri Malang",
    "Universitas Negeri Semarang",
    "Universitas Negeri Yogyakarta",
    "Universitas Padjadjaran",
    "Universitas Pendidikan Ganesha",
    "Universitas Pendidikan Indonesia",
    "Universitas Sebelas Maret",
    "Universitas Sumatera Utara",
    "Universitas Udayana"
];
const CORRECT_KAMPUS = "Universitas Pendidikan Ganesha";

const JURUSAN_UNDIKSHA = [
    "Akuntansi",
    "Desain Komunikasi Visual",
    "Ilmu Hukum",
    "Ilmu Keolahragaan",
    "Manajemen",
    "Pendidikan Bahasa Bali",
    "Pendidikan Bahasa Inggris",
    "Pendidikan Dokter",
    "Pendidikan Guru Sekolah Dasar",
    "Pendidikan IPA",
    "Pendidikan Matematika",
    "Pendidikan Teknik Informatika",
    "Sistem Informasi",
    "Teknik Elektro"
];
const CORRECT_JURUSAN = "Sistem Informasi";
const state = { kampus: null, jurusan: null };

const kampusPicker = document.getElementById("kampusPicker");
const kampusSearch = document.getElementById("kampusSearch");
const kampusList = document.getElementById("kampusList");
const kampusHidden = document.getElementById("nama-kampus");

const jurusanPicker = document.getElementById("jurusanPicker");
const jurusanSearch = document.getElementById("jurusanSearch");
const jurusanList = document.getElementById("jurusanList");
const jurusanHidden = document.getElementById("nama-jurusan");

const revealCard = document.getElementById("revealCard");
const lanjutBtn = document.getElementById("lanjutBtn");
const kampusForm = document.getElementById("kampus-form");

function showToast(message) {
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span class="toast-icon" aria-hidden="true">info</span><span class="toast-message"></span>`;
    toast.querySelector(".toast-message").textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("visible"));
    setTimeout(() => {
        toast.classList.remove("visible");
        toast.addEventListener("transitionend", () => toast.remove(), { once: true });
    }, 2500);
}

function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
}

function renderKampusList(filter = "") {
    const term = filter.trim().toLowerCase();
    const filtered = UNIVERSITIES.filter(u => u.toLowerCase().includes(term));
    kampusList.innerHTML = "";
    if (filtered.length === 0) {
        const li = document.createElement("li");
        li.className = "no-results";
        li.textContent = "Kampus tidak ditemukan";
        kampusList.appendChild(li);
        return;
    }
    filtered.forEach(name => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = name;
        btn.setAttribute("role", "option");
        btn.setAttribute("aria-selected", String(state.kampus === name));
        btn.addEventListener("click", () => handleKampusClick(name));
        li.appendChild(btn);
        kampusList.appendChild(li);
    });
}

function handleKampusClick(name) {
    if (name !== CORRECT_KAMPUS) {
        showToast("Bukan bagian dari skenario tugas, coba lagi.");
        return;
    }
    state.kampus = name;
    kampusHidden.value = name;

    kampusPicker.hidden = true;
    kampusSelectedValue.textContent = name;
    kampusSelectedField.hidden = false;

    jurusanSection.hidden = false;
    renderJurusanList();

    saveToStorage();
    checkComplete();
}

function renderJurusanList(filter = "") {
    const term = filter.trim().toLowerCase();
    const filtered = JURUSAN_UNDIKSHA.filter(j => j.toLowerCase().includes(term));
    jurusanList.innerHTML = "";
    if (filtered.length === 0) {
        const li = document.createElement("li");
        li.className = "no-results";
        li.textContent = "Jurusan tidak ditemukan";
        jurusanList.appendChild(li);
        return;
    }
    filtered.forEach(name => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = name;
        btn.setAttribute("role", "option");
        btn.setAttribute("aria-selected", String(state.jurusan === name));
        btn.addEventListener("click", () => handleJurusanClick(name));
        li.appendChild(btn);
        jurusanList.appendChild(li);
    });
}

function handleJurusanClick(name) {
    if (name !== CORRECT_JURUSAN) {
        showToast("Bukan bagian dari skenario tugas, coba lagi.");
        return;
    }
    state.jurusan = name;
    jurusanHidden.value = name;

    jurusanPicker.hidden = true;
    jurusanSelectedValue.textContent = name;
    jurusanSelectedField.hidden = false;

    revealCard.hidden = false;

    saveToStorage();
    checkComplete();
}

changeKampusBtn.addEventListener("click", () => {
    kampusSelectedField.hidden = true;
    kampusPicker.hidden = false;
    kampusSearch.value = "";
    renderKampusList();
    kampusSearch.focus();

    state.kampus = null;
    state.jurusan = null;
    kampusHidden.value = "";
    jurusanHidden.value = "";
    jurusanSection.hidden = true;
    jurusanSelectedField.hidden = true;
    jurusanPicker.hidden = false;
    revealCard.hidden = true;

    saveToStorage();
    checkComplete();
});

changeJurusanBtn.addEventListener("click", () => {
    jurusanSelectedField.hidden = true;
    jurusanPicker.hidden = false;
    jurusanSearch.value = "";
    renderJurusanList();
    jurusanSearch.focus();

    state.jurusan = null;
    jurusanHidden.value = "";
    revealCard.hidden = true;

    saveToStorage();
    checkComplete();
});

function checkComplete() {
    lanjutBtn.disabled = !(state.kampus && state.jurusan);
}

function loadFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    let data;
    try {
        data = JSON.parse(raw);
    } catch {
        return;
    }

    if (data.kampus === CORRECT_KAMPUS) {
        state.kampus = data.kampus;
        kampusHidden.value = data.kampus;
        kampusPicker.hidden = true;
        kampusSelectedValue.textContent = data.kampus;
        kampusSelectedField.hidden = false;
        jurusanSection.hidden = false;
        renderJurusanList();
    }

    if (data.jurusan === CORRECT_JURUSAN) {
        state.jurusan = data.jurusan;
        jurusanHidden.value = data.jurusan;
        jurusanPicker.hidden = true;
        jurusanSelectedValue.textContent = data.jurusan;
        jurusanSelectedField.hidden = false;
        revealCard.hidden = false;
    }
}

kampusSearch.addEventListener("input", () => renderKampusList(kampusSearch.value));
jurusanSearch.addEventListener("input", () => renderJurusanList(jurusanSearch.value));

kampusForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (lanjutBtn.disabled) {
        showToast("Mohon pilih kampus dan jurusan terlebih dahulu.");
        return;
    }
    clearStorage();
    window.location.href = "misi-besar.html";
});

renderKampusList();
loadFromStorage();
checkComplete();