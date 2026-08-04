document.body.dataset.page = "skulworld";

const joinSection = document.getElementById("skulworldJoin");
const lanjutkanBtn = document.getElementById("lanjutkanBtn");
const tabsSection = document.getElementById("skulworldTabs");

function enterTabsView() {
    joinSection.hidden = true;
    lanjutkanBtn.hidden = true;
    tabsSection.hidden = false;
}

const squadDetailOverlay = document.getElementById("squadDetailOverlay");
const squadDetailJoinBtn = document.getElementById("squadDetailJoinBtn");

function openSquadDetail() {
    squadDetailOverlay.style.display = "flex";
    squadDetailOverlay.classList.remove("hiding");
    squadDetailOverlay.classList.add("visible");
}
function closeSquadDetail() {
    squadDetailOverlay.classList.add("hiding");
    squadDetailOverlay.addEventListener("animationend", () => {
        squadDetailOverlay.classList.remove("visible", "hiding");
        squadDetailOverlay.style.display = "none";
    }, { once: true });
}

document.querySelector('[data-open-squad-detail="undiksha"]')?.addEventListener("click", openSquadDetail);
document.getElementById("squadDetailCloseBtn")?.addEventListener("click", closeSquadDetail);
squadDetailOverlay?.addEventListener("click", (e) => {
    if (e.target === squadDetailOverlay) closeSquadDetail();
});

function markUndikshaJoined() {
    joinSquad();

    const joinBtn = document.getElementById("joinUndikshaBtn");
    if (joinBtn) {
        joinBtn.textContent = "Joined";
        joinBtn.disabled = true;
    }
    squadDetailJoinBtn.textContent = "Joined";
    squadDetailJoinBtn.disabled = true;

    lanjutkanBtn.disabled = false;
    lanjutkanBtn.classList.add("skulworld-lanjutkan--enabled");
}

document.getElementById("joinUndikshaBtn")?.addEventListener("click", openSquadDetail);
squadDetailJoinBtn?.addEventListener("click", () => {
    markUndikshaJoined();
    closeSquadDetail();
});

lanjutkanBtn?.addEventListener("click", () => {
    if (lanjutkanBtn.disabled) return;
    enterTabsView();
});

(function () {
    const TABS = ["skulboard", "mysquad"];
    const SWIPE_THRESHOLD_RATIO = 0.18;
    const EDGE_RESISTANCE = 3;

    const viewport = document.getElementById("skulworldSwipeViewport");
    const track = document.getElementById("skulworldSwipeTrack");
    if (!viewport || !track) return;

    let current = 0;
    let dragging = false;
    let decided = false;
    let horizontal = false;
    let startX = 0;
    let startY = 0;
    let deltaX = 0;

    function updateActiveTab(index) {
        document.querySelectorAll("[data-swipe-tab]").forEach((tab) => {
            if (tab.dataset.swipeTab === TABS[index]) {
                tab.setAttribute("aria-current", "page");
            } else {
                tab.removeAttribute("aria-current");
            }
        });

        const lihatSquadBtn = document.getElementById("lihatSquadDiikutiBtn");
        if (lihatSquadBtn) {
            if (TABS[index] === "mysquad") {
                lihatSquadBtn.setAttribute("aria-current", "page");
            } else {
                lihatSquadBtn.removeAttribute("aria-current");
            }
        }
    }

    window.goToSkulworldTab = function (index, animate = true) {
        current = Math.max(0, Math.min(TABS.length - 1, index));
        track.style.transition = animate ? "transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)" : "none";
        track.style.transform = `translateX(-${current * 50}%)`;
        updateActiveTab(current);
    };

    document.addEventListener("click", (e) => {
        const tabBtn = e.target.closest("[data-swipe-tab]");
        if (!tabBtn) return;
        const index = TABS.indexOf(tabBtn.dataset.swipeTab);
        if (index !== -1 && index !== current) window.goToSkulworldTab(index);
    });

    track.addEventListener("touchstart", (e) => {
        if (e.touches.length !== 1) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        deltaX = 0;
        dragging = true;
        decided = false;
        horizontal = false;
        track.style.transition = "none";
    }, { passive: true });

    track.addEventListener("touchmove", (e) => {
        if (!dragging) return;
        const x = e.touches[0].clientX;
        const y = e.touches[0].clientY;
        deltaX = x - startX;
        const deltaY = y - startY;

        if (!decided) {
            if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
            horizontal = Math.abs(deltaX) > Math.abs(deltaY);
            decided = true;
        }
        if (!horizontal) return;

        e.preventDefault();

        const atStart = current === 0 && deltaX > 0;
        const atEnd = current === TABS.length - 1 && deltaX < 0;
        const effectiveDelta = atStart || atEnd ? deltaX / EDGE_RESISTANCE : deltaX;
        const percent = (effectiveDelta / viewport.offsetWidth) * 50;
        track.style.transform = `translateX(calc(-${current * 50}% + ${percent}%))`;
    }, { passive: false });

    function endDrag() {
        if (!dragging) return;
        dragging = false;
        if (!horizontal) return;

        const threshold = viewport.offsetWidth * SWIPE_THRESHOLD_RATIO;
        if (deltaX < -threshold && current < TABS.length - 1) {
            window.goToSkulworldTab(current + 1);
        } else if (deltaX > threshold && current > 0) {
            window.goToSkulworldTab(current - 1);
        } else {
            window.goToSkulworldTab(current);
        }
    }

    track.addEventListener("touchend", endDrag);
    track.addEventListener("touchcancel", endDrag);

    window.goToSkulworldTab(0, false);
})();

document.getElementById("lihatSquadDiikutiBtn")?.addEventListener("click", () => {
    window.goToSkulworldTab(1);
});

document.getElementById("mySquadRow")?.addEventListener("click", () => {
    window.location.href = "squad-page.html";
});

if (isSquadJoined()) {
    enterTabsView();
} else {
    lanjutkanBtn.disabled = true;
}
