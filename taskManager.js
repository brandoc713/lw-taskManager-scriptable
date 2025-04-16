// icon-color: cyan; icon-glyph: magic;

// Local test data
let data = [
  {
    "class": "Chin",
    "description": "Workbook 19",
    "dueDate": "2026-04-18"
  },
  {
    "class": "Math",
    "description": "Problem Set 4",
    "dueDate": "2026-04-20"
  }
];

// Sort tasks by due date
data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

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
  let hoursLeft = Math.floor((due - now) / (1000 * 60 * 60)); // Correct unit

  let label = `${task.class}: ${task.description}`;
  let timeString = hoursLeft >= 0 ? `⏳ ${hoursLeft} hrs left` : `⚠️ Overdue`;
  let line = `${label} (${timeString})`;

  let text = w.addText(line);
  text.font = Font.systemFont(12);
  w.addSpacer(2);
}

if (data.length === 0) {
  w.addText("No tasks found. 🎉").font = Font.italicSystemFont(12);
}

Script.setWidget(w);
Script.complete();

