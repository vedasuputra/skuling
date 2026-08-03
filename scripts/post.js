document.body.dataset.page = "skulworld";

document.getElementById("postBackBtn")?.addEventListener("click", () => {
    if (document.referrer) {
        window.history.back();
    } else {
        window.location.href = "squad-page.html";
    }
});

const respondent = getRespondent();
const initial = respondent.name.trim().charAt(0).toUpperCase() || "R";
const composerAvatar = document.getElementById("composerAvatar");
if (composerAvatar) composerAvatar.textContent = initial;

function renderLike() {
    const liked = isPostLiked();
    const likeBtn = document.getElementById("postLikeBtn");
    likeBtn.classList.toggle("squad-post-action--liked", liked);
    document.getElementById("postLikeCount").textContent = getLikeCount();
}

document.getElementById("postLikeBtn")?.addEventListener("click", () => {
    togglePostLike();
    renderLike();
});

renderLike();

const commentsList = document.getElementById("commentsList");
const commentsEmpty = document.getElementById("commentsEmpty");
const commentsTitle = document.getElementById("commentsTitle");
const postCommentCount = document.getElementById("postCommentCount");

let pendingDeleteIndex = null;
const deleteOverlay = document.getElementById("commentDeleteOverlay");

function renderComments() {
    const comments = getComments();

    commentsTitle.textContent = comments.length ? `Komentar (${comments.length})` : "Komentar";
    postCommentCount.textContent = `${comments.length} Komentar`;
    commentsEmpty.style.display = comments.length ? "none" : "flex";

    commentsList.innerHTML = comments.map((c, i) => `
        <div class="comment-card" data-index="${i}">
            <span class="comment-card-avatar" aria-hidden="true">${initial}</span>
            <div class="comment-card-main">
                <div class="comment-card-header">
                    <span class="comment-card-identity">
                        <span class="comment-card-name">
                            <img class="comment-card-badge" src="./img/badge-rookie.png" alt="">
                            ${respondent.name}
                        </span>
                        <span class="comment-card-school">${respondent.school}</span>
                    </span>
                    <button type="button" class="comment-card-delete btn-reset" data-delete-index="${i}"
                        aria-label="Hapus komentar">
                        <span class="material-symbols-outlined" aria-hidden="true">delete</span>
                    </button>
                </div>
                <p class="comment-card-text">${c.text}</p>
            </div>
        </div>
    `).join("");

    commentsList.querySelectorAll("[data-delete-index]").forEach(btn => {
        btn.addEventListener("click", () => {
            pendingDeleteIndex = parseInt(btn.dataset.deleteIndex, 10);
            deleteOverlay.style.display = "flex";
            deleteOverlay.classList.remove("hiding");
            deleteOverlay.classList.add("visible");
        });
    });
}

renderComments();

const commentInput = document.getElementById("commentInput");
const composerToolbar = document.getElementById("composerToolbar");

commentInput?.addEventListener("focus", () => {
    composerToolbar.hidden = false;
});

commentInput?.addEventListener("input", () => {
    commentInput.style.height = "auto";
    commentInput.style.height = `${commentInput.scrollHeight}px`;
});

document.getElementById("submitCommentBtn")?.addEventListener("click", () => {
    const text = commentInput.value.trim();
    if (!text) return;
    addComment(text);
    commentInput.value = "";
    commentInput.style.height = "auto";
    renderComments();
});

function closeDeleteOverlay() {
    deleteOverlay.classList.add("hiding");
    deleteOverlay.addEventListener("animationend", () => {
        deleteOverlay.classList.remove("visible", "hiding");
        deleteOverlay.style.display = "none";
    }, { once: true });
    pendingDeleteIndex = null;
}

document.getElementById("commentDeleteCloseBtn")?.addEventListener("click", closeDeleteOverlay);
document.getElementById("commentDeleteCancelBtn")?.addEventListener("click", closeDeleteOverlay);
deleteOverlay?.addEventListener("click", (e) => {
    if (e.target === deleteOverlay) closeDeleteOverlay();
});

document.getElementById("commentDeleteConfirmBtn")?.addEventListener("click", () => {
    if (pendingDeleteIndex === null) return;
    deleteComment(pendingDeleteIndex);
    closeDeleteOverlay();
    renderComments();
});
