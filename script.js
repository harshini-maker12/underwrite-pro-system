
let agents = JSON.parse(localStorage.getItem("agents")) || [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "9876543210",
    status: "Active",
    commission: 5000,
    policies: 12,
    target: 15
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "9876543211",
    status: "Active",
    commission: 6500,
    policies: 18,
    target: 15
  },
  {
    id: 3,
    name: "Arun Kumar",
    email: "arun@example.com",
    phone: "9876543212",
    status: "In Training",
    commission: 3500,
    policies: 8,
    target: 12
  }
];

function saveAgents() {
  localStorage.setItem("agents", JSON.stringify(agents));
}

function renderDashboard() {
  document.getElementById("totalAgents").textContent = agents.length;

  document.getElementById("activeAgents").textContent =
    agents.filter(agent => agent.status === "Active").length;

  const total = agents.reduce(
    (sum, agent) => sum + agent.commission, 0
  );

  document.getElementById("totalCommission").textContent =
    "₹" + total.toLocaleString("en-IN");
}

function renderAgents(list = agents) {
  const container = document.getElementById("agentList");
  container.innerHTML = "";

  if (list.length === 0) {
    container.textContent = "No agents found.";
    return;
  }

  list.forEach(agent => {
    const card = document.createElement("div");

    const details = document.createElement("p");
    details.textContent =
      agent.name + " | " + agent.email + " | " + agent.status;

    const commission = document.createElement("p");
    commission.textContent =
      "Commission: ₹" + agent.commission.toLocaleString("en-IN");

    const removeButton = document.createElement("button");
    removeButton.textContent = "Delete Agent";
    removeButton.addEventListener("click", () => {
      if (confirm("Delete " + agent.name + "?")) {
        agents = agents.filter(item => item.id !== agent.id);
        saveAgents();
        renderAll();
      }
    });

    card.append(details, commission, removeButton);
    container.appendChild(card);
  });
}

function renderCommissions() {
  const container = document.getElementById("commissionList");
  container.innerHTML = "";

  agents.forEach(agent => {
    const item = document.createElement("div");
    item.textContent =
      agent.name + " — ₹" +
      agent.commission.toLocaleString("en-IN") +
      " (Sample commission)";
    container.appendChild(item);
  });
}

function renderPerformance() {
  const container = document.getElementById("performanceList");
  container.innerHTML = "";

  agents.forEach(agent => {
    const percentage = Math.round(
      (agent.policies / agent.target) * 100
    );

    const item = document.createElement("div");
    item.textContent =
      agent.name + " — " + agent.policies +
      "/" + agent.target + " policies (" +
      percentage + "% of target)";
    container.appendChild(item);
  });
}

function renderAll() {
  renderDashboard();
  renderAgents();
  renderCommissions();
  renderPerformance();
}

document.getElementById("agentForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !email || !phone) return;

  agents.push({
    id: Date.now(),
    name,
    email,
    phone,
    status: "Active",
    commission: 0,
    policies: 0,
    target: 10
  });

  saveAgents();
  renderAll();

  document.getElementById("message").textContent =
    "Agent registered successfully!";

  event.target.reset();
});

document.getElementById("search").addEventListener("input", event => {
  const query = event.target.value.toLowerCase();

  const filtered = agents.filter(agent =>
    agent.name.toLowerCase().includes(query) ||
    agent.email.toLowerCase().includes(query) ||
    agent.status.toLowerCase().includes(query)
  );

  renderAgents(filtered);
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const header = ["ID", "Name", "Email", "Phone", "Status", "Commission"];

  const rows = agents.map(agent => [
    agent.id,
    agent.name,
    agent.email,
    agent.phone,
    agent.status,
    agent.commission
  ]);

  const csv = [header, ...rows]
    .map(row => row.map(value =>
      '"' + String(value).replace(/"/g, '""') + '"'
    ).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "AgentPro_Report.csv";
  link.click();

  URL.revokeObjectURL(url);
});

renderAll();
