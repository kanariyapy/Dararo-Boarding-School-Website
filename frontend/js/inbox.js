const tbody = document.querySelector("#messages-body");
const statusEl = document.querySelector("#inbox-status");

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    window.location.href = "/admin/login.html";
    throw new Error("Please sign in.");
  }
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

function makeCell(text) {
  const td = document.createElement("td");
  td.textContent = text ?? "";
  return td;
}

async function loadMessages() {
  statusEl.textContent = "Loading messages…";
  try {
    const data = await api("/api/admin/messages");
    tbody.replaceChildren();
    if (!data.messages.length) {
      const tr = document.createElement("tr");
      tr.append(makeCell("No messages yet."));
      tr.firstChild.colSpan = 5;
      tbody.append(tr);
    }
    for (const message of data.messages) {
      const tr = document.createElement("tr");
      tr.append(makeCell(message.is_read ? "Read" : "Unread"));
      tr.append(makeCell(`${message.name}\n${message.email}`));
      const subjectCell = document.createElement("td");
      const subject = document.createElement("strong");
      subject.textContent = message.subject;
      const body = document.createElement("p");
      body.className = "message-body";
      body.textContent = message.message;
      subjectCell.append(subject, body);
      tr.append(subjectCell);
      tr.append(makeCell(new Date(message.created_at + "Z").toLocaleString()));
      const actions = document.createElement("td");
      actions.className = "actions";
      if (!message.is_read) {
        const readBtn = document.createElement("button");
        readBtn.type = "button";
        readBtn.textContent = "Mark read";
        readBtn.addEventListener("click", () => changeMessage(message.id, "read"));
        actions.append(readBtn);
      }
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "danger";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => {
        if (window.confirm("Delete this message permanently?")) changeMessage(message.id, "delete");
      });
      actions.append(deleteBtn);
      tr.append(actions);
      tbody.append(tr);
    }
    statusEl.textContent = `${data.messages.length} message(s).`;
    statusEl.className = "status";
  } catch (error) {
    statusEl.textContent = error.message;
    statusEl.className = "status error";
  }
}

async function changeMessage(id, action) {
  try {
    await api(`/api/admin/messages/${id}/${action}`, { method: "POST", body: "{}" });
    await loadMessages();
  } catch (error) {
    statusEl.textContent = error.message;
    statusEl.className = "status error";
  }
}

document.querySelector("#refresh-button")?.addEventListener("click", loadMessages);
document.querySelector("#logout-button")?.addEventListener("click", async () => {
  try { await api("/api/auth/logout", { method: "POST", body: "{}" }); }
  finally { window.location.href = "/admin/login.html"; }
});

loadMessages();
