document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const form = document.getElementById('todo-form');
  const input = document.getElementById('task-input');
  const todoList = document.getElementById('todo-list');
  const emptyMessage = document.querySelector('.empty-message');
  const taskSummary = document.getElementById('task-summary');
  const completedCount = document.getElementById('completed-count');
  const totalCount = document.getElementById('total-count');
  const progress = document.getElementById('progress');
  const container = document.querySelector('.container');
  
  let todos = [];

  // Initialize the UI
  fetchTodos();
  initTiltEffect();
  addMouseInteractionEffects();
  initKeyboardShortcuts();
  
  // Event delegation for dynamic elements
  document.addEventListener('click', handleClicks);
  
  // Form submission
  form.addEventListener('submit', handleFormSubmit);

  // Keyboard shortcuts
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Add new task with Alt+N
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        input.focus();
      }
      
      // Clear completed with Alt+C
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        clearCompleted();
      }
    });
  }

  // Handle clicks with event delegation
  function handleClicks(e) {
    // Toggle button clicks
    if (e.target.classList.contains('toggle-btn')) {
      e.preventDefault();
      const id = e.target.dataset.id;
      if (id) toggleTodo(id);
      return;
    }
    
    // Delete button clicks
    if (e.target.classList.contains('delete-btn')) {
      e.preventDefault();
      const id = e.target.dataset.id;
      if (id) deleteTodo(id);
      return;
    }
    
    // Add ripple effect on buttons
    if (e.target.tagName === 'BUTTON') {
      createRippleEffect(e);
    }
  }

  // Form submission handler
  function handleFormSubmit(e) {
    e.preventDefault();
    
    const task = input.value.trim();
    if (!task) return;
    
    // Use the API to add a new todo
    fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        todos.unshift(data.todo);
        input.value = '';
        input.focus();
        renderTodos();
        updateTaskSummary();
        checkCompletedTasks();
        
        // Add effect for new todo
        setTimeout(() => {
          const firstTodo = document.querySelector('.todo-item');
          if (firstTodo) {
            firstTodo.classList.add('highlight-new');
            setTimeout(() => {
              firstTodo.classList.remove('highlight-new');
            }, 1000);
          }
        }, 100);
        
        // Shake the input slightly for feedback
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 400);
        
        // Play add sound
        playSound('add');
      }
    })
    .catch(error => {
      console.error('Error adding todo:', error);
    });
  }

  // Fetch todos from the API
  function fetchTodos() {
    fetch('/api/todos')
      .then(response => response.json())
      .then(data => {
        todos = data.todos || [];
        renderTodos();
        updateTaskSummary();
        checkCompletedTasks();
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
      });
  }

  // Toggle todo status
  function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    // Toggle status
    const newStatus = !todo.completed;
    
    // Update API
    fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: newStatus })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Update local state
        todos = todos.map(t => 
          t.id === id ? { ...t, completed: newStatus } : t
        );
        
        renderTodos();
        updateTaskSummary();
        checkCompletedTasks();
        
        // Sound feedback
        playSound(newStatus ? 'complete' : 'uncomplete');
        
        // Check if all tasks are completed
        if (newStatus && todos.every(t => t.completed)) {
          showCelebration();
        }
      }
    })
    .catch(error => {
      console.error('Error toggling todo:', error);
    });
  }

  // Delete a todo
  function deleteTodo(id) {
    // Delete from API
    fetch(`/api/todos/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Remove from local state
        todos = todos.filter(t => t.id !== id);
        
        renderTodos();
        updateTaskSummary();
        checkCompletedTasks();
        
        // Sound feedback
        playSound('delete');
      }
    })
    .catch(error => {
      console.error('Error deleting todo:', error);
    });
  }

  // Clear completed todos
  function clearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);
    if (completedTodos.length === 0) return;
    
    // Confirm
    if (!confirm('Are you sure you want to clear all completed tasks?')) {
      return;
    }
    
    // Delete each completed todo
    const deletePromises = completedTodos.map(todo => 
      fetch(`/api/todos/${todo.id}`, { method: 'DELETE' })
        .then(response => response.json())
    );
    
    Promise.all(deletePromises)
      .then(() => {
        // Remove from local state
        todos = todos.filter(todo => !todo.completed);
        
        renderTodos();
        updateTaskSummary();
        checkCompletedTasks();
        
        // Sound feedback
        playSound('clear');
      })
      .catch(error => {
        console.error('Error clearing completed todos:', error);
      });
  }

  // Render todos to the DOM
  function renderTodos() {
    if (todos.length === 0) {
      todoList.innerHTML = '<p class="empty-message">No tasks yet. Add a task to get started!</p>';
      removeClearButton();
      return;
    }
    
    // Create list
    const ul = document.createElement('ul');
    
    todos.forEach(todo => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.dataset.id = todo.id;
      
      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = todo.task;
      
      const actions = document.createElement('div');
      actions.className = 'todo-actions';
      
      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'toggle-btn';
      toggleBtn.dataset.id = todo.id;
      toggleBtn.textContent = todo.completed ? '✓' : '○';
      
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'delete-btn';
      deleteBtn.dataset.id = todo.id;
      deleteBtn.textContent = '×';
      
      actions.appendChild(toggleBtn);
      actions.appendChild(deleteBtn);
      
      li.appendChild(span);
      li.appendChild(actions);
      ul.appendChild(li);
    });
    
    todoList.innerHTML = '';
    todoList.appendChild(ul);
    
    // Add clear button if there are completed tasks
    if (todos.some(todo => todo.completed)) {
      createClearButton();
    } else {
      removeClearButton();
    }
    
    // Animate items
    animateItems();
  }
  
  // Animate todo items
  function animateItems() {
    const items = document.querySelectorAll('.todo-item');
    items.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.05}s`;
      item.classList.add('animate-in');
    });
  }
  
  // Update task summary and progress bar
  function updateTaskSummary() {
    if (todos.length === 0) {
      if (taskSummary) taskSummary.style.display = 'none';
      return;
    }
    
    if (taskSummary) {
      taskSummary.style.display = 'block';
      const completed = todos.filter(todo => todo.completed).length;
      const total = todos.length;
      
      // Update counts
      if (completedCount) animateCounter(completedCount, completed);
      if (totalCount) animateCounter(totalCount, total);
      
      // Update progress bar
      const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
      if (progress) animateProgressBar(percentage);
      
      // Add color classes based on percentage
      updateProgressColor(percentage);
    }
  }
  
  // Animate counter values
  function animateCounter(element, targetValue) {
    const currentValue = parseInt(element.textContent) || 0;
    const duration = 500; // ms
    const step = 1000 / 60; // 60fps
    const increment = (targetValue - currentValue) / (duration / step);
    
    let currentStep = 0;
    const totalSteps = duration / step;
    
    function updateCounter() {
      currentStep++;
      const newValue = currentValue + increment * currentStep;
      
      if (currentStep >= totalSteps) {
        element.textContent = targetValue;
        return;
      }
      
      element.textContent = Math.round(newValue);
      requestAnimationFrame(updateCounter);
    }
    
    updateCounter();
  }
  
  // Animate progress bar
  function animateProgressBar(targetPercentage) {
    const duration = 800; // ms
    const startPercentage = parseFloat(progress.style.width) || 0;
    const startTime = performance.now();
    
    function updateProgress(currentTime) {
      const elapsed = currentTime - startTime;
      
      if (elapsed >= duration) {
        progress.style.width = `${targetPercentage}%`;
        return;
      }
      
      const easedProgress = easeOutCubic(elapsed / duration);
      const currentPercentage = startPercentage + (targetPercentage - startPercentage) * easedProgress;
      
      progress.style.width = `${currentPercentage}%`;
      requestAnimationFrame(updateProgress);
    }
    
    requestAnimationFrame(updateProgress);
  }
  
  // Easing function for smoother animation
  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }
  
  // Update progress color based on percentage
  function updateProgressColor(percentage) {
    const progressBar = document.getElementById('progress');
    if (!progressBar) return;
    
    progressBar.classList.remove('low', 'medium', 'high', 'complete');
    
    if (percentage < 30) {
      progressBar.classList.add('low');
    } else if (percentage < 70) {
      progressBar.classList.add('medium');
    } else if (percentage < 100) {
      progressBar.classList.add('high');
    } else {
      progressBar.classList.add('complete');
    }
  }
  
  // Show celebration when all tasks are completed
  function showCelebration() {
    // Confetti from multiple positions
    showConfetti(window.innerWidth / 4, 0);
    showConfetti(window.innerWidth / 2, 0);
    showConfetti(3 * window.innerWidth / 4, 0);
    
    // Celebration sound
    playSound('celebration');
    
    // Create celebration message
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.textContent = '🎉 All tasks completed! 🎉';
    document.body.appendChild(celebration);
    
    // Remove after 3 seconds
    setTimeout(() => {
      celebration.classList.add('fade-out');
      setTimeout(() => celebration.remove(), 1000);
    }, 3000);
  }
  
  // Sound effects
  function playSound(type) {
    // Create audio context only when needed (to comply with autoplay policies)
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    switch (type) {
      case 'add':
        // High-pitched click
        playTone(audioCtx, 880, 0.1, 0.05);
        break;
      case 'complete':
        // Pleasing complete sound (major chord)
        playChord(audioCtx, [440, 550, 660]);
        break;
      case 'uncomplete':
        // Reverse of complete sound
        playTone(audioCtx, 440, 0.2, 0.1, 'triangle');
        break;
      case 'delete':
        // Short low sound
        playTone(audioCtx, 220, 0.1, 0.05, 'sawtooth');
        break;
      case 'clear':
        // Swoosh down
        playSweep(audioCtx, 880, 220, 0.3);
        break;
      case 'celebration':
        // Happy chord progression
        setTimeout(() => playChord(audioCtx, [261.63, 329.63, 392]), 0);
        setTimeout(() => playChord(audioCtx, [293.66, 349.23, 440]), 300);
        setTimeout(() => playChord(audioCtx, [329.63, 415.30, 493.88]), 600);
        setTimeout(() => playChord(audioCtx, [349.23, 440, 523.25]), 900);
        break;
    }
  }
  
  // Play a simple tone
  function playTone(audioCtx, frequency, duration, volume = 0.1, type = 'sine') {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    
    // Fade out to avoid clicks
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    // Stop after duration
    setTimeout(() => {
      oscillator.stop();
    }, duration * 1000);
  }
  
  // Play a frequency sweep
  function playSweep(audioCtx, startFreq, endFreq, duration) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = startFreq;
    gainNode.gain.value = 0.1;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    
    // Frequency sweep
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + duration);
    
    // Fade out
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    // Stop after duration
    setTimeout(() => {
      oscillator.stop();
    }, duration * 1000);
  }
  
  // Play a chord
  function playChord(audioCtx, frequencies) {
    frequencies.forEach(freq => {
      playTone(audioCtx, freq, 0.3, 0.03);
    });
  }
  
  // Add tilt effect to main container
  function initTiltEffect() {
    // Only on larger screens
    if (window.innerWidth < 768) return;
    
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top; // y position within the element
      
      // Calculate the tilt angle (maximum 5 degrees)
      const tiltX = ((y / rect.height) * 10) - 5;
      const tiltY = (-(x / rect.width) * 10) + 5;
      
      // Apply the tilt transform (smooth transition is in CSS)
      container.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    
    container.addEventListener('mouseleave', () => {
      // Reset the transform when mouse leaves
      container.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  }
  
  // Add mouse interaction effects
  function addMouseInteractionEffects() {
    // Todo item hover tracking
    todoList.addEventListener('mousemove', (e) => {
      const todoItem = e.target.closest('.todo-item');
      if (!todoItem) return;
      
      const rect = todoItem.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top; // y position within the element
      
      // Calculate % position
      const posX = x / rect.width;
      const posY = y / rect.height;
      
      // Apply subtle transform
      todoItem.style.transform = `translateY(-3px) scale(1.01) perspective(500px) rotateX(${(posY - 0.5) * 5}deg) rotateY(${(posX - 0.5) * 5}deg)`;
    });
    
    todoList.addEventListener('mouseleave', (e) => {
      const todoItem = e.target.closest('.todo-item');
      if (!todoItem) return;
      
      todoItem.style.transform = '';
    }, true);
  }
  
  // Create ripple effect on button clicks
  function createRippleEffect(e) {
    const button = e.target;
    if (!button.classList.contains('toggle-btn') && 
      !button.classList.contains('delete-btn') && 
      !button.type !== 'submit') {
      return;
    }
    
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.position = 'absolute';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    circle.style.transform = 'scale(0)';
    circle.style.transition = 'all 0.3s ease-out';
    circle.style.pointerEvents = 'none';
    
    // Calculate position relative to the button
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - diameter / 2;
    const y = e.clientY - rect.top - diameter / 2;
    
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    
    button.appendChild(circle);
    
    // Grow the circle
    setTimeout(() => {
      circle.style.transform = 'scale(2)';
      circle.style.opacity = '0';
      
      // Remove the circle after animation
      setTimeout(() => {
        circle.remove();
      }, 400);
    }, 10);
  }
  
  // Create clear completed button
  function createClearButton() {
    // Check if button already exists
    if (document.querySelector('.clear-button')) return;
    
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear Completed';
    clearButton.className = 'clear-button';
    clearButton.addEventListener('click', clearCompleted);
    
    // Insert after todo list
    todoList.after(clearButton);
    
    // Animate in
    setTimeout(() => clearButton.classList.add('visible'), 10);
  }
  
  // Remove clear completed button
  function removeClearButton() {
    const clearButton = document.querySelector('.clear-button');
    if (!clearButton) return;
    
    clearButton.classList.remove('visible');
    setTimeout(() => clearButton.remove(), 300);
  }
  
  // Check if all tasks are completed
  function checkCompletedTasks() {
    if (todos.length > 0 && todos.every(todo => todo.completed)) {
      showCelebration();
    }
  }
  
  // Show confetti particles at point
  function showConfetti(x, y, amount = 30) {
    for (let i = 0; i < amount; i++) {
      createConfettiParticle(x, y);
    }
  }
  
  // Create a single confetti particle
  function createConfettiParticle(x, y) {
    const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
    
    const particle = document.createElement('div');
    particle.className = 'confetti';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Random position around x,y
    const startX = x + (Math.random() - 0.5) * 100;
    const startY = y - 20;
    
    // Random size
    const size = Math.random() * 10 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random rotation
    const rotation = Math.random() * 360;
    particle.style.transform = `rotate(${rotation}deg)`;
    
    // Set starting position
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    
    document.body.appendChild(particle);
    
    // Animate the particle
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 5 + 2;
    const rotationSpeed = (Math.random() - 0.5) * 20;
    
    let posX = startX;
    let posY = startY;
    let velX = Math.cos(angle) * velocity;
    let velY = Math.sin(angle) * velocity - 4; // Initial upward velocity
    
    const gravity = 0.1;
    let opacity = 1;
    
    function animateParticle() {
      // Apply gravity
      velY += gravity;
      
      // Update position
      posX += velX;
      posY += velY;
      
      // Update rotation
      const currentRotation = parseFloat(particle.style.transform.replace(/[^0-9.]/g, '')) || 0;
      particle.style.transform = `rotate(${currentRotation + rotationSpeed}deg)`;
      
      // Update position
      particle.style.left = `${posX}px`;
      particle.style.top = `${posY}px`;
      
      // Fade out as it falls
      opacity -= 0.01;
      particle.style.opacity = opacity;
      
      // Remove when opacity reaches 0 or particle goes off screen
      if (opacity <= 0 || posY > window.innerHeight) {
        particle.remove();
        return;
      }
      
      requestAnimationFrame(animateParticle);
    }
    
    requestAnimationFrame(animateParticle);
  }
}); 