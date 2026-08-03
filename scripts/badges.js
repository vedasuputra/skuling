document.body.dataset.page = "badges";

// ============ FILTER DROPDOWN (same open/close pattern as materi-section.js) ============
const filterBtn = document.getElementById("bdgFilterBtn");
const filterDropdown = document.getElementById("bdgFilterDropdown");
const filterLabel = document.getElementById("bdgFilterLabel");
const categorySections = Array.from(document.querySelectorAll(".bdg-category"));

function closeFilterDropdown() {
    filterDropdown.hidden = true;
    filterBtn.setAttribute("aria-expanded", "false");
}

function openFilterDropdown() {
    filterDropdown.hidden = false;
    filterBtn.setAttribute("aria-expanded", "true");
}

filterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (filterDropdown.hidden) openFilterDropdown();
    else closeFilterDropdown();
});

filterDropdown.addEventListener("click", (e) => {
    const row = e.target.closest(".bdg-filter-row");
    if (!row) return;
    // Battle/Freestyle/General/Social/Streak are out of scenario — the global
    // data-not-in-scenario toast handles those; only actually filter for the
    // two that are in scope (Semua, Tryout).
    if (row.hasAttribute("data-not-in-scenario")) return;

    filterDropdown.querySelectorAll(".bdg-filter-row").forEach(r => r.classList.remove("is-active"));
    row.classList.add("is-active");
    filterLabel.textContent = row.textContent;

    const category = row.dataset.category;
    categorySections.forEach(section => {
        section.hidden = category !== "semua" && section.dataset.category !== category;
    });

    closeFilterDropdown();
});

// click-outside-to-close
document.addEventListener("click", (e) => {
    if (!filterDropdown.hidden && !filterDropdown.contains(e.target) && !filterBtn.contains(e.target)) {
        closeFilterDropdown();
    }
});

// ============ TRYOUT IMPROVEMENT STAR BADGE OVERLAY ============
const tryoutOverlay = document.getElementById("tryout-overlay");

function showTryoutOverlay() {
    tryoutOverlay.style.display = "flex";
    tryoutOverlay.classList.remove("hiding");
    tryoutOverlay.classList.add("visible");
}

function hideTryoutOverlay() {
    tryoutOverlay.classList.add("hiding");
    tryoutOverlay.addEventListener("animationend", () => {
        tryoutOverlay.classList.remove("visible", "hiding");
        tryoutOverlay.style.display = "none";
    }, { once: true });
}

document.getElementById("tryoutImprovementStarBtn").addEventListener("click", showTryoutOverlay);
document.getElementById("tryout-close-x").addEventListener("click", hideTryoutOverlay);
