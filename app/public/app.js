async function loadTasks() {
  const response = await fetch("/tasks");

  const tasks = await response.json();

  document.getElementById("tasks").innerHTML = tasks
    .map(
      (task) => `

        <li class="${task.completed ? "done" : ""}">


            <span onclick="toggleTask('${task._id}')">

                ${task.title}

            </span>


            <button onclick="deleteTask('${task._id}')">

                X

            </button>


        </li>


        `,
    )
    .join("");
}

async function addTask() {
  const title = document.getElementById("taskInput").value;

  await fetch("/tasks", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      title,
    }),
  });

  document.getElementById("taskInput").value = "";

  loadTasks();
}

async function toggleTask(id) {
  await fetch(`/tasks/${id}`, {
    method: "PATCH",
  });

  loadTasks();
}

async function deleteTask(id) {
  await fetch(`/tasks/${id}`, {
    method: "DELETE",
  });

  loadTasks();
}

loadTasks();
