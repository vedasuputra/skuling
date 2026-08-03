document.body.dataset.page = "skulworld";

document.getElementById("squadBackBtn")?.addEventListener("click", () => {
    if (document.referrer) {
        window.history.back();
    } else {
        window.location.href = "skulworld.html";
    }
});

document.getElementById("openPostBtn")?.addEventListener("click", () => {
    window.location.href = "post.html";
});

function renderSquadPost() {
    const liked = isPostLiked();
    const likeBtn = document.getElementById("squadLikeBtn");
    likeBtn.classList.toggle("squad-post-action--liked", liked);
    document.getElementById("squadLikeCount").textContent = getLikeCount();

    const commentCount = getComments().length;
    document.getElementById("squadCommentCount").textContent = `${commentCount} Komentar`;
}

document.getElementById("squadLikeBtn")?.addEventListener("click", () => {
    togglePostLike();
    renderSquadPost();
});

document.getElementById("squadCommentBtn")?.addEventListener("click", () => {
    window.location.href = "post.html";
});

renderSquadPost();
