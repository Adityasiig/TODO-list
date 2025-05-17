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
    
    // Load todos from localStorage
    let todos = JSON.parse(localStorage.getItem('todos') || '[]');
    
    // Initialize the UI
    renderTodos();
    updateTaskSummary();
    checkCompletedTasks(); // Initial check for completed tasks
    initTiltEffect();
    addMouseInteractionEffects();
    
    // Add event listeners
    form.addEventListener('submit', addTodo);
    
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
        // Button hover effects
        document.addEventListener('mouseover', (e) => {
            if (e.target.tagName === 'BUTTON') {
                createRippleEffect(e);
            }
        });
        
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
            !button.classList.contains('clear-button')) {
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
    
    // Add a new todo
    function addTodo(e) {
        e.preventDefault();
        
        const task = input.value.trim();
        if (!task) return;
        
        // Create new todo
        const newTodo = {
            id: Date.now().toString(),
            task: task,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        // Add to array and save
        todos.unshift(newTodo); // Add to beginning instead of end
        saveTodos();
        
        // Clear input and render
        input.value = '';
        input.focus();
        renderTodos();
        updateTaskSummary();
        checkCompletedTasks(); // Check for completed tasks
        
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
    
    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
    // Update task summary and progress bar
    function updateTaskSummary() {
        if (todos.length === 0) {
            taskSummary.style.display = 'none';
            return;
        }
        
        taskSummary.style.display = 'block';
        const completed = todos.filter(todo => todo.completed).length;
        const total = todos.length;
        
        // Using anime.js-like counter animation
        animateCounter(completedCount, completed);
        animateCounter(totalCount, total);
        
        // Update progress bar
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
        animateProgressBar(percentage);
        
        // Add color classes based on percentage
        updateProgressColor(percentage);
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
    
    // Set progress bar color based on completion percentage
    function updateProgressColor(percentage) {
        let color;
        
        if (percentage === 100) {
            color = '#27ae60'; // Success green
            if (todos.length > 0) {
                playSound('complete'); // Play completion sound
                showCelebration(); // Show celebration animation
            }
        } else if (percentage > 50) {
            color = '#2ecc71'; // Light green
        } else if (percentage > 20) {
            color = '#3498db'; // Blue
        } else {
            color = '#f39c12'; // Orange
        }
        
        progress.style.backgroundColor = color;
    }
    
    // Show celebration animation when all todos are completed
    function showCelebration() {
        // Only show if we haven't recently shown it
        if (localStorage.getItem('lastCelebration')) {
            const lastTime = parseInt(localStorage.getItem('lastCelebration'));
            if (Date.now() - lastTime < 60000) { // Don't show more than once per minute
                return;
            }
        }
        
        // Create multiple confetti bursts
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight / 2;
                showConfetti(x, y, 50); // More particles for celebration
            }, i * 300);
        }
        
        // Save the time we showed the celebration
        localStorage.setItem('lastCelebration', Date.now().toString());
    }
    
    // Play sound effects
    function playSound(type) {
        // Don't play sounds if user has disabled them
        if (localStorage.getItem('soundsDisabled') === 'true') return;
        
        // Create audio context on first use
        if (!window.AudioContext && !window.webkitAudioContext) return;
        
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        
        let oscillator = audioCtx.createOscillator();
        let gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        switch(type) {
            case 'add':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
                oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // A5
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.2);
                break;
                
            case 'delete':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
                oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1); // A4
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.2);
                break;
                
            case 'toggle':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.1);
                break;
                
            case 'complete':
                // Play a happy chord
                playChord(audioCtx, [523.25, 659.25, 783.99]); // C5, E5, G5
                break;
        }
    }
    
    // Play a chord with multiple oscillators
    function playChord(audioCtx, frequencies) {
        frequencies.forEach((freq, index) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
        });
    }
    
    // Render todos to the UI
    function renderTodos() {
        if (todos.length === 0) {
            emptyMessage.style.display = 'block';
            todoList.innerHTML = '';
            return;
        }
        
        emptyMessage.style.display = 'none';
        
        // Create the list
        let html = '<ul>';
        
        // Add each todo
        todos.forEach(todo => {
            // Add relative time (today, yesterday, etc)
            const createdDate = new Date(todo.createdAt);
            const now = new Date();
            const relativeTime = getRelativeTime(createdDate, now);
            
            html += `
                <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                    <div style="flex: 1;">
                        <span class="todo-text">${todo.task}</span>
                        <small class="todo-date">${relativeTime}</small>
                    </div>
                    <div class="todo-actions">
                        <button class="toggle-btn" data-action="toggle">${todo.completed ? '✓' : '○'}</button>
                        <button class="delete-btn" data-action="delete">×</button>
                    </div>
                </li>
            `;
        });
        
        html += '</ul>';
        todoList.innerHTML = html;
        
        // Animate in
        animateItems();
    }
    
    // Get relative time string (Today, Yesterday, etc)
    function getRelativeTime(date, now) {
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Added today';
        } else if (diffDays === 1) {
            return 'Added yesterday';
        } else if (diffDays < 7) {
            return `Added ${diffDays} days ago`;
        } else {
            return `Added on ${date.toLocaleDateString()}`;
        }
    }
    
    // Animate todo items
    function animateItems() {
        const items = document.querySelectorAll('.todo-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 70 * index); // Slightly longer delay between items
        });
    }
    
    // Event delegation for todo actions
    todoList.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        
        const action = button.dataset.action;
        const todoItem = button.closest('.todo-item');
        if (!todoItem) return;
        
        const id = todoItem.dataset.id;
        
        if (action === 'toggle') {
            toggleTodo(id);
        } else if (action === 'delete') {
            deleteTodo(id);
        }
    });
    
    // Toggle a todo's completion status
    function toggleTodo(id) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                const updatedTodo = { ...todo, completed: !todo.completed };
                
                // Show confetti if completing
                if (updatedTodo.completed) {
                    const el = document.querySelector(`[data-id="${id}"] .toggle-btn`);
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        showConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
                        playSound('toggle');
                    }
                } else {
                    playSound('toggle');
                }
                
                return updatedTodo;
            }
            return todo;
        });
        
        saveTodos();
        renderTodos();
        updateTaskSummary();
        checkCompletedTasks(); // Check for completed tasks after toggling
    }
    
    // Delete a todo
    function deleteTodo(id) {
        const el = document.querySelector(`[data-id="${id}"]`);
        if (el) {
            el.classList.add('shake');
            playSound('delete');
            
            setTimeout(() => {
                el.style.transform = 'translateX(100px) rotate(5deg)';
                el.style.opacity = '0';
                
                setTimeout(() => {
                    todos = todos.filter(todo => todo.id !== id);
                    saveTodos();
                    renderTodos();
                    updateTaskSummary();
                    checkCompletedTasks(); // Check for completed tasks after deletion
                }, 300);
            }, 300);
        }
    }
    
    // Add bulk actions
    function clearCompleted() {
        const hasCompleted = todos.some(todo => todo.completed);
        if (!hasCompleted) return;
        
        const completedItems = document.querySelectorAll('.todo-item.completed');
        
        // Animate out completed items
        completedItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateX(100px) rotate(5deg)';
                item.style.opacity = '0';
            }, 100 * index);
        });
        
        // Wait for animations to finish
        setTimeout(() => {
            todos = todos.filter(todo => !todo.completed);
            saveTodos();
            renderTodos();
            updateTaskSummary();
            checkCompletedTasks(); // Check for completed tasks after clearing
        }, 100 * completedItems.length + 300);
        
        playSound('delete');
    }
    
    // Double click to edit functionality
    todoList.addEventListener('dblclick', (e) => {
        const todoText = e.target.closest('.todo-text');
        if (!todoText) return;
        
        const todoItem = todoText.closest('.todo-item');
        if (!todoItem) return;
        
        const todoId = todoItem.dataset.id;
        const currentText = todoText.textContent;
        
        // Create edit input
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = currentText;
        editInput.className = 'edit-input';
        
        // Replace text with input
        todoText.replaceWith(editInput);
        editInput.focus();
        
        // Handle blur and keyboard events
        editInput.addEventListener('blur', saveEdit);
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            } else if (e.key === 'Escape') {
                editInput.value = currentText;
                saveEdit();
            }
        });
        
        function saveEdit() {
            const newText = editInput.value.trim();
            if (newText && newText !== currentText) {
                todos = todos.map(todo => {
                    if (todo.id === todoId) {
                        return { ...todo, task: newText };
                    }
                    return todo;
                });
                saveTodos();
                playSound('add');
            }
            renderTodos();
        }
    });
    
    // Create a "Clear Completed" button function
    function createClearButton() {
        // Check if button already exists
        let clearButton = document.getElementById('clear-completed');
        if (clearButton) return; // Don't create if it already exists
        
        clearButton = document.createElement('button');
        clearButton.id = 'clear-completed';
        clearButton.textContent = 'Clear Completed';
        clearButton.className = 'clear-button';
        
        clearButton.addEventListener('click', clearCompleted);
        taskSummary.appendChild(clearButton);
        
        // Animate button in
        clearButton.style.opacity = '0';
        clearButton.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            clearButton.style.transition = 'all 0.3s ease';
            clearButton.style.opacity = '1';
            clearButton.style.transform = 'translateY(0)';
        }, 10);
    }
    
    // Remove the "Clear Completed" button function
    function removeClearButton() {
        const clearButton = document.getElementById('clear-completed');
        if (clearButton) {
            clearButton.style.opacity = '0';
            clearButton.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                clearButton.remove();
            }, 300);
        }
    }
    
    // Check if there are completed tasks and manage clear button accordingly
    function checkCompletedTasks() {
        const hasCompleted = todos.some(todo => todo.completed);
        
        if (hasCompleted) {
            createClearButton();
        } else {
            removeClearButton();
        }
    }
    
    // Show confetti effect
    function showConfetti(x, y, amount = 30) {
        const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6'];
        const confettiCount = amount;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Set dimensions
            const size = 5 + Math.random() * 5;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            
            // Set position
            confetti.style.left = `${x}px`;
            confetti.style.top = `${y}px`;
            
            // Set color
            const colorIndex = Math.floor(Math.random() * colors.length);
            confetti.style.backgroundColor = colors[colorIndex];
            
            document.body.appendChild(confetti);
            
            // Calculate destination for animation
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 60;
            const destX = distance * Math.cos(angle);
            const destY = distance * Math.sin(angle);
            const rotation = Math.random() * 360;
            
            setTimeout(() => {
                confetti.style.opacity = '0';
                confetti.style.transform = `translate(${destX}px, ${destY}px) rotate(${rotation}deg)`;
            }, 10);
            
            setTimeout(() => {
                document.body.removeChild(confetti);
            }, 600);
        }
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // If focus is in input, don't trigger shortcuts
        if (document.activeElement === input) return;
        
        // Press 'N' to focus the new task input
        if (e.key.toLowerCase() === 'n') {
            e.preventDefault();
            input.focus();
        }
        
        // Press 'C' to clear all completed tasks
        if (e.key.toLowerCase() === 'c' && e.ctrlKey) {
            e.preventDefault();
            clearCompleted();
        }

        // Press 'M' to toggle sound effects
        if (e.key.toLowerCase() === 'm') {
            e.preventDefault();
            const soundsDisabled = localStorage.getItem('soundsDisabled') === 'true';
            localStorage.setItem('soundsDisabled', (!soundsDisabled).toString());
            
            // Show feedback
            const message = document.createElement('div');
            message.textContent = soundsDisabled ? 'Sound effects enabled' : 'Sound effects disabled';
            message.style.position = 'fixed';
            message.style.bottom = '20px';
            message.style.left = '50%';
            message.style.transform = 'translateX(-50%)';
            message.style.padding = '10px 15px';
            message.style.backgroundColor = 'rgba(52, 152, 219, 0.9)';
            message.style.color = '#fff';
            message.style.borderRadius = '5px';
            message.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            message.style.zIndex = '9999';
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.3s ease';
            
            document.body.appendChild(message);
            
            // Fade in
            setTimeout(() => {
                message.style.opacity = '1';
            }, 10);
            
            // Remove after delay
            setTimeout(() => {
                message.style.opacity = '0';
                setTimeout(() => message.remove(), 300);
            }, 2000);
        }
    });
}); 