//icon-color: green; icon-glyph: tasks;

let fm = FileManager.iCloud();
let folder = fm.joinPath(fm.documentsDirectory(), "TaskManager");
let path = fm.joinPath(folder, "tasks.json");

// Ensure files exists but should exist if running this script second.
if (!fm.fileExists(folder)) fm.createDirectory(folder);
if (!fm.fileExists(path)) fm.writeString(path, JSON.stringify([], null, 2));

await fm.downloadFileFromiCloud(path);
let raw = fm.readString(path);

let data;
try {
	data = JSON.parse(raw);
	if (!Array.isArray(data)) throw new Error("Not an array");
} catch (e) {
	throw new Error(`Failed to parse tasks.json: ${e.message}`);
}

// === Menu ===
let mainMenu = new Alert();
mainMenu.title = "Task Manager";
mainMenu.addAction("➕ Add Task");
mainMenu.addAction("🗑 Delete Task");
mainMenu.addCancelAction("Cancel");

let choice = await mainMenu.presentAlert();

if (choice === 0) {
	await addTask();
} else if (choice === 1){
	await deleteTask();
}

saveData();

function saveData() {
	fm.writeString(path, JSON.stringify(data,null,2));
	console.log("Tasks saved");
}

// === Add Task ===
async function addTask() {
	let alert = new Alert();
	alert.title = "New Task";
	alert.addTextField("Class", "");
	alert.addTextField("Description", "");
	alert.addTextField("Due Date (YYYY-MM-DD)", getToday());
	alert.addAction("Add");
	alert.addCancelAction("Cancel");

	let result = await alert.presentAlert();
	if (result === -1) return;

	let task = {
		class: alert.textFieldValue(0),
		description: alert.textFieldValue(1),
		dueDate: alert.textFieldValue(2)
	};

	data.push(task);
	await new Alert({ title: "Task Added", message: `${task.class}: ${task.description}` }).present();
}


// === Delete Task ===
async function deleteTask() {
	if (data.length === 0) {
		await new Alert({ title: "No Tasks", message: "There are no tasks to delete." }).present();
		return;
  }
	let menu = new Alert();
	menu.title = "Delete Task";
	data.forEach(task => menu.addAction(`${task.class}: ${task.description}`));
	menu.addCancelAction("Cancel");

	let index = await menu.presentAlert();
	if (index === -1) return;

	let task = data[index];
	data.splice(index, 1);

	await new Alert({ title: "🗑 Deleted", message: `Removed: ${task.class}: ${task.description}` }).present();
}

// Helper
function getToday() {
	let now = new Date();
	return now.toISOString().slice(0,10);
}
