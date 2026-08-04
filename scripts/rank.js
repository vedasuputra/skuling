document.body.dataset.page = "rank";

function waitForImages(images) {
    return Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
        });
    }));
}

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("rkLoadingOverlay");
    if (!overlay) return;

    const images = document.querySelectorAll(".rk-hero-img, .rk-row-img");
    waitForImages(images).then(() => {
        overlay.classList.add("is-hidden");
        overlay.addEventListener("transitionend", () => overlay.remove(), { once: true });
    });
});
