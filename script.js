
const toggleDarkModeButton = document.getElementById("dark-mode-toggle");
let darkMode = true;

// Toggle Dark Mode
toggleDarkModeButton.addEventListener("click", () => {
    darkMode = !darkMode;
    if (!darkMode) {
        document.documentElement.style.setProperty("--bg-color", "#121212");
        document.documentElement.style.setProperty("--text-color", "#fff");
        document.documentElement.style.setProperty("--sidebar-bg", "#1c1c1c");
    } else {
        document.documentElement.style.setProperty("--bg-color", "#f7d7f3f7");
        document.documentElement.style.setProperty("--text-color", "#a80258");
        document.documentElement.style.setProperty("--sidebar-bg", "#fca7e8");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggle-sidebar");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("main-content");
    const personalTasks = [];
    const academicTasks = [];
    const accomplishments = [];
    const goals = [];
    const notes = [];

    // Show Profile by default
    displayProfile();

    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        sidebar.classList.toggle("hidden");
    });

    document.querySelectorAll(".nav-list a").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            const section = event.target.getAttribute("href").substring(1);

            if (section === "Profile") {
                displayProfile();
            } else if (section === "Ptasks") {
                displayTaskSection("Personal Tasks", personalTasks);
            } else if (section === "Atasks") {
                displayTaskSection("Academic Tasks", academicTasks);
            } else if (section === "Notes") {
                displayNotesSection();
            }

            // Ensure the sidebar remains visible after clicking a link
            sidebar.classList.add("open");
            sidebar.classList.remove("hidden");
        });
    });

    // Function to display the Profile section
    function displayProfile() {
        const totalTasksCompleted = personalTasks.filter(task => task.checked).length + academicTasks.filter(task => task.checked).length;
        
        mainContent.innerHTML = `
            <h2>Welcome to Productivity Tracker</h2>
            <p>This is your profile page. Here you can see your progress and manage your productivity tracker.</p>

            <section class="accomplishments">
                <h3>Accomplishments</h3>
                <ul>
                    ${accomplishments.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <form id="add-accomplishment">
                    <input type="text" id="accomplishment-input" placeholder="Add a new accomplishment" required>
                    <button type="submit">Add</button>
                </form>
            </section>

            <section class="task-stats">
                <h3>Total Tasks Completed</h3>
                <p>You have completed <strong>${totalTasksCompleted}</strong> tasks.</p>
            </section>

            <section class="yearly-goals">
                <h3>Yearly Goals</h3>
                <div class="goal">
                    ${goals.map(item => `
                        <p>${item}</p>
                    `).join('')}
                    <form id="add-goal">
                        <input type="text" id="goal-input" placeholder="Add a new goal" required>
                        <button type="submit">Add</button>
                    </form>
                </div>
            </section>

            <section class="notes">
                <h3>Notes</h3>
                <ul>
                    ${notes.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <form id="add-note">
                    <input type="text" id="note-input" placeholder="Add a new note" required>
                    <button type="submit">Add</button>
                </form>
            </section>
        `;

        // Add event listeners for adding accomplishments, goals, and notes
        document.getElementById("add-accomplishment").addEventListener("submit", event => {
            event.preventDefault();
            const accomplishmentInput = document.getElementById("accomplishment-input");
            const newAccomplishment = accomplishmentInput.value.trim();
            if (newAccomplishment) {
                accomplishments.push(newAccomplishment);
                displayProfile();
            }
            accomplishmentInput.value = '';
        });

        document.getElementById("add-goal").addEventListener("submit", event => {
            event.preventDefault();
            const goalInput = document.getElementById("goal-input");
            const newGoal = goalInput.value.trim();
            if (newGoal) {
                goals.push(newGoal);
                displayProfile();
            }
            goalInput.value = '';
        });

        document.getElementById("add-note").addEventListener("submit", event => {
            event.preventDefault();
            const noteInput = document.getElementById("note-input");
            const newNote = noteInput.value.trim();
            if (newNote) {
                notes.push(newNote);
                displayProfile();
            }
            noteInput.value = '';
        });
    }

    // Function to display task sections
    function displayTaskSection(title, taskArray) {
        mainContent.innerHTML = `
            <h2>${title}</h2>
            <form id="task-form">
                <input type="text" id="task-input" placeholder="Add a new task" required>
                <button type="submit">Add Task</button>
            </form>
            <ul id="task-list">
                ${taskArray
                    .map(
                        (task, index) =>
                            `<li data-index="${index}">
                                <input type="checkbox" class="task-checkbox" ${
                                    task.checked ? "checked" : ""
                                }>
                                <span class="${task.checked ? "completed" : ""}">${task.text}</span>
                                <button class="delete-task">🗑️</button>
                            </li>`
                    )
                    .join("")}
            </ul>
        `;

        const taskForm = document.getElementById("task-form");
        const taskInput = document.getElementById("task-input");
        const taskList = document.getElementById("task-list");

        // Handle adding tasks
        taskForm.addEventListener("submit", event => {
            event.preventDefault();
            const taskText = taskInput.value.trim();
            if (taskText) {
                taskArray.push({ text: taskText, checked: false });
                renderTaskList(taskArray);
                taskInput.value = "";
            }
        });

        // Handle task interactions (delete, strike out)
        taskList.addEventListener("click", event => {
            const listItem = event.target.closest("li");
            const index = listItem.dataset.index;

            if (event.target.classList.contains("delete-task")) {
                // Delete task
                taskArray.splice(index, 1);
                renderTaskList(taskArray);
            } else if (event.target.classList.contains("task-checkbox")) {
                // Strike out task
                taskArray[index].checked = event.target.checked;
                renderTaskList(taskArray);
            }
        });
    }

    // Function to render task list
    function renderTaskList(taskArray) {
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = taskArray
            .map(
                (task, index) =>
                    `<li data-index="${index}">
                        <input type="checkbox" class="task-checkbox" ${
                            task.checked ? "checked" : ""
                        }>
                        <span class="${task.checked ? "completed" : ""}">${task.text}</span>
                        <button class="delete-task">🗑️</button>
                    </li>`
            )
            .join("");
    }

    // Function to display Notes section
    function displayNotesSection() {
        mainContent.innerHTML = `
            <h2>Saved Notes</h2>
            <form id="note-form">
                <input type="text" id="note-title" placeholder="Note Title" required>
                <textarea id="note-content" placeholder="Note Content" rows="4" required></textarea>
                <button type="submit">Add Note</button>
            </form>
            <div class="notes-grid" id="notes-grid"></div>
        `;
    
        const noteForm = document.getElementById("note-form");
        const notesGrid = document.getElementById("notes-grid");
    
        noteForm.addEventListener("submit", event => {
            event.preventDefault();
            const title = document.getElementById("note-title").value.trim();
            const content = document.getElementById("note-content").value.trim();
    
            if (title && content) {
                const note = { title, content };
                notes.push(note);
                renderNotes();
                noteForm.reset();
            }
        });
    
        renderNotes();
    
        function renderNotes() {
            notesGrid.innerHTML = notes
                .map(
                    (note, index) => `
                    <div class="note-card" data-index="${index}">
                        <h3>${note.title}</h3>
                        <p>${note.content}</p>
                        <button class="delete-note" data-index="${index}">Delete</button>
                    </div>
                `
                )
                .join("");
    
            // Add delete functionality
            document.querySelectorAll(".delete-note").forEach(button => {
                button.addEventListener("click", () => {
                    const index = button.dataset.index;
                    notes.splice(index, 1);
                    renderNotes();
                });
            });
        }
    }
    
});
