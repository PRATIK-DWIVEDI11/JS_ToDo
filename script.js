/**
 * 🚀 Simple To-Do List Application
 * Manages a list of tasks, allowing users to add, complete, edit, and delete items.
 * Tasks are persisted using the browser's Local Storage.
 */

// --- DOM Element Selection ---
// Use const for elements that won't be reassigned.
const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

// --- Global State Management ---
const STORAGE_KEY = "todos";

/**
 * Loads todos from Local Storage.
 * Initializes with an empty array if no data is found or if parsing fails.
 * @returns {Array<{text: string, completed: boolean}>} The list of todos.
 */
const loadTodos = () => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        // If data exists, parse it; otherwise, return an empty array.
        return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
        console.error("Error loading or parsing todos from Local Storage:", error);
        return []; // Return empty array on error to prevent application crash
    }
};

let todos = loadTodos(); // The main array holding the application state.

/**
 * Saves the current 'todos' array to Local Storage.
 */
const saveTodos = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

// --- Core Utility Functions ---

/**
 * Handles the logic for marking a todo as complete/incomplete.
 * @param {number} index - The index of the todo in the 'todos' array.
 * @param {HTMLSpanElement} textSpan - The DOM element displaying the todo text.
 * @param {HTMLInputElement} checkbox - The checkbox DOM element.
 */
const handleCompletionToggle = (index, textSpan, checkbox) => {
    // Update the state
    todos[index].completed = checkbox.checked;

    // Apply or remove the visual strikethrough based on the new state
    textSpan.style.textDecoration = todos[index].completed ? "line-through" : "";

    saveTodos();
};

/**
 * Handles the logic for editing a todo item's text.
 * @param {number} index - The index of the todo in the 'todos' array.
 * @param {HTMLSpanElement} textSpan - The DOM element displaying the todo text.
 */
const handleEditTodo = (index, textSpan) => {
    const currentText = todos[index].text;
    const newText = prompt("Edit your to-do:", currentText);

    // Check if the user entered text and didn't press Cancel
    if (newText !== null) {
        const trimmedText = newText.trim();
        if (trimmedText) { // Ensure the new text isn't empty after trimming
            // Update the state
            todos[index].text = trimmedText;
            // Update the DOM
            textSpan.textContent = trimmedText;
            saveTodos();
        }
    }
};

/**
 * Handles the logic for deleting a todo item.
 * @param {number} index - The index of the todo in the 'todos' array.
 */
const handleDeleteTodo = (index) => {
    // Remove the todo from the state array
    todos.splice(index, 1);
    // Re-render the entire list to update the display
    render();
    saveTodos();
};


/**
 * Creates the DOM structure (<li>) for a single todo item.
 * Encapsulates all necessary events (complete, edit, delete).
 * @param {object} todo - The todo object: {text: string, completed: boolean}.
 * @param {number} index - The index of the todo in the 'todos' array for state manipulation.
 * @returns {HTMLLIElement} The complete <li> DOM node.
 */
function createTodoNode(todo, index) {
    const li = document.createElement("li");
    li.style.display = "flex"; // For better visual alignment
    li.style.alignItems = "center";
    li.style.marginBottom = "5px";

    // 1. Completion Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    // Event: Toggle completion status
    checkbox.addEventListener("change", () => handleCompletionToggle(index, textSpan, checkbox));


    // 2. To-Do Text Display
    const textSpan = document.createElement("span");
    textSpan.textContent = todo.text;
    textSpan.style.margin = "0 8px";
    textSpan.style.flexGrow = 1; // Allows text to take up available space

    // Initial visual state setup
    if (todo.completed) {
        textSpan.style.textDecoration = "line-through";
    }

    // Event: Double-click to edit
    textSpan.addEventListener("dblclick", () => handleEditTodo(index, textSpan));


    // 3. Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.marginLeft = "auto"; // Pushes button to the end

    // Event: Delete the todo
    deleteButton.addEventListener("click", () => handleDeleteTodo(index));


    // Append all parts to the list item
    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(deleteButton);

    return li;
}

// --- Rendering and Initialization ---

/**
 * Clears the current list and re-renders the entire todo list from the 'todos' array.
 * This function ensures the UI is always in sync with the state.
 */
function render() {
    // Clear all previous children from the list
    todoList.innerHTML = "";

    // Build and append a new node for each todo item
    todos.forEach((todo, index) => {
        const node = createTodoNode(todo, index);
        todoList.appendChild(node);
    });
}

/**
 * Adds a new todo item based on the input field's value.
 */
function addTodo() {
    const text = todoInput.value.trim();

    // Do nothing if the input is empty or just whitespace
    if (!text) {
        return;
    }

    // 1. Update the state array
    todos.push({
        text,
        completed: false
    });

    // 2. Clear the input field
    todoInput.value = "";

    // 3. Update the UI
    render();

    // 4. Persist the updated state
    saveTodos();
}

// --- Event Listeners and Initial Call ---

// Event listener for the "Add" button click
addButton.addEventListener("click", addTodo);

// Optional: Allow adding a todo by pressing 'Enter' key in the input field
todoInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addTodo();
    }
});

// Initial call to display any previously saved todos when the page loads
render();