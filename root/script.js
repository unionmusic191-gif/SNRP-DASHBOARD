// ================================
// SNRP DASHBOARD FRONTEND SCRIPT
// ================================

// BACKEND URL (Render)
const API_URL = "https://snrp-backend.onrender.com";

// DOM Elements
const loginScreen = document.getElementById("login-screen");
const dashboard = document.getElementById("dashboard");
const loginBtn = document.getElementById("login-btn");
const ticketList = document.getElementById("ticket-list");
const userInfo = document.getElementById("user-info");

// ==========================================
// STEP 1: When clicking LOGIN → redirect to OAuth2
// ==========================================

loginBtn.addEventListener("click", () => {
    window.location.href = `${API_URL}/auth/login`;
});

// ==========================================
// STEP 2: After login, backend redirects with a token
// ==========================================

async function checkLogin() {
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get("token");

    if (!authToken) {
        dashboard.style.display = "none";
        loginScreen.style.display = "block";
        return;
    }

    // Save token to localStorage
    localStorage.setItem("snrp_token", authToken);

    loginScreen.style.display = "none";
    dashboard.style.display = "block";

    loadUserInfo();
    loadTickets();
}

checkLogin();

// ==========================================
// STEP 3: Load logged-in user info
// ==========================================

async function loadUserInfo() {
    const token = localStorage.getItem("snrp_token");
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();

        if (data.error) {
            userInfo.textContent = "Authentication failed.";
            return;
        }

        userInfo.textContent = `Logged in as: ${data.username}#${data.discriminator}`;

    } catch (err) {
        console.error(err);
    }
}

// ==========================================
// STEP 4: Load all open tickets
// ==========================================

async function loadTickets() {
    const token = localStorage.getItem("snrp_token");
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/tickets/list`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const tickets = await res.json();

        ticketList.innerHTML = "";

        tickets.forEach(ticket => {
            const box = document.createElement("div");
            box.classList.add("ticket-box");

            box.innerHTML = `
                <h3>🎫 Ticket #${ticket.ticketId}</h3>
                <p><b>User:</b> ${ticket.userTag}</p>
                <p><b>Status:</b> ${ticket.status}</p>
                <p><b>Created:</b> ${ticket.createdAt}</p>
            `;

            ticketList.appendChild(box);
        });

    } catch (err) {
        console.error(err);
    }
}
