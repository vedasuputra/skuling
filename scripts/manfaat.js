const overlay = document.getElementById('pemanasan-overlay');

function showOverlay() {
    overlay.style.display = 'flex';
    overlay.classList.remove('hiding');
    overlay.classList.add('visible');
}

function hideOverlay() {
    overlay.classList.add('hiding');
    overlay.addEventListener('animationend', () => {
        overlay.classList.remove('visible', 'hiding');
        overlay.style.display = 'none';
    }, { once: true });
}

document.querySelector('.pemanasan-cta').addEventListener('click', () => {
    window.location.href = 'pemanasan.html';
});

document.getElementById('btn-lanjutkan').addEventListener('click', showOverlay);
document.getElementById('pemanasan-close').addEventListener('click', hideOverlay);
document.getElementById('pemanasan-skip').addEventListener('click', () => {
    window.location.href = 'fitur.html';
});