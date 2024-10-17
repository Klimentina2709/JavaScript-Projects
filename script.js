document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("new-task");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");

  loadTasks();

  addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
      addTask(taskText);
      taskInput.value = "";
      saveTasks();
    }
  });

  taskList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const li = e.target.parentElement;
      if (e.target.textContent === "✕") {
        taskList.removeChild(li);
      } else {
        li.classList.toggle("completed");
      }
      saveTasks();
    }
  });

  function addTask(taskText) {
    const li = document.createElement("li");
    li.textContent = taskText;
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔";
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  }

  function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach((li) => {
      tasks.push({
        text: li.textContent.slice(0, -2),
        completed: li.classList.contains("completed"),
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => addTask(task.text));
    taskList.querySelectorAll("li").forEach((li, index) => {
      if (tasks[index].completed) {
        li.classList.add("completed");
      }
    });
  }
});
