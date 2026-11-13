const btn = document.getElementById("addBtn");
const taskInput = document.getElementById("task");

function addTask() {
  const task = taskInput.value;

  if (task.trim() === "") {
    alert("Please enter a task");
    return;
  }

  document.getElementById("noTask").hidden = true;
  const li = document.createElement("li");

  // createing a checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  // writing the task content into a span tag
  const taskText = document.createElement("span");
  taskText.textContent = task;

  // creating a image for deleteing the task
  const deleteTask = document.createElement("img");
  deleteTask.src = "https://cdn-icons-png.flaticon.com/128/9790/9790368.png";
  deleteTask.alt = "Delete task";
  deleteTask.setAttribute("role", "button");
  deleteTask.tabIndex = 0;

  // adding all the 3 elemenst into a list item
  li.append(checkbox, taskText, deleteTask);

  // this  creates a class so thet you can target it and style it
  li.setAttribute("class", "userTask");

  // adding the list into the list of the html
  const TaskList = document.getElementById("taskList");
  TaskList.append(li);

  //this resets the input flied
  taskInput.value = "";

  //function to delete the list Item
  function removeTask() {
    li.remove();
  }

  deleteTask.addEventListener("click", removeTask);

  deleteTask.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      removeTask();
    }
  });
}

btn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});
