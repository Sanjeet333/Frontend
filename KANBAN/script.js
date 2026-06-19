let tasksData = {};

const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
const columns = [todo, progress, done]
const tasks = document.querySelectorAll('.task');
let draggedItem = null;


function addTask(title, desc, column) {
    if (!title || !title.trim() || !desc || !desc.trim()) {
        return null;
    }

    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = 
        `<h2>${title}</h2>
        <p>${desc}</p>
        <button class="delete-btn">Delete</button>`

    column.appendChild(div);


    div.addEventListener("dragstart", (e) => {
        draggedItem = div;
    })

    const deleteButton = div.querySelector(".delete-btn");
    deleteButton.addEventListener("click", () => {
        div.remove();
        updateTaskCount();
    })

    return div;
}

function updateTaskCount() {
    columns.forEach((col) => {
        const tasks = col.querySelectorAll(".task"); 
        const count = col.querySelector(".right");
        
        tasksData[col.id] = Array.from(tasks).map(t => {
            return {
                title: t.querySelector("h2").innerText,
                desc: t.querySelector("p").innerText
            }
        })

        localStorage.setItem("tasks", JSON.stringify(tasksData));

        if (count) {
            count.innerText = tasks.length;
        }
    });
}

if(localStorage.getItem("tasks")) {
    const data = JSON.parse(localStorage.getItem("tasks"));

    for(const col in data) {
        const column = document.querySelector(`#${col}`);
        if(column) {
            data[col].forEach(task => {
                addTask(task.title, task.desc, column);
            })
        }
    }
    updateTaskCount();
}

tasks.forEach(task => {
    task.addEventListener("dragstart", (e) => {
        draggedItem = task;
    });
});

function addDragEventsOnColumn(column) {
    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add("hover-over");
    });
    column.addEventListener("dragleave", (e) => {
        e.preventDefault();
        column.classList.remove("hover-over");
    });
    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    column.addEventListener("drop", (e) => {
        e.preventDefault();

        if (draggedItem) {
            column.appendChild(draggedItem);
        }
        column.classList.remove("hover-over");
        updateTaskCount();
    });
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

const toggleModalButton = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".modal .bg");
const addTaskButton = document.querySelector("#add-new-task");

toggleModalButton.addEventListener("click", () => {
    modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
}); 


addTaskButton.addEventListener("click", () => {
    const taskTitleInput = document.querySelector("#task-title");
    const taskDescInput = document.querySelector("#task-desc");

    const taskTitle = taskTitleInput.value;
    const taskDesc = taskDescInput.value;

    if (taskTitle.trim() === "" || taskDesc.trim() === "") {
        alert("Bhai, Title aur Description dono bharna zaroori hai!");
        return;
    }


    addTask(taskTitle, taskDesc, todo);
    updateTaskCount();

    modal.classList.remove("active");
    

    taskTitleInput.value = "";
    taskDescInput.value = "";
});