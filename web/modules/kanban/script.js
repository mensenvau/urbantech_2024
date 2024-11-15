document.addEventListener("DOMContentLoaded", () => {
  let taskId = 0;

  // Open the modal and set the target column ID
  function openModal(columnId) {
    document.getElementById("task-modal").style.display = "flex";
    document.getElementById("column-id").value = columnId; // Store column ID for later
  }

  // Close the modal
  function closeModal() {
    document.getElementById("task-modal").style.display = "none";
    document.getElementById("task-form").reset(); // Clear form inputs
  }

  // Handle clicks on the modal background
  function handleModalBackgroundClick(event) {
    const modalContent = document.querySelector(".modal-content");
    if (!modalContent.contains(event.target)) {
      closeModal(); // Close modal if click is outside the content
    }
  }

  // Add a task to a column based on the form input
  function addTask(event) {
    event.preventDefault();

    const columnId = document.getElementById("column-id").value;
    const taskName = document.getElementById("task-name").value;
    const taskStart = document.getElementById("task-start").value;
    const taskEnd = document.getElementById("task-end").value;
    const taskDesc = document.getElementById("task-desc").value;

    const taskContainer = document.getElementById(columnId);
    // const taskContainer = column.querySelector(".task-container");

    const task = document.createElement("div");
    task.className = "task";
    task.draggable = true;
    task.id = `task-${taskId++}`;
    
    // Create task inner structure with labels
    task.innerHTML = `
      <div class="task-content">
        <strong class="task-title">Title:</strong> <span>${taskName}</span>
        <div class="task-desc">
          <strong>Description:</strong>
          <p class="desc-text">${taskDesc}</p>
          <p class="desc-text"><strong>Created at</strong>: ${taskStart}</p>
          <p class="desc-text"><strong>Due To:</strong> ${taskEnd}</p>
        </div>
      </div>
    `;
    
    
    // task.innerHTML = `<strong>${taskName}</strong><p>${taskStart}</p><p>${taskEnd}</p><p>${taskDesc}</p>`;

    // Add drag event listeners
    task.addEventListener("dragstart", handleDragStart);
    task.addEventListener("dragend", handleDragEnd);

    taskContainer.appendChild(task);
    closeModal(); // Close the modal after adding the task
  }

  // Drag-and-drop handlers
  function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.target.classList.add("dragging");
  }

  function handleDragEnd(event) {
    event.target.classList.remove("dragging");
  }

  function allowDrop(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    const task = document.getElementById(taskId);
    const taskContainer = event.target.closest(".task-container");
    if (taskContainer) {
      taskContainer.appendChild(task);
    }
  }

  // Add drag-and-drop listeners to columns
  document.querySelectorAll(".task-container").forEach((container) => {
    container.addEventListener("dragover", allowDrop);
    container.addEventListener("drop", handleDrop);
  });

  // Add event listener for form submission
  document.getElementById("task-form").addEventListener("submit", addTask);

  // Expose modal functions to global scope
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.handleModalBackgroundClick = handleModalBackgroundClick;
});
