// variables
const inputTask = document.querySelector("#input-task");
const btn = document.querySelector("button");
const ul = document.querySelector(".uliste");
const listeContainer = document.querySelector(".list-container");

let tasks = [];
let editingId = "";

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//----------------------------------------------------

const tasksStocked = JSON.parse(localStorage.getItem("tasks"));
if (tasksStocked) {
  tasks = tasksStocked;
  afficherTask();
}

// fonction ajouterNouvelleTask-----------------------------------
function ajouterNouvelleTask() {
  const task = {
    taskName: inputTask.value,
    id: Date.now(),
    done: false,
  };
  if (inputTask.value.trim() !== "") {
    tasks.push(task);
    inputTask.value = "";
    afficherTask();
    save();
  }
}
//fonction ajouter:-----------------------------------
function ajouterTask() {
  if (editingId !== "") {
    if (inputTask.value.trim() !== "") {
      //mode modification-----------------------------------
      const taskModificatiom = tasks.find((task) => editingId === task.id);
      if (taskModificatiom) {
        taskModificatiom.taskName = inputTask.value;
        save();
        editingId = "";
        afficherTask();
      } else {
        ajouterNouvelleTask();
      }
    }
  } else {
    //mode ajouter-----------------------------------
    ajouterNouvelleTask();
  }
}
btn.addEventListener("click", ajouterTask);

//fonction afficher-----------------------------------
function afficherTask() {
  ul.textContent = "";
  listeContainer.style.display = "block";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.setAttribute("class", "task");
    li.innerText = task.taskName;

    //btn area
    const div = document.createElement("div");
    div.setAttribute("class", "btn-area");

    //supprimer btn-----------------------------------
    const btnDelete = document.createElement("button");
    btnDelete.setAttribute("class", "btn-del");
    btnDelete.innerHTML = `<img src="trash-bin-outline.svg" width="20px" />`;

    btnDelete.onclick = function () {
      tasks = tasks.filter((taskToDelete) => taskToDelete.id !== task.id);
      save();
      afficherTask();
    };

    //modifier btn-----------------------------------
    const btnModify = document.createElement("button");
    btnModify.setAttribute("class", "btn-mod");
    btnModify.innerHTML = `<img src="pencil-sharp.svg" width="20px" />`;

    const btnCancel = document.createElement("button");
    btnCancel.innerText = "Cancel";
    btnCancel.setAttribute("class", "btn-cancel");
    btnModify.onclick = function () {
      editingId = task.id;
      inputTask.value = task.taskName;
      btnCancel.style.display = "block";
      btnCancel.onclick = function () {
        editingId = "";
        btnCancel.style.display = "none";
      };
    };

    //check btn-----------------------------------
    const check = document.createElement("button");
    check.setAttribute("class", "btn-check");
    check.innerHTML = task.done
      ? `<img src="eoutline.svg" width="20px" alt="unchecked"/>`
      : `<img src="ellipse.svg" width="20px" alt="checked"/>`;

    if (task.done) {
      li.classList.add("checked");
      btnModify.style.display = "none";
      btnDelete.style.display = "none";
    } else {
      li.classList.remove("checked");
    }
    check.onclick = function () {
      task.done = !task.done;
      save();
      afficherTask();
    };

    li.append(div);
    div.append(btnDelete);
    div.append(btnModify);
    div.append(btnCancel);
    div.append(check);
    ul.append(li);
  });
}
