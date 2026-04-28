
// LOCAL (testing)
// const API_BASE = "http://localhost:8080/api/auth";

// PRODUCTION
const API_BASE = "https://helpify-backend-iv27.onrender.com/api/auth";

// ================= UI HELPERS =================
function showMsg(text, type) {
    const el = document.getElementById('authMsg');
    el.textContent = text;
    el.className = 'auth-msg ' + type;
}

function setLoading(id, on) {
    const btn = document.getElementById(id);
    if (!btn) return;

    if (on) {
        btn.disabled = true;
        btn.dataset.orig = btn.innerHTML;
        btn.innerHTML = '<span class="spinner"></span> Please wait...';
    } else {
        btn.disabled = false;
        btn.innerHTML = btn.dataset.orig;
    }
}

// ================= SIGNUP =================
async function handleSignup(e) {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;

    if (!username || !email || !password) {
        showMsg('Fill all fields', 'error');
        return;
    }

    setLoading('signupBtn', true);

    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.text();

        if (!res.ok) throw new Error(data);

        showMsg('✓ OTP sent to email', 'success');

        document.getElementById('otpEmail').value = email;

    } catch (err) {
        showMsg(err.message, 'error');
    } finally {
        setLoading('signupBtn', false);
    }
}

// ================= VERIFY OTP =================
async function handleVerifyOtp(e) {
    e.preventDefault();

    const email = document.getElementById('otpEmail').value.trim().toLowerCase();
    const otp = document.getElementById('otpCode').value.trim();

    setLoading('verifyBtn', true);

    try {
        const res = await fetch(`${API_BASE}/verify?email=${email}&otp=${otp}`, {
            method: 'POST'
        });

        const data = await res.text();

        if (!res.ok) throw new Error(data);

        showMsg('✓ Verified! Now login', 'success');

    } catch (err) {
        showMsg(err.message, 'error');
    } finally {
        setLoading('verifyBtn', false);
    }
}

// ================= LOGIN =================
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showMsg('Fill all fields', 'error');
        return;
    }

    setLoading('loginBtn', true);

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const data = await res.text();

        if (!res.ok) throw new Error(data);

       showMsg('✓ Login successful!', 'success');

setTimeout(async () => {
  const meRes = await fetch(`${API_BASE}/me`, {
    credentials: 'include'
  });

  if (!meRes.ok) {
    console.log("ME ERROR:", await meRes.text());
    throw new Error("Session failed");
  }

  window.location.href = "dashboard.html";
}, 500);

    } catch (err) {
        showMsg(err.message || "Login failed", 'error');
    } finally {
        setLoading('loginBtn', false);
    }
}

// ================= AUTO REDIRECT =================
(async function checkSession() {
    try {
        const res = await fetch(`${API_BASE}/me`, {
            credentials: 'include'
        });

        if (res.ok) {
            window.location.href = "dashboard.html";
        }
    } catch { }
})();
