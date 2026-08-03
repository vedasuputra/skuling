// Same "skuling_kenalan_draft" localStorage draft used by battle-match.js's
// getRespondent() — reused here so the profile reflects whatever the
// respondent actually filled in during Kenalan, instead of static copy.
function getRespondent() {
    try {
        const draft = JSON.parse(localStorage.getItem("skuling_kenalan_draft") || "{}");
        return {
            name: draft["full-name"] && draft["full-name"].trim() ? draft["full-name"].trim() : "Responden",
            username: draft["username"] && draft["username"].trim() ? draft["username"].trim() : "responden",
            school: draft["school"] && draft["school"].trim() ? draft["school"].trim() : "-",
        };
    } catch (e) {
        return { name: "Responden", username: "responden", school: "-" };
    }
}

function renderRespondent() {
    const { name, username, school } = getRespondent();

    const usernameEl = document.getElementById("profileUsername");
    if (usernameEl) usernameEl.textContent = `@${username}`;

    const nameEl = document.getElementById("profileName");
    if (nameEl) nameEl.textContent = name;

    const schoolEl = document.getElementById("profileSchool");
    if (schoolEl) schoolEl.textContent = school;

    const avatarEl = document.getElementById("profileAvatar");
    if (avatarEl) avatarEl.textContent = name.trim().charAt(0).toUpperCase() || "R";
}

renderRespondent();

document.getElementById("addFriendTopBtn")?.addEventListener("click", () => {
    window.location.href = "add-friends.html";
});

document.getElementById("friendCountBtn")?.addEventListener("click", () => {
    window.location.href = "friend-list.html";
});
