const loginForm = document.querySelector("#login-form");
if (loginForm) {
  const statusEl = document.querySelector("#login-status");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusEl.textContent = "Signing in…";
    statusEl.className = "status";
    const payload = Object.fromEntries(new FormData(loginForm).entries());
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Sign-in failed.");
      window.location.href = "/admin/inbox.html";
    } catch (error) {
      statusEl.textContent = error.message || "Could not sign in.";
      statusEl.className = "status error";
    }
  });
}
