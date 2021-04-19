let lastTaskId = 0;
let currentTheme = "l";
let numberOfCompleted = 0;
let numberOfTasks = 0;
let numberOfActiveTasks = 0;
let currentControl = "all";
let tasks = [];

window.onload = () => {
  let textItem = document.querySelector("#text-box-in");
  textItem.focus();
};
function switchThemeClicked(e) {
  let root = document.querySelector(":root");
  let background = document.querySelector("#background");
  let icon = e.children[0];
  let textItem = document.querySelector("#text-box-in");
  textItem.focus();

  if (currentTheme === "l") {
    icon.setAttribute("class", "bi bi-sun-fill");
    background.style.backgroundImage = "url('./images/bg-desktop-dark.jpg')";
    root.style.setProperty("--cr1", "hsl(235, 21%, 11%)");
    root.style.setProperty("--cr2", "#cacde820");
    root.style.setProperty("--cr5", "hsl(234, 39%, 85%)");
    root.style.setProperty("--header-cr", "hsl(235, 24%, 19%)");
    currentTheme = "d";
  } else {
    icon.setAttribute("class", "bi bi-moon-fill");
    background.style.backgroundImage = "url('./images/bg-desktop-light.jpg')";
    root.style.setProperty("--cr1", "hsl(0, 0%, 98%)");
    root.style.setProperty("--cr2", "hsl(236, 33%, 92%)");
    root.style.setProperty("--cr5", "hsl(235, 19%, 35%)");
    root.style.setProperty("--header-cr", "hsl(0, 0%, 100%)");
    currentTheme = "l";
  }
}
function taskCheckClicked(e) {
  let isChecked = e.getAttribute("aria-checked");
  let circle = e.children[0];
  let text = e.parentElement.children[2];
  let task = e.parentElement;
  let taskId = parseInt(task.children[0].innerText);
  let itemsLeft = document.querySelectorAll("#controls p")[0];

  if (isChecked === "false" || isChecked === null) {
    e.setAttribute("aria-checked", "true");
    circle.style.background = "transparent";
    e.style.background =
      "linear-gradient(-90deg, var(--main-cr), var(--sec-cr) 80%)";
    text.style.textDecoration = "line-through";
    text.style.opacity = ".5";
    numberOfCompleted++;
    numberOfActiveTasks--;
    tasks.forEach((t) => {
      if (t.id === taskId) {
        t.isChecked = true;
      }
    });
    if (currentControl === "active") {
      let taskWidth = getComputedStyle(task).getPropertyValue("width");
      task.style.transform = `translateX(${taskWidth})`;
      setTimeout(() => {
        task.remove();
        if (numberOfActiveTasks === 0) {
          let textNo = document.querySelector("#tasks-no");
          textNo.style.display = "flex";
        }
      }, 300);
    }
  } else {
    e.setAttribute("aria-checked", "false");
    circle.style.background = "var(--header-cr)";
    e.style.removeProperty("background");
    text.style.textDecoration = "none";
    text.style.opacity = "1";
    tasks.forEach((t) => {
      if (t.id === taskId) {
        t.isChecked = false;
      }
    });
    numberOfCompleted--;
    numberOfActiveTasks++;
    if (currentControl === "completed") {
      let taskWidth = getComputedStyle(task).getPropertyValue("width");
      task.style.transform = `translateX(${taskWidth})`;
      setTimeout(() => {
        task.remove();
        if (numberOfCompleted === 0) {
          let textNo = document.querySelector("#tasks-no");
          textNo.style.display = "flex";
        }
      }, 300);
    }
  }
  itemsLeft.innerText = `${numberOfActiveTasks} items left`;
}
function removeTaskClicked(e) {
  let task = e.parentElement;
  let taskWidth = getComputedStyle(task).getPropertyValue("width");
  let taskId = parseInt(task.children[0].innerText);
  let isChecked = false;
  task.style.transform = `translateX(${taskWidth})`;
  let itemsLeft = document.querySelectorAll("#controls p")[0];

  let count = 0;
  tasks.forEach((t) => {
    if (t.id === taskId && t.isChecked === false) {
      tasks.splice(count, 1);
      isChecked = false;
    } else if (t.id === taskId && t.isChecked === true) {
      tasks.splice(count, 1);
      isChecked = true;
    }
    count++;
  });
  setTimeout(() => {
    task.remove();
    let textNo = document.querySelector("#tasks-no");
    numberOfTasks--;
    if (currentControl === "all") {
      if (isChecked) {
        numberOfCompleted--;
      } else if (!isChecked) {
        numberOfActiveTasks--;
      }
      if (numberOfTasks === 0) {
        textNo.style.display = "flex";
        numberOfActiveTasks = 0;
        numberOfCompleted = 0;
      }
    } else if (currentControl === "active") {
      numberOfActiveTasks--;
      if (numberOfActiveTasks === 0) {
        textNo.style.display = "flex";
        numberOfActiveTasks = 0;
      }
    } else if (currentControl === "completed") {
      numberOfCompleted--;
      if (numberOfCompleted === 0) {
        textNo.style.display = "flex";
        numberOfCompleted = 0;
      }
    }
    itemsLeft.innerText = `${numberOfActiveTasks} items left`;
  }, 300);
}
function createNoMessage(message) {
  let taskNo = document.createElement("div");
  taskNo.setAttribute("id", "tasks-no");
  taskNo.style.display = "none";
  taskNo.innerHTML = `
  <img id="tasks-img" src="./images/notes.png" />
  <p id="tasks-hint">${message}</p>`;
  return taskNo;
}
function createNewTask(id, content, checked) {
  let task = document.createElement("div");
  task.setAttribute("class", "task");
  task.innerHTML = `
            <span>${id}</span>
            <div class="task-cirlce-background" onclick="taskCheckClicked(this)" aria-checked="${checked.toString()}">
              <div class="task-circle">
                <i class="bi bi-check"></i>
              </div>
            </div>
            <p class="task-text">${content}</p>
            <button class="remove-task-btn" onclick="removeTaskClicked(this)">
              <i class="bi bi-x"></i>
            </button>`;

  let background = task.children[1];
  let circle = background.children[0];
  let text = task.children[2];

  if (checked === true) {
    task.setAttribute("aria-checked", "true");
    circle.style.background = "transparent";
    background.style.background =
      "linear-gradient(-90deg, var(--main-cr), var(--sec-cr) 80%)";
    text.style.textDecoration = "line-through";
    text.style.opacity = ".5";
  }
  return task;
}
function addTaskTo(container, task, isAfter) {
  if (isAfter === true) {
    container.append(task);
  } else {
    container.prepend(task);
  }
}
function clearContentsOf(element) {
  element.innerHTML = "";
}
function addTaskClicked() {

  let textItem = document.querySelector("#text-box-in");
  let text = textItem.value.trim();
  if (text === "") return;

  let tasksContainer = document.querySelector("#tasks");
  let textNo = document.querySelector("#tasks-no");
  let itemsLeft = document.querySelectorAll("#controls p")[0];
  textItem.focus();

  textNo.style.display = "none";
  textItem.value = "";

  if (currentControl !== "all")
    AllClicked(
      document.querySelectorAll("#controls div:nth-child(2) button")[0]
    );
  lastTaskId++;
  numberOfTasks++;
  numberOfActiveTasks++;
  itemsLeft.innerText = `${numberOfActiveTasks} items left`;
  tasks.unshift({
    id: lastTaskId,
    content: text,
    isChecked: false,
  });
  addTaskTo(tasksContainer, createNewTask(lastTaskId, text, false));
}
function textBoxKeyUp(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.querySelector("#text-box-submit-btn").click();
  }
}
function changeActiveStateOfControls(e) {
  let controls = Array.from(
    document.querySelector("#controls div:nth-child(2)").children
  );
  controls.forEach((c) => {
    if (c.getAttribute("id") === "active-control-btn") {
      c.removeAttribute("id");
    }
  });
  e.setAttribute("id", "active-control-btn");
}
function AllClicked(e) {
  changeActiveStateOfControls(e);

  let tasksContainer = document.querySelector("#tasks");
  clearContentsOf(tasksContainer);
  addTaskTo(tasksContainer, createNoMessage("Nothing to show"));
  for (t of tasks) {
    addTaskTo(
      tasksContainer,
      createNewTask(t.id, t.content, t.isChecked),
      true
    );
  }
  if (numberOfTasks === 0) {
    let tasksNo = document.querySelector("#tasks-no");
    tasksNo.style.display = "flex";
  }
  currentControl = "all";
}
function ActiveClicked(e) {
  changeActiveStateOfControls(e);

  let tasksContainer = document.querySelector("#tasks");
  clearContentsOf(tasksContainer);
  addTaskTo(tasksContainer, createNoMessage("No active tasks"));
  let activeTasks = tasks.filter((t) => t.isChecked === false);
  for (t of activeTasks) {
    addTaskTo(
      tasksContainer,
      createNewTask(t.id, t.content, t.isChecked),
      true
    );
  }
  if (numberOfActiveTasks === 0) {
    let tasksNo = document.querySelector("#tasks-no");
    tasksNo.style.display = "flex";
  }
  currentControl = "active";
}
function CompletedClicked(e) {
  changeActiveStateOfControls(e);

  let tasksContainer = document.querySelector("#tasks");
  clearContentsOf(tasksContainer);
  addTaskTo(tasksContainer, createNoMessage("No completed tasks"));
  let completedTasks = tasks.filter((t) => t.isChecked === true);
  for (t of completedTasks) {
    addTaskTo(
      tasksContainer,
      createNewTask(t.id, t.content, t.isChecked),
      true
    );  
  }
  if (numberOfCompleted === 0) {
    let tasksNo = document.querySelector("#tasks-no");
    tasksNo.style.display = "flex";
  }
  currentControl = "completed";    
}
function clearCompletedClicked(e) { 
  let itemsLeft = document.querySelectorAll("#controls p")[0];
  numberOfCompleted = 0;  
  let tempTasks = tasks.filter(t => t.isChecked === false);
  numberOfTasks -= (tasks.length - tempTasks.length);
  tasks = tempTasks;
  numberOfActiveTasks = numberOfTasks;
  itemsLeft.innerText = `${numberOfActiveTasks} items left`;
  AllClicked(document.querySelectorAll("#controls div:nth-child(2) button")[0]);
}
