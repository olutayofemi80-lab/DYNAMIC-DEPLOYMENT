const API_URL = "/api";

const taskForm = document.getElementById("taskForm");
const tasksContainer = document.getElementById("tasks");
const message = document.getElementById("message");
const refreshBtn = document.getElementById("refreshBtn");

async function loadTasks() {
  tasksContainer.innerHTML = "<p>Loading tasks...</p>";

  try {
    const response = await fetch(`${API_URL}/tasks`);
    const tasks = await response.json();

    if (!tasks.length) {
      tasksContainer.innerHTML = "<p>No tasks yet. Add your first task.</p>";
      return;
    }

    tasksContainer.innerHTML = tasks.map(task => `
      <div class="task">
        <h3>${escapeHtml(task.title)}</h3>
        <p>${escapeHtml(task.description || "No description")}</p>
        <strong>Status: ${task.completed ? "Completed" : "Pending"}</strong>

        <div class="task-actions">
          <button class="complete" onclick="toggleTask('${task._id}', ${task.completed})">
            ${task.completed ? "Mark Pending" : "Mark Complete"}
          </button>

          <button class="delete" onclick="deleteTask('${task._id}')">
            Delete
          </button>
        </div>
      </div>
    `).join("");
  } catch (error) {
    tasksContainer.innerHTML = "<p>Unable to connect to the backend.</p>";
  }
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, description })
    });

    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    taskForm.reset();
    message.textContent = "Task added successfully.";
    await loadTasks();
  } catch (error) {
    message.textContent = "Failed to add task.";
  }
});

async function toggleTask(id, completed) {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ completed: !completed })
  });

  loadTasks();
}

async function deleteTask(id) {
  if (!confirm("Delete this task?")) return;

  await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE"
  });

  loadTasks();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

refreshBtn.addEventListener("click", loadTasks);

loadTasks();
