// i used 'DOMContentLoaded' for the page to load immediately, we can use window.addEventListerner also but the one used here is the best.
document.addEventListener("DOMContentLoaded", function () {
  const taskButton = document.getElementById("taskButton");

  //To add task

  if (taskButton) {
    taskButton.addEventListener("click", () => {
      // Adding of task
      const taskName = document.getElementById("task").value;
      const taskDate = document.getElementById("task-date").value;
      const taskTime = document.getElementById("task-time").value;

      console.log("Task input values:", { taskName, taskDate, taskTime });

      if (taskName && taskDate && taskTime) {
        const task = {
          name: taskName,
          date: taskDate,
          time: taskTime,

          // setting of status here  to determine which task is completed and which one is pending
          status: "pending", // Default status
        };

        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));

        alert("Task added successfully.\nCheck 'All Tasks' to view your task!");
        displayTask();
      } else {
        alert("Please fill in all fields");
      }
    });
  }

  // i used checking process to avoid the error 'of cannot read properties of null'

  if (document.querySelector(".js-addTask")) {
    displayTask();
  }
  if (document.querySelector(".js-completedTasks")) {
    displayCompletedTasks();
  }
  if (document.querySelector(".js-pendingTasks")) {
    displayPendingTasks();
  }
});

// Function that handles displaying of Added task on the main task list page
function displayTask() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  // i set it to variable here to avoid error of cannot read the properyies of null or anonymous error and the likes
  const taskDisplay = document.querySelectorAll(".js-addTask");
  let taskHTML = "";

  tasks.forEach((task, index) => {
    taskHTML += `
      <div class="task-container" data-index="${index}">
      <div class="tasks-container">
      <div class="task-details-container">
          <label for="Task">Task: <p>${task.name}</p></label>
          <label for="Date">Date: <p>${task.date}</p></label>
          <label for="Time">Time: <p>${task.time}</p></label>
        </div>
        <div class="task-delete-edit">
          <div class="delete-button">
            <button id="undo-complete-btn" class="js-complete-button" data-index="${index}">${
      task.status === "pending" ? "Complete" : "Undo"
    }</button>
          </div>
          <div class="delete-button">
            <button class="js-delete-button" data-index="${index}">Delete</button>
          </div>
          <div class="edit-button">
            <button class="js-edit-button" data-index="${index}">Edit</button>
          </div>
        </div>
      </div>
        
      </div>
    `;
  });

  // then with this one can escape the 'properties of null problem'
  taskDisplay.forEach((task) => {
    // Setting the innerHTML to the constructed string
    task.innerHTML = taskHTML;
  });

  // Attaching the event listeners to the buttons t allow functionality of the buttons
  addEventListeners();
}

// Function that handles the event listerners i.e clicking of buttons
function addEventListeners() {
  document.querySelectorAll(".js-complete-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const taskIndex = event.target.getAttribute("data-index");
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const newStatus =
        tasks[taskIndex].status === "pending" ? "completed" : "pending";
      // using this to update the local storage
      updateTaskStatus(taskIndex, newStatus);
      displayTask();
    });
  });

  document.querySelectorAll(".js-delete-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const taskIndex = event.target.getAttribute("data-index");

      deleteTask(taskIndex);
    });
  });

  document.querySelectorAll(".js-edit-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const taskIndex = event.target.getAttribute("data-index");
      editTask(taskIndex);
    });
  });
}

function deleteTask(taskIndex) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (tasks[taskIndex].status === "pending") {
    tasks.splice(taskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTask();
    displayPendingTasks();
  }
}

// Function that handles the ability of editing the form

function editTask(taskIndex) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Creating HTML for the edit form in order to be able to edit the form successfully

  let editHTML = `
      <div class="edit-container">
      <div class="editing-container">
      <input type="text" id="editTaskName" value="${tasks[taskIndex].name}">
        <input type="date" id="editTaskDate" value="${tasks[taskIndex].date}">
        <input type="time" id="editTaskTime" value="${tasks[taskIndex].time}">
      </div>
      <div class="save-cancel-container">
          <button class="save-btn" onclick="saveEdit(${taskIndex})">Save</button>
      <button class="cancel-btn" onclick="cancelEdit()">Cancel</button>
      </div>
    </div>
  `;

  // Replacing the actual task's HTML with the edit form
  document.querySelector(`[data-index="${taskIndex}"]`).innerHTML = editHTML;
}

// Function to handle cancel button action
// Due to the fact of not been able to insert two unclick in an element it is better to use one 'onclick' and then call the needed function inside the onclick function know as 'cancelEdit()'
function cancelEdit() {
  // Calling of both displayTask and displayPendingTasks functions to refresh the views
  displayTask();
  displayPendingTasks();
}

// Function that handles saving of the edited form
function saveEdit(taskIndex) {
  const taskName = document.getElementById("editTaskName").value;
  const taskDate = document.getElementById("editTaskDate").value;
  const taskTime = document.getElementById("editTaskTime").value;

  if (taskName && taskDate && taskTime) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Updating of task in the array to be able to save what was edited
    tasks[taskIndex] = {
      name: taskName,
      date: taskDate,
      time: taskTime,
      // Retaining the original status i.e the pending status
      status: tasks[taskIndex].status,
    };

    // Saving the updated task's array to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Refreshing task to display
    displayTask();
    displayPendingTasks();
  } else {
    alert("Please fill in all fields");
  }
}

// Function that handles the displaying of the completed tasks
function displayCompletedTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  // i set it to variable here to avoid error of cannot read the properyies of null or anonymous error
  const completedTasks = document.querySelectorAll(".js-completedTasks");
  let completedTaskHTML = "";

  tasks.forEach((task, index) => {
    if (task.status === "completed") {
      completedTaskHTML += `
        <div class="tasks-container" data-index="${index}">
        <div class="task-container">
            <div class="task-details-container">
              <label for="Task">Task: <p>${task.name}</p></label>
              <label for="Date">Date: <p>${task.date}</p></label>
              <label for="Time">Time: <p>${task.time}</p></label>
            </div>
            <div class="task-delete-edit">
              <div class="undo-button">
                <button class="js-undo-button" data-index="${index}">Undo</button>
              </div>
              <div class="delete-button">
                <button class="js-delete-completed-button" data-index="${index}">Delete</button>
              </div>
            </div>
        </div>
        </div>
      `;
    }
  });

  // then with this one can escape the 'properties of null problem'
  completedTasks.forEach((task) => {
    // Setting the innerHTML to the constructed string i.e completedHTML
    task.innerHTML = completedTaskHTML;
  });
  // Attaching event listeners to the buttons in the completed tasks
  addCompletedEventListeners();
}

// Function that handles the displaying of pending Tasks
function displayPendingTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  // i set it to variable here to avoid error of cannot read the properyies of null or anonymous error
  const pendingTasksContainer = document.querySelectorAll(".js-pendingTasks");
  let pendingTaskHTML = "";

  // Iterate over tasks and only display those that are still pending
  tasks.forEach((task, index) => {
    if (task.status === "pending") {
      // Check if the task is pending
      pendingTaskHTML += `
        <div class="tasks-container" data-index="${index}">
        <div class="task-container">
          <div class="task-details-container">
            <label for="Task">Task: <p>${task.name}</p></label>
            <label for="Date">Date: <p>${task.date}</p></label>
            <label for="Time">Time: <p>${task.time}</p></label>
          </div>
          <div class="task-delete-edit">
            <div class="delete-button">
              <button id="complete-button" class="js-complete-button" data-index="${index}">Complete</button>
            </div>
            <div class="delete-button">
              <button class="js-delete-button" data-index="${index}">Delete</button>
            </div>
            <div class="edit-button">
              <button class="edit-button js-edit-button" data-index="${index}">Edit</button>
            </div>
          </div>
        </div>
        </div>
        
      `;
    }
  });
  // then with this one can escape the 'properties of null problem'
  pendingTasksContainer.forEach((task) => {
    // Set the innerHTML to the constructed string
    task.innerHTML = pendingTaskHTML;
  });

  // Adding of event listeners of the button to the new element
  addEventListeners();
}

// Function to handle the completion of a task
function completeTask(taskIndex) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Updating the task's status in the local storage which is pending to completed
  if (tasks[taskIndex]) {
    tasks[taskIndex].status = "completed";
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Refresh the pending tasks display after completing a task
    displayPendingTasks();
  }
}

// function that handles the delete Pending Task
function deletePendingTask(taskIndex) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Removing the task from the array using splice
  tasks.splice(taskIndex, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Refreshing the pending tasks to display
  displayPendingTasks();
}

// function that hendles updated Task Status
function updateTaskStatus(taskIndex, newStatus) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Updating the task's status
  tasks[taskIndex].status = newStatus;
  localStorage.setItem("tasks", JSON.stringify(tasks));

  displayTask();

  if (newStatus === "completed") {
    // Refreshing the completed tasks
    displayCompletedTasks();
  }
  // Refreshing the pending tasks
  displayPendingTasks();
}

// function that handles the process of Adding Completed Event Listeners
function addCompletedEventListeners() {
  document.querySelectorAll(".js-undo-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const taskIndex = event.target.getAttribute("data-index");
      // Setting the status back to default i.e pending
      updateTaskStatus(taskIndex, "pending");
      // Refreshing main task list
      displayTask();
      // Refreshing completed tasks
      displayCompletedTasks();
      // Refreshing the pending tasks
      displayPendingTasks();
    });
  });

  document.querySelectorAll(".js-delete-completed-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const taskIndex = event.target.getAttribute("data-index");
      // deleting the completed task only
      deleteCompletedTaskOnly(taskIndex);

      displayCompletedTasks();
    });
  });
}

// function that handles the process of Deleting Completed Tasks only

function deleteCompletedTaskOnly(taskIndex) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (tasks[taskIndex].status === "completed") {
    tasks.splice(taskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayCompletedTasks();
  }
}
