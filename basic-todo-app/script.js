const STORAGE_KEY = "basic-todo-app:tasks";

const btn = document.getElementById("addBtn");
const taskInput = document.getElementById("task");
const taskList = document.getElementById("taskList");
const noTask = document.getElementById("noTask");

function loadTasks() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

let tasks = loadTasks();

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateEmptyState() {
  noTask.hidden = tasks.length > 0;
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.setAttribute("class", "userTask");

    // createing a checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark "${task.text}" as done`);

    checkbox.addEventListener("change", () => {
      tasks[index].completed = checkbox.checked;
      saveTasks();
    });

    // writing the task content into a span tag
    const taskText = document.createElement("span");
    taskText.textContent = task.text;

    // creating a image for deleteing the task
    const deleteTask = document.createElement("img");
    deleteTask.src = "https://cdn-icons-png.flaticon.com/128/9790/9790368.png";
    deleteTask.alt = "Delete task";
    deleteTask.setAttribute("role", "button");
    deleteTask.tabIndex = 0;

    //function to delete the list Item
    function removeTask() {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }

    deleteTask.addEventListener("click", removeTask);

    deleteTask.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        removeTask();
      }
    });

    // adding all the 3 elemenst into a list item
    li.append(checkbox, taskText, deleteTask);
    taskList.append(li);
  });

  updateEmptyState();
}

function addTask() {
  const task = taskInput.value.trim();

  if (task === "") {
    alert("Please enter a task");
    return;
  }

  tasks.push({ text: task, completed: false });
  saveTasks();
  taskInput.value = "";
  renderTasks();
}

btn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

renderTasks();
