document.getElementById("chatroomBackBtn")?.addEventListener("click", () => {
    window.location.href = "beranda.html";
});

const body = document.getElementById("chatroomBody");
const messages = document.getElementById("chatroomMessages");
const input = document.getElementById("chatroomInput");
const sendBtn = document.getElementById("chatroomSendBtn");

function formatNow() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
}

function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    if (!body.classList.contains("has-messages")) {
        body.classList.add("has-messages");
        const divider = document.createElement("div");
        divider.className = "chatroom-date-divider";
        divider.textContent = "Hari Ini";
        messages.appendChild(divider);
    }

    const row = document.createElement("div");
    row.className = "chatroom-message-row";
    row.innerHTML = `
        <span class="chatroom-message-bubble"></span>
        <span class="chatroom-message-time"></span>
    `;
    row.querySelector(".chatroom-message-bubble").textContent = text;
    row.querySelector(".chatroom-message-time").textContent = formatNow();
    messages.appendChild(row);

    input.value = "";
    body.scrollTop = body.scrollHeight;
}

sendBtn?.addEventListener("click", sendMessage);
input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});
