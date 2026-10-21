const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  const statusEl = document.querySelector("#form-status");
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusEl.textContent = "Sending…";
    statusEl.className = "status";
    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Could not send your message.");
      contactForm.reset();
      statusEl.textContent = "Thank you. Your message has been sent.";
      statusEl.className = "status success";
    } catch (error) {
      statusEl.textContent = error.message || "Something went wrong. Please try again later.";
      statusEl.className = "status error";
    }
  });
}
