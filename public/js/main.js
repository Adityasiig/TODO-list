document.addEventListener('DOMContentLoaded', () => {
  // Add CSS for confetti and animations
  const style = document.createElement('style');
  style.innerHTML = `
    .confetti {
      position: fixed;
      z-index: 1000;
      width: 10px;
      height: 10px;
      opacity: 1;
      pointer-events: none;
      border-radius: 2px;
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    
    .shake {
      animation: shake 0.4s ease-in-out;
    }
  `;
  document.head.appendChild(style);
  
  // Add animations for existing todo items
  animateExistingTodos();
  
  // Set up form submission
  setupFormSubmission();
  
  // Set up toggle and delete buttons
  setupButtonActions();
  
  // Add nice focus effect to the input field
  setupInputField();
});

// Animate existing todo items with a staggered delay
function animateExistingTodos() {
  const todoItems = document.querySelectorAll('.todo-item');
  todoItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 50 * index);
  });
}

// Set up form submission with AJAX
function setupFormSubmission() {
  const form = document.getElementById('todo-form');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const input = document.getElementById('task-input');
    const task = input.value.trim();
    
    if (!task) return;
    
    // Use AJAX to submit the form
    fetch('/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: `task=${encodeURIComponent(task)}`
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.success && data.todo) {
        addTodoToDOM(data.todo);
        input.value = '';
        input.focus();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Fall back to traditional form submission
      form.submit();
    });
  });
}

// Add a new todo item to the DOM
function addTodoToDOM(todo) {
  // Get the todo list
  let todoList = document.querySelector('#todo-list ul');
  
  // If there's no list yet, create one and remove the empty message
  if (!todoList) {
    const emptyMessage = document.querySelector('.empty-message');
    if (emptyMessage) {
      emptyMessage.remove();
    }
    
    todoList = document.createElement('ul');
    document.querySelector('#todo-list').appendChild(todoList);
  }
  
  // Create the new todo item
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.id = todo.id;
  
  li.innerHTML = `
    <span class="todo-text">${todo.task}</span>
    <div class="todo-actions">
      <a href="/toggle/${todo.id}" class="toggle-btn">○</a>
      <a href="/delete/${todo.id}" class="delete-btn">×</a>
    </div>
  `;
  
  // Add the item to the list
  todoList.appendChild(li);
  
  // Add event listeners to the new buttons
  setupButtonAction(li.querySelector('.toggle-btn'), 'toggle');
  setupButtonAction(li.querySelector('.delete-btn'), 'delete');
  
  // Animate the new item
  li.style.opacity = '0';
  li.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    li.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    li.style.opacity = '1';
    li.style.transform = 'translateY(0)';
  }, 10);
}

// Set up toggle and delete button actions
function setupButtonActions() {
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  const deleteButtons = document.querySelectorAll('.delete-btn');
  
  toggleButtons.forEach(btn => setupButtonAction(btn, 'toggle'));
  deleteButtons.forEach(btn => setupButtonAction(btn, 'delete'));
}

// Set up a button action (toggle or delete)
function setupButtonAction(btn, action) {
  if (!btn) return;
  
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    
    const li = this.closest('.todo-item');
    const id = li.dataset.id;
    
    if (action === 'toggle') {
      // Toggle the completed state
      const isCompleted = li.classList.toggle('completed');
      
      // Update the button text
      this.textContent = isCompleted ? '✓' : '○';
      
      // Show confetti if completing
      if (isCompleted) {
        const rect = this.getBoundingClientRect();
        showConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    } else if (action === 'delete') {
      // Animate removal
      li.classList.add('shake');
      
      setTimeout(() => {
        li.style.opacity = '0';
        li.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
          li.remove();
          
          // Show empty message if no more todos
          const todoItems = document.querySelectorAll('.todo-item');
          if (todoItems.length === 0) {
            const todoList = document.querySelector('#todo-list');
            const ul = todoList.querySelector('ul');
            if (ul) ul.remove();
            
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'No tasks yet. Add a task to get started!';
            todoList.appendChild(emptyMessage);
          }
        }, 300);
      }, 300);
    }
    
    // Send the action to the server
    fetch(`/${action}/${id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      }
    }).catch(error => {
      console.error(`Error with ${action}:`, error);
      // Fall back to traditional link navigation
      window.location.href = btn.href;
    });
  });
}

// Show confetti effect
function showConfetti(x, y) {
  const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6'];
  const confettiCount = 30;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.position = 'fixed';
    confetti.style.zIndex = '1000';
    confetti.style.width = `${5 + Math.random() * 5}px`;
    confetti.style.height = confetti.style.width;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = '50%';
    confetti.style.left = `${x}px`;
    confetti.style.top = `${y}px`;
    
    document.body.appendChild(confetti);
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 60;
    const destX = distance * Math.cos(angle);
    const destY = distance * Math.sin(angle);
    
    confetti.style.transition = 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
    
    setTimeout(() => {
      confetti.style.opacity = '0';
      confetti.style.transform = `translate(${destX}px, ${destY}px) rotate(${Math.random() * 360}deg)`;
    }, 10);
    
    setTimeout(() => {
      document.body.removeChild(confetti);
    }, 600);
  }
}

// Setup input field effects
function setupInputField() {
  const todoInput = document.querySelector('.todo-form input');
  if (todoInput) {
    todoInput.addEventListener('focus', () => {
      document.querySelector('.todo-form').style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.2)';
    });
    
    todoInput.addEventListener('blur', () => {
      document.querySelector('.todo-form').style.boxShadow = '';
    });
    
    // Auto-focus the input field when page loads
    todoInput.focus();
  }
} 