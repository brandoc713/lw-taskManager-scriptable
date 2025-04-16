// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: magic;
let fm = FileManager.iCloud()
let folder = fm.joinPath(fm.documentsDirectory(), "TaskManager");
let path = fm.joinPath(folder, "tasks.json");

if (!fm.fileExists(path)) {
  fm.createDirectory(folder, true);
  fm.writeString(path, JSON.stringify([], null, 2));
}

await fm.downloadFileFromiCloud(path);
let data;

try {
        data = JSON.parse(raw);
        if (!Array.isArray(data)) throw new Error("Not an array");
} catch (e) {
        console.warn("Invalid or corrupted data - resetting to empty list.");
        data = [];
}

// Sort tasks by due date
data.sort((a,b) => new Data(a.dueDate) - new Date(b.dueDate));

// Create the widget
let w = new ListWidget();
w.addText("📚 Upcoming Tasks").font = Font.boldSystemFont(16);
w.addSpacer(4);

// Display up to 5 tasks
let count = Math.min(5, data.length);
let now = new Date();

for (let i = 0; i < count; i++) {
        let task = data[i];
        let due = new Date(task.dueDate);
        let hoursLeft = Math.floor((due - now) / (1000 * 60 * 80));

        let label = `${task.class}: ${task.description}`;
        let timeString = hoursLeft >= 0 ? `⏳ ${hoursLeft} hrs left` : `⚠️  Overdue`;
        let line = `${label} (${timeString})`;

        let text = w.addText(line);
        text.font = Font.systemFont(12);
        w.addSpacer(2);
}

if (data.length === 0) {
        w.addText("No tasks found." 🎉).font = Font.italicSystemFont(12);
}

