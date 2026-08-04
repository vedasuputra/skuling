document.getElementById("chatroomBackBtn")?.addEventListener("click", () => {
    // history.back(), not a location.href redirect — a forward redirect here
    // pushes a fresh history entry instead of popping one, which traps later
    // back-button presses on buat-chat-baru.html into re-entering this page.
    window.history.back();
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

    localStorage.setItem("skuling_chat_vedasuputra_last", text);

    input.value = "";
    body.scrollTop = body.scrollHeight;
}

sendBtn?.addEventListener("click", sendMessage);
input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

const inputBar = document.querySelector(".chatroom-input-bar");

function syncInputBarPosition() {
    if (!window.visualViewport || !inputBar) return;
    const vv = window.visualViewport;
    const offset = window.innerHeight - vv.height - vv.offsetTop;
    inputBar.style.transform = offset > 0 ? `translateY(-${offset}px)` : "";
}

if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => {
        window.scrollTo(0, 0);
        syncInputBarPosition();
    });
    window.visualViewport.addEventListener("scroll", syncInputBarPosition);
}
input?.addEventListener("blur", () => {
    window.scrollTo(0, 0);
    syncInputBarPosition();
});
