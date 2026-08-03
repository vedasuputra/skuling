

(function () {
    const TABS = ["xplain", "battle"];
    const SWIPE_THRESHOLD_RATIO = 0.18;
    const EDGE_RESISTANCE = 3;

    function initHomeSwipe() {
        const viewport = document.getElementById("homeSwipeViewport");
        const track = document.getElementById("homeSwipeTrack");
        if (!viewport || !track) return;

        let current = Math.max(0, TABS.indexOf(document.body.dataset.homeTab));
        let dragging = false;
        let decided = false;
        let horizontal = false;
        let startX = 0;
        let startY = 0;
        let deltaX = 0;

        function updateActiveTab(index) {
            document.body.dataset.homeTab = TABS[index];
            document.querySelectorAll(".home-navbar [data-tab]").forEach((tab) => {
                if (!TABS.includes(tab.dataset.tab)) return;
                if (tab.dataset.tab === TABS[index]) {
                    tab.setAttribute("aria-current", "page");
                } else {
                    tab.removeAttribute("aria-current");
                }
            });
        }

        function goToTab(index, animate = true) {
            current = Math.max(0, Math.min(TABS.length - 1, index));
            track.style.transition = animate ? "transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)" : "none";
            track.style.transform = `translateX(-${current * 50}%)`;
            updateActiveTab(current);
        }

        document.addEventListener("click", (e) => {
            const tabBtn = e.target.closest(".home-navbar [data-tab]");
            if (!tabBtn) return;
            const index = TABS.indexOf(tabBtn.dataset.tab);
            if (index === -1) return;
            if (index !== current) goToTab(index);
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
                goToTab(current + 1);
            } else if (deltaX > threshold && current > 0) {
                goToTab(current - 1);
            } else {
                goToTab(current);
            }
        }

        track.addEventListener("touchend", endDrag);
        track.addEventListener("touchcancel", endDrag);

        goToTab(current, false);
    }

    document.addEventListener("DOMContentLoaded", initHomeSwipe);
})();
