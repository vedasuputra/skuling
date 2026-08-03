function renderSummaryCards() {
    const container = document.getElementById("summaryList");
    if (!container) return;

    container.innerHTML = MATERI_SECTIONS.map(section => `
        <article class="summary-card" data-section-index="${section.number}" data-section-title="${section.title}">
            <header class="summary-card-header">
                <h2 class="summary-card-title">${section.title}</h2>
                <span class="summary-card-number">#${section.number}</span>
            </header>
            <div class="summary-card-content">
                <p>${section.intro}</p>
                <ul class="summary-bullets">
                    ${section.bullets.map(bullet => `
                        <li>
                            <strong>${bullet.label}</strong>
                            <span>${bullet.desc}</span>
                        </li>
                    `).join("")}
                </ul>
                <p>${section.closing}</p>
            </div>
        </article>
    `).join("");
}

function renderProgress() {
    const fill = document.querySelector(".progress-strip-fill");
    if (fill) fill.style.width = getMateriProgress() + "%";
}

function renderFilterDropdown() {
    const dropdown = document.getElementById("filterDropdown");
    if (!dropdown) return;

    const overviewRow = `
        <button type="button" class="filter-dropdown-row is-active" data-jump-index="0">
            <span>#0 Ringkasan Tiap Materi</span>
        </button>
    `;

    const sectionRows = MATERI_SECTIONS.map(section => {
        const unlocked = isSectionUnlocked(section.number);
        return `
            <button type="button" class="filter-dropdown-row${unlocked ? "" : " is-locked"}"
                data-jump-index="${section.number}" data-unlocked="${unlocked}">
                <span>#${section.number} ${section.title}</span>
                ${unlocked ? "" : `<span class="material-symbols-outlined" aria-hidden="true">lock</span>`}
            </button>
        `;
    }).join("");

    dropdown.innerHTML = overviewRow + sectionRows;
}

function bindFilterDropdown() {
    const btn = document.getElementById("filterBarBtn");
    const dropdown = document.getElementById("filterDropdown");
    const scrollEl = document.querySelector(".ringkasan-materi");
    if (!btn || !dropdown || !scrollEl) return;

    function closeDropdown() {
        dropdown.hidden = true;
        btn.setAttribute("aria-expanded", "false");
    }

    function openDropdown() {
        renderFilterDropdown();
        dropdown.hidden = false;
        btn.setAttribute("aria-expanded", "true");
    }

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (dropdown.hidden) {
            openDropdown();
        } else {
            closeDropdown();
        }
    });

    dropdown.addEventListener("click", (e) => {
        const row = e.target.closest(".filter-dropdown-row");
        if (!row) return;

        const index = Number(row.dataset.jumpIndex);

        if (index === 0) {
            scrollEl.scrollTo({ top: 0, behavior: "smooth" });
            closeDropdown();
            return;
        }

        if (row.dataset.unlocked === "true") {
            window.location.href = `./materi-section.html?section=${index}`;
        } else {
            showToast(`Selesaikan "${getPrerequisiteLabel(index)}" terlebih dahulu.`);
        }
    });

    document.addEventListener("click", (e) => {
        if (!dropdown.hidden && !dropdown.contains(e.target) && !btn.contains(e.target)) {
            closeDropdown();
        }
    });
}

function bindStartLearning() {
    const btn = document.getElementById("startLearningBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
        markSectionVisited(1);
        window.location.href = "./materi-section.html?section=1";
    });
}

function bindBackButton() {
    const backBtn = document.querySelector(".back-btn");
    if (!backBtn) return;
    backBtn.addEventListener("click", () => {
        window.location.href = "./bahasa-indonesia.html";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderSummaryCards();
    renderProgress();
    bindFilterDropdown();
    bindStartLearning();
    bindBackButton();
});
