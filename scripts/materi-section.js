function getSectionNumberFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const n = parseInt(params.get("section"), 10);
    if (!n || n < 1 || n > MATERI_LESSONS.length) return 1;
    return n;
}

// Groups a flat `lines` array (plain paragraphs + bullet items) into
// rendered HTML, collapsing consecutive bullet lines into one <ul>.
function renderLines(lines) {
    let html = "";
    let bulletBuffer = [];

    function flushBullets() {
        if (!bulletBuffer.length) return;
        html += `<ul class="materi-bullets">${bulletBuffer.map(line => `
            <li>
                ${line.label ? `<strong>${line.label}</strong> ` : ""}${line.text}
            </li>
        `).join("")}</ul>`;
        bulletBuffer = [];
    }

    for (const line of lines) {
        if (line.type === "bullet") {
            bulletBuffer.push(line);
        } else {
            flushBullets();
            html += `<p>${line.text}</p>`;
        }
    }
    flushBullets();
    return html;
}

function renderBlock(block) {
    if (block.type === "p") {
        return `<p>${block.text}</p>`;
    }
    if (block.type === "quote") {
        return `<div class="materi-box materi-box--quote">${renderLines(block.lines)}</div>`;
    }
    if (block.type === "card") {
        return `
            <div class="materi-box materi-box--card">
                <div class="materi-box-header">${block.title}</div>
                <div class="materi-box-content">${renderLines(block.lines)}</div>
            </div>
        `;
    }
    return "";
}

function renderMateriSection() {
    const sectionNumber = getSectionNumberFromUrl();
    const lesson = MATERI_LESSONS[sectionNumber - 1];
    const meta = MATERI_SECTIONS[sectionNumber - 1];

    markSectionVisited(sectionNumber);

    document.getElementById("filterBarLabel").innerHTML =
        `<span class="section-breadcrumb-index">#${meta.number}</span> ${meta.title}`;

    const content = document.getElementById("materiContent");
    content.innerHTML = `
        <div class="materi-headline-row">
            <h2 class="materi-headline">${lesson.headline}</h2>
            <button type="button" class="dengarkan-btn btn-reset" data-not-in-scenario>
                <span class="material-symbols-outlined" aria-hidden="true">play_arrow</span>
                Dengarkan Materi
            </button>
        </div>
        ${lesson.intro.map(p => `<p>${p}</p>`).join("")}
        ${lesson.blocks.map(renderBlock).join("")}
        <div class="materi-box materi-box--tip">
            <p class="materi-tip-title">${lesson.tip.title}</p>
            ${renderLines(lesson.tip.lines)}
        </div>
    `;

    document.getElementById("progressFill").style.width = getMateriProgress() + "%";

    const backBtn = document.getElementById("backSectionBtn");
    backBtn.innerHTML = sectionNumber === 1
        ? `<span class="materi-cta-index">#0</span> Back`
        : `<span class="materi-cta-index">#${sectionNumber - 1}</span> Back`;
    backBtn.addEventListener("click", () => {
        if (sectionNumber === 1) {
            window.location.href = "./ringkasan-materi.html";
        } else {
            window.location.href = `./materi-section.html?section=${sectionNumber - 1}`;
        }
    });

    const nextBtn = document.getElementById("nextSectionBtn");
    const isLast = sectionNumber === MATERI_LESSONS.length;
    nextBtn.innerHTML = isLast
        ? "Selesai Belajar"
        : `Next <span class="materi-cta-index">#${sectionNumber + 1}</span>`;
    nextBtn.addEventListener("click", () => {
        if (isLast) {
            markMateriCompleted();
            window.location.href = "./materi-selesai.html";
        } else {
            window.location.href = `./materi-section.html?section=${sectionNumber + 1}`;
        }
    });
}

function renderFilterDropdown(activeIndex) {
    const dropdown = document.getElementById("filterDropdown");
    if (!dropdown) return;

    const overviewRow = `
        <button type="button" class="filter-dropdown-row${activeIndex === 0 ? " is-active" : ""}" data-jump-index="0">
            <span>#0 Ringkasan Tiap Materi</span>
        </button>
    `;

    const sectionRows = MATERI_SECTIONS.map(section => {
        const unlocked = isSectionUnlocked(section.number);
        const isActive = section.number === activeIndex;
        const classes = ["filter-dropdown-row"];
        if (!unlocked) classes.push("is-locked");
        if (isActive) classes.push("is-active");
        return `
            <button type="button" class="${classes.join(" ")}"
                data-jump-index="${section.number}" data-unlocked="${unlocked}">
                <span>#${section.number} ${section.title}</span>
                ${unlocked ? "" : `<span class="material-symbols-outlined" aria-hidden="true">lock</span>`}
            </button>
        `;
    }).join("");

    dropdown.innerHTML = overviewRow + sectionRows;
}

function bindFilterDropdown(activeIndex) {
    const btn = document.getElementById("filterBarBtn");
    const dropdown = document.getElementById("filterDropdown");
    if (!btn || !dropdown) return;

    function closeDropdown() {
        dropdown.hidden = true;
        btn.setAttribute("aria-expanded", "false");
    }

    function openDropdown() {
        renderFilterDropdown(activeIndex);
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
            window.location.href = "./ringkasan-materi.html";
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

document.addEventListener("DOMContentLoaded", () => {
    const sectionNumber = getSectionNumberFromUrl();
    renderMateriSection();
    bindFilterDropdown(sectionNumber);
});
