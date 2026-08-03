

const SKULWORLD_JOINED_KEY = "skuling_skulworld_joined";
const SKULWORLD_POST_LIKED_KEY = "skuling_skulworld_post_liked";
const SKULWORLD_POST_COMMENTS_KEY = "skuling_skulworld_post_comments";

const SKULWORLD_BASE_LIKES = 16;

function isSquadJoined() {
    return localStorage.getItem(SKULWORLD_JOINED_KEY) === "1";
}

function joinSquad() {
    localStorage.setItem(SKULWORLD_JOINED_KEY, "1");
}

function isPostLiked() {
    return localStorage.getItem(SKULWORLD_POST_LIKED_KEY) === "1";
}

function getLikeCount() {
    return SKULWORLD_BASE_LIKES + (isPostLiked() ? 1 : 0);
}

function togglePostLike() {
    const next = !isPostLiked();
    localStorage.setItem(SKULWORLD_POST_LIKED_KEY, next ? "1" : "0");
    return next;
}

function getComments() {
    try {
        return JSON.parse(localStorage.getItem(SKULWORLD_POST_COMMENTS_KEY) || "[]");
    } catch (e) {
        return [];
    }
}

function addComment(text) {
    const comments = getComments();
    comments.push({ text });
    localStorage.setItem(SKULWORLD_POST_COMMENTS_KEY, JSON.stringify(comments));
    return comments;
}

function deleteComment(index) {
    const comments = getComments();
    comments.splice(index, 1);
    localStorage.setItem(SKULWORLD_POST_COMMENTS_KEY, JSON.stringify(comments));
    return comments;
}

function getRespondent() {
    try {
        const draft = JSON.parse(localStorage.getItem("skuling_kenalan_draft") || "{}");
        return {
            name: draft["full-name"] && draft["full-name"].trim() ? draft["full-name"].trim() : "Responden",
            school: draft["school"] && draft["school"].trim() ? draft["school"].trim() : "SMA LAB UNDIKSHA",
        };
    } catch (e) {
        return { name: "Responden", school: "SMA LAB UNDIKSHA" };
    }
}
