function renderSelesaiContent() {
    const container = document.getElementById("selesaiContent");
    if (!container) return;

    const isFirstTime = !hasSeenMateriSummary();

    container.innerHTML = `
        <div class="selesai-hero">
            <img class="selesai-mascot" src="./img/mascot-selesai.png" alt="">
            <p class="selesai-message"><strong>Keren banget, selamat!</strong><br>Kamu menyelesaikan materi ini dengan baik.</p>
        </div>
        ${isFirstTime ? `
            <div class="selesai-badges">
                <div class="selesai-badge selesai-badge--streak">
                    <span class="selesai-badge-icon">
                        <img src="./img/icon-streak-flame.svg" alt="">
                    </span>
                    <span class="selesai-badge-body">
                        <span class="selesai-badge-title">Streak aktif!</span>
                        <span class="selesai-badge-desc">Lanjutkan dengan pakai Skuling tiap hari</span>
                    </span>
                </div>
                <div class="selesai-badge selesai-badge--rookie">
                    <span class="selesai-badge-icon">
                        <img src="./img/rank-rookie.png" alt="">
                    </span>
                    <span class="selesai-badge-body">
                        <span class="selesai-badge-title">Kamu telah menjadi Rookie!</span>
                        <span class="selesai-badge-desc">Perjalananmu sebagai SkulChamp dimulai</span>
                    </span>
                </div>
                <div class="selesai-badge selesai-badge--mission">
                    <span class="selesai-badge-icon">
                        <img src="./img/icon-book-bookmark.png" alt="">
                    </span>
                    <span class="selesai-badge-body">
                        <span class="selesai-badge-title">&ldquo;Menyelesaikan Modul Xplain 50%&rdquo; selesai!</span>
                        <span class="selesai-badge-desc">Yuk, klaim hadiah misi ini dari menu Missions</span>
                    </span>
                </div>
            </div>
        ` : ""}
    `;

    if (isFirstTime) markMateriSummarySeen();
}

document.addEventListener("DOMContentLoaded", renderSelesaiContent);
