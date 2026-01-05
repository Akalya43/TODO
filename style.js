const email = localStorage.getItem("email");
const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Load tasks from DB
async function loadTasks() {
  const res = await fetch("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  const tasks = await res.json();
  taskList.innerHTML = "";

  tasks.forEach(task => {
    createTask(task._id, task.task, task.completed);
  });
}

loadTasks();

// Add new task
addBtn.addEventListener("click", addTask);

async function addTask() {
  const text = taskInput.value.trim();
  if (!text) return alert("Enter a task!");

  await fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, task: text })
  });

  taskInput.value = "";
  loadTasks();
}

// Create task in UI
function createTask(id, task, completed) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  li.innerHTML = `${task} <span>✖</span>`;

  // Tick update
  li.addEventListener("click", async () => {
    const newStatus = !completed;
    await fetch("/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: newStatus })
    });

    loadTasks();
  });

  // Delete
  li.querySelector("span").addEventListener("click", async (e) => {
    e.stopPropagation();

    await fetch("/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    loadTasks();
  });

  taskList.appendChild(li);
}
