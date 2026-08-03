const form = document.querySelector(".kenalan-form");
const googleBtn = document.getElementById("googleBtn");
const submitBtn = document.getElementById("submitBtn");

const validators = {
    "full-name": {
        test: v => v.trim().length >= 3 && v.trim().length <= 60 && /^[\p{L}\s.'-]+$/u.test(v),
        messages: {
            empty: "Wajib diisi",
            invalid: "Min. 3 huruf, tanpa angka/simbol"
        }
    },
    "username": {
        test: v => {
            const trimmed = v.trim();
            return trimmed.length >= 3 && trimmed.length <= 20 &&
                   !/\s/.test(v) && /^[a-zA-Z0-9._]+$/.test(v);
        },
        messages: {
            empty: "Wajib diisi",
            invalid: "Huruf/angka/./_  tanpa spasi"
        }
    },
    "phone": {
        test: v => {
            const digits = v.replace(/\D/g, "");
            return digits.length >= 10 && digits.length <= 14 && /^[0-9]+$/.test(v);
        },
        messages: {
            empty: "Wajib diisi",
            invalid: "10-14 digit angka (mis. 081234567001)"
        }
    },
    "email": {
        test: v => v.trim().length > 0 &&
                   v.trim().length <= 254 &&
                   /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
        messages: {
            empty: "Wajib diisi",
            invalid: "Format email tidak valid"
        }
    },
    "password": {
        test: v => v.length >= 8 && v.length <= 64 && !/\s/.test(v),
        messages: {
            empty: "Wajib diisi",
            invalid: "8-64 karakter, tanpa spasi"
        }
    }
};
function validateField(id) {
    const input = document.getElementById(id);
    const errorEl = document.getElementById(`${id}-error`);
    const streak = input.closest(".streak");
    const rule = validators[id];
    const value = input.value;

    const isValid = rule.test(value);

    if (isValid) {
        errorEl.textContent = "";
        errorEl.classList.remove("visible");
        streak.classList.remove("invalid");
    } else {
        errorEl.textContent = value.trim().length === 0
            ? rule.messages.empty
            : rule.messages.invalid;
        errorEl.classList.add("visible");
        streak.classList.add("invalid");
    }

    return isValid;
}

function checkFormValidity() {
    const allValid = Object.keys(validators).every(id => validateField(id));
    const otherRequired = Array.from(form.querySelectorAll("[required]"))
        .filter(el => !(el.id in validators))
        .every(el => el.value.trim().length > 0);

    submitBtn.disabled = !(allValid && otherRequired);
}

Object.keys(validators).forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("input", () => {
        validateField(id);
        checkFormValidity();
    });
    input.addEventListener("blur", () => {
        validateField(id);
        checkFormValidity();
    });
});

form.querySelectorAll("input:not([type=radio]), select").forEach(el => {
    el.addEventListener("input", () => {
        googleBtn.style.display = "none";
    }, { once: true });
});

checkFormValidity();

const passwordToggle = document.querySelector(".eye-closed");
const passwordIcon = passwordToggle.querySelector(".material-symbols-outlined");
const passwordInput = document.querySelector("#password");

passwordToggle.addEventListener("click", () => {
    const isVisible = passwordInput.type === "text";
    passwordInput.type = isVisible ? "password" : "text";
    passwordIcon.textContent = isVisible ? "visibility_off" : "visibility";
    passwordToggle.setAttribute("aria-pressed", String(!isVisible));
    passwordToggle.setAttribute("aria-label", isVisible ? "Tampilkan password" : "Sembunyikan password");
});

const PROVINCES = [
    "Aceh", "Bali", "Banten", "Bengkulu", "DI Yogyakarta", "DKI Jakarta",
    "Gorontalo", "Jambi", "Jawa Barat", "Jawa Tengah", "Jawa Timur",
    "Kalimantan Barat", "Kalimantan Selatan", "Kalimantan Tengah",
    "Kalimantan Timur", "Kalimantan Utara", "Kepulauan Bangka Belitung",
    "Kepulauan Riau", "Lampung", "Maluku", "Maluku Utara",
    "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Papua", "Papua Barat",
    "Papua Barat Daya", "Papua Pegunungan", "Papua Selatan", "Papua Tengah",
    "Riau", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tengah",
    "Sulawesi Tenggara", "Sulawesi Utara", "Sumatera Barat",
    "Sumatera Selatan", "Sumatera Utara"
];

const overlay = document.getElementById("sheetOverlay");
const sheet = document.getElementById("provinceSheet");
const trigger = document.getElementById("provinceTrigger");
const valueEl = document.getElementById("province-value");
const hiddenInput = document.getElementById("province");
const searchInput = document.getElementById("provinceSearch");
const listEl = document.getElementById("provinceList");
const closeBtn = document.getElementById("sheetClose");
const provinceErrorEl = document.getElementById("province-error");
const provinceStreak = trigger;

function renderList(filter = "") {
    const term = filter.trim().toLowerCase();
    const filtered = PROVINCES.filter(p => p.toLowerCase().includes(term));

    listEl.innerHTML = "";

    if (filtered.length === 0) {
        const li = document.createElement("li");
        li.className = "no-results";
        li.textContent = "Provinsi tidak ditemukan";
        listEl.appendChild(li);
        return;
    }

    filtered.forEach(p => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = p;
        btn.setAttribute("role", "option");
        btn.setAttribute("aria-selected", String(hiddenInput.value === p));
        btn.addEventListener("click", () => selectProvince(p));
        li.appendChild(btn);
        listEl.appendChild(li);
    });
}

function selectProvince(p) {
    hiddenInput.value = p;
    valueEl.textContent = p;
    valueEl.removeAttribute("data-placeholder");
    provinceStreak.classList.remove("invalid");
    provinceErrorEl.textContent = "";
    provinceErrorEl.classList.remove("visible");
    closeSheet();
    checkFormValidity();
    saveToStorage();   // tambahan

}

function openSheet() {
    overlay.hidden = false;
    document.body.classList.add("sheet-open");
    trigger.setAttribute("aria-expanded", "true");
    searchInput.value = "";
    renderList();
    setTimeout(() => searchInput.focus(), 50);
}

function closeSheet() {
    overlay.hidden = true;
    document.body.classList.remove("sheet-open");
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus();
}

trigger.addEventListener("click", openSheet);
closeBtn.addEventListener("click", closeSheet);
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeSheet();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) closeSheet();
});
searchInput.addEventListener("input", () => renderList(searchInput.value));

const gradeTrigger = document.getElementById("gradeTrigger");
const gradeValueEl = document.getElementById("grade-value");
const gradeHiddenInput = document.getElementById("grade");
const gradeList = document.getElementById("gradeList");

function openGradeDropdown() {
    gradeList.hidden = false;
    gradeTrigger.setAttribute("aria-expanded", "true");
}

function closeGradeDropdown() {
    gradeList.hidden = true;
    gradeTrigger.setAttribute("aria-expanded", "false");
}

gradeTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    gradeList.hidden ? openGradeDropdown() : closeGradeDropdown();
});

gradeList.querySelectorAll("button[role=option]").forEach(btn => {
    btn.addEventListener("click", () => {
        const value = btn.dataset.value;
        gradeHiddenInput.value = value;
        gradeValueEl.textContent = value;
        gradeValueEl.removeAttribute("data-placeholder");

        gradeList.querySelectorAll("button[role=option]").forEach(b =>
            b.setAttribute("aria-selected", String(b === btn))
        );

        closeGradeDropdown();
        checkFormValidity();
    });
});

document.addEventListener("click", (e) => {
    if (!gradeTrigger.contains(e.target) && !gradeList.contains(e.target)) {
        closeGradeDropdown();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !gradeList.hidden) closeGradeDropdown();
});

const STORAGE_KEY = "skuling_kenalan_draft";
const persistedFields = ["full-name", "username", "email", "school"];

function saveToStorage() {
    const data = {};

    persistedFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) data[id] = el.value;
    });

    data["province"] = document.getElementById("province").value;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

    persistedFields.forEach(id => {
        const el = document.getElementById(id);
        if (el && data[id]) {
            el.value = data[id];
        }
    });

    if (data["province"]) {
        const provinceHidden = document.getElementById("province");
        const provinceValueEl = document.getElementById("province-value");
        provinceHidden.value = data["province"];
        provinceValueEl.textContent = data["province"];
        provinceValueEl.removeAttribute("data-placeholder");
    }
}

loadFromStorage();
checkFormValidity();

persistedFields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener("input", saveToStorage);
    }
});

