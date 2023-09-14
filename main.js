let theInput = document.querySelector(".form-input");
let submit = document.querySelector(".add");
let tasksContainer = document.querySelector(".tasks-content");
let tasksCount = document.querySelector(".tasks-count span");
let tasksCompleted = document.querySelector(".tasks-completed span");
let noTasksMsg = document.querySelector(".no-tasks-message");

window.onload = function () {
	theInput.focus();
	if (tasksContainer.innerHTML == "") {
		createNoTasks();
	}
	calculateTasks();
};

// Function To Create No Tasks Message
function createNoTasks() {
	let msgSpan = document.createElement("span");
	let msgText = document.createTextNode("No Tasks To Show");
	msgSpan.appendChild(msgText);
	msgSpan.className = "no-tasks-message";
	tasksContainer.appendChild(msgSpan);
}

// empty array to store the tasks
let arrayOfTasks = [];
// check if there's tasks in local storage
if (localStorage.getItem("tasks")) {
	arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
}
function addDataToLocalStorageFrom() {
	window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}
function getDataFromLocalStorage() {
	let data = window.localStorage.getItem("tasks");
	if (data) {
		let tasks = JSON.parse(data);
		addElementToPageFrom(tasks);
	}
}
// trigger get data from local storage function
getDataFromLocalStorage();

// add task
submit.onclick = function () {
	if (theInput.value !== "") {
		addTaskToArray(theInput.value);
		theInput.value = "";
		calculateTasks();
		theInput.focus();
	} else {
		Swal.fire("Kindly provide a Task before proceeding further");
	}
};
document.onkeyup = function (e) {
	if (e.key === "Enter") {
		if (theInput.value !== "") {
			addTaskToArray(theInput.value);
			theInput.value = "";
			calculateTasks();
		}
	}
};

function addTaskToArray(taskText) {
	// task data
	const task = {
		id: Date.now(),
		title: taskText,
		completed: false,
	};
	// push task to array of tasks
	arrayOfTasks.push(task);
	// add task to page
	addElementToPageFrom(arrayOfTasks);
	// add tasks to local storage
	addDataToLocalStorageFrom(arrayOfTasks);
}
function addElementToPageFrom(arrayOfTasks) {
	// empty tasks div
	tasksContainer.innerHTML = "";
	// looping on array of tasks
	arrayOfTasks.forEach((task) => {
		// create main div
		let div = document.createElement("div");
		div.className = "task";
		// check if task is done
		if (task.completed) {
			div.className = "task done";
		}
		div.setAttribute("data-id", task.id);
		div.appendChild(document.createTextNode(task.title));

		// create delete button
		let deleteSpan = document.createElement("span");
		deleteSpan.className = "del";
		deleteSpan.appendChild(document.createTextNode("Delete"));
		// append button to main div
		div.appendChild(deleteSpan);
		// add task div to tasks container
		tasksContainer.appendChild(div);
	});

	if (arrayOfTasks.length >= 2) {
		// create deleteAll button
		let deleteAll = document.createElement("span");
		deleteAll.className = "delAll";
		deleteAll.appendChild(document.createTextNode("Delete All"));
		tasksContainer.appendChild(deleteAll);
	}
}

// click on task element
tasksContainer.addEventListener("click", (e) => {
	// delete button
	if (e.target.classList.contains("del")) {
		// remove task from local storage
		deleteTaskWith(e.target.parentElement.getAttribute("data-id"));
		// remove element from page
		e.target.parentElement.remove();
		// Check if there are no tasks remaining
		if (arrayOfTasks.length === 0) {
			tasksContainer.innerHTML = "";
			createNoTasks();
		}
		calculateTasks();
	}

	// deleteAll button
	if (e.target.classList.contains("delAll")) {
		deleteAllTasks();
	}

	// toggle task element
	if (e.target.classList.contains("task")) {
		// toggle completed for the task
		toggleStatusTaskWith(e.target.getAttribute("data-id"));
		// toggle done class
		e.target.classList.toggle("done");
		calculateTasks();
	}
});

function deleteTaskWith(taskId) {
	arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
	theInput.focus();
	addDataToLocalStorageFrom(arrayOfTasks);
}

function deleteAllTasks() {
	Swal.fire({
		title: `Are You Sure To Delete All Tasks ?`,
		text: "You won't be able to revert this!",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Yes, delete it!",
	}).then((result) => {
		if (result.isConfirmed) {
			tasksContainer.innerHTML = "";
			localStorage.removeItem("tasks");
			arrayOfTasks = [];
			addDataToLocalStorageFrom(arrayOfTasks);
			createNoTasks();
			calculateTasks();
			Swal.fire("Deleted!", "Your Tasks has been deleted.", "success");
			theInput.focus();
		}
	});
}

function toggleStatusTaskWith(taskId) {
	for (let i = 0; i < arrayOfTasks.length; i++) {
		if (arrayOfTasks[i].id == taskId) {
			arrayOfTasks[i].completed == false
				? (arrayOfTasks[i].completed = true)
				: (arrayOfTasks[i].completed = false);
		}
	}
	addDataToLocalStorageFrom(arrayOfTasks);
}

function calculateTasks() {
	// Calculate All Tasks
	tasksCount.innerHTML = document.querySelectorAll(
		".tasks-content .task"
	).length;
	// Calculate Completed Tasks
	tasksCompleted.innerHTML = document.querySelectorAll(
		".tasks-content .done"
	).length;
}
