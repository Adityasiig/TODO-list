/* ============================================
   TASKFLOW — Smart TODO App
   Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === Elements ===
    const form = document.getElementById('add-task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const noResults = document.getElementById('no-results');
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    const filterTabs = document.getElementById('filter-tabs');
    const sortBtn = document.getElementById('sort-btn');
    const sortMenu = document.getElementById('sort-menu');
    const priorityPills = document.getElementById('priority-pills');
    const dueDateInput = document.getElementById('due-date');
    const categorySelect = document.getElementById('category-select');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const shortcutsBtn = document.getElementById('shortcuts-btn');
    const shortcutsModal = document.getElementById('shortcuts-modal');
    const modalClose = document.getElementById('modal-close');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const clearAllBtn = document.getElementById('clear-all');
    const bulkActions = document.getElementById('bulk-actions');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const progressFraction = document.getElementById('progress-fraction');
    const toastContainer = document.getElementById('toast-container');

    // === State ===
    let todos = JSON.parse(localStorage.getItem('taskflow-todos') || '[]');
    let currentFilter = 'all';
    let currentSort = 'newest';
    let searchQuery = '';
    let selectedPriority = 'medium';

    // === Init ===
    loadTheme();
    render();

    // === Theme ===
    function loadTheme() {
        const saved = localStorage.getItem('taskflow-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', saved);
        themeIcon.className = saved === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('taskflow-theme', next);
        themeIcon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    });

    // === Priority Pills ===
    priorityPills.addEventListener('click', (e) => {
        const pill = e.target.closest('.priority-pill');
        if (!pill) return;
        priorityPills.querySelectorAll('.priority-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedPriority = pill.dataset.priority;
    });

    // === Add Task ===
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (!text) return;

        const newTodo = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            priority: selectedPriority,
            category: categorySelect.value,
            dueDate: dueDateInput.value || null,
            createdAt: new Date().toISOString()
        };

        todos.unshift(newTodo);
        save();
        render();

        taskInput.value = '';
        dueDateInput.value = '';
        taskInput.focus();

        showToast('Task added');
        playSound('add');
    });

    // === Save ===
    function save() {
        localStorage.setItem('taskflow-todos', JSON.stringify(todos));
    }

    // === Render ===
    function render() {
        const filtered = getFilteredTodos();
        const sorted = getSortedTodos(filtered);

        updateStats();
        updateProgress();
        updateBulkActions();

        if (todos.length === 0) {
            taskList.innerHTML = '';
            emptyState.style.display = 'block';
            noResults.style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';

        if (sorted.length === 0) {
            taskList.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';

        taskList.innerHTML = sorted.map(todo => createTaskHTML(todo)).join('');

        // Add drag listeners
        taskList.querySelectorAll('.task-item').forEach(item => {
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('dragleave', handleDragLeave);
            item.addEventListener('drop', handleDrop);
            item.addEventListener('dragend', handleDragEnd);
        });
    }

    function createTaskHTML(todo) {
        const dueDateHTML = todo.dueDate ? getDueDateHTML(todo.dueDate, todo.completed) : '';
        const relativeTime = getRelativeTime(new Date(todo.createdAt));

        return `
            <li class="task-item ${todo.completed ? 'completed' : ''}"
                data-id="${escapeAttr(todo.id)}"
                data-priority="${escapeAttr(todo.priority)}"
                draggable="true">
                <div class="task-checkbox" data-action="toggle">
                    ${todo.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <div class="task-content">
                    <div class="task-text">${escapeHTML(todo.text)}</div>
                    <div class="task-meta">
                        <span class="task-badge badge-priority" data-priority="${escapeAttr(todo.priority)}">
                            <i class="fas fa-flag"></i> ${escapeHTML(todo.priority)}
                        </span>
                        <span class="task-badge badge-category" data-category="${escapeAttr(todo.category)}">
                            <i class="fas fa-tag"></i> ${escapeHTML(todo.category)}
                        </span>
                        ${dueDateHTML}
                        <span class="task-date">${escapeHTML(relativeTime)}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn" data-action="edit" aria-label="Edit task">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="task-action-btn delete-btn" data-action="delete" aria-label="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `;
    }

    // === XSS Protection ===
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function escapeAttr(str) {
        return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // === Due Date Rendering ===
    function getDueDateHTML(dateStr, isCompleted) {
        const due = new Date(dateStr + 'T23:59:59');
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
        const diffDays = Math.round((dueDay - today) / (1000 * 60 * 60 * 24));

        let label, className = '';

        if (diffDays < 0 && !isCompleted) {
            label = `${Math.abs(diffDays)}d overdue`;
            className = 'overdue';
        } else if (diffDays === 0) {
            label = 'Due today';
            className = 'due-today';
        } else if (diffDays === 1) {
            label = 'Due tomorrow';
        } else if (diffDays > 1 && diffDays <= 7) {
            label = `Due in ${diffDays}d`;
        } else {
            label = `Due ${dueDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        }

        return `<span class="task-due ${className}"><i class="fas fa-clock"></i> ${escapeHTML(label)}</span>`;
    }

    // === Relative Time ===
    function getRelativeTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // === Filters ===
    function getFilteredTodos() {
        let result = [...todos];

        // Filter by tab
        if (currentFilter === 'active') {
            result = result.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            result = result.filter(t => t.completed);
        } else if (currentFilter === 'overdue') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            result = result.filter(t => {
                if (!t.dueDate || t.completed) return false;
                return new Date(t.dueDate + 'T23:59:59') < today;
            });
        }

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(t =>
                t.text.toLowerCase().includes(q) ||
                t.category.toLowerCase().includes(q) ||
                t.priority.toLowerCase().includes(q)
            );
        }

        return result;
    }

    // === Sorting ===
    function getSortedTodos(list) {
        const sorted = [...list];

        switch (currentSort) {
            case 'newest':
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'priority': {
                const order = { high: 0, medium: 1, low: 2 };
                sorted.sort((a, b) => order[a.priority] - order[b.priority]);
                break;
            }
            case 'due-date':
                sorted.sort((a, b) => {
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                });
                break;
            case 'alphabetical':
                sorted.sort((a, b) => a.text.localeCompare(b.text));
                break;
        }

        return sorted;
    }

    // === Filter Tabs ===
    filterTabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.filter-tab');
        if (!tab) return;
        filterTabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        render();
    });

    // === Sort ===
    sortBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sortMenu.classList.toggle('show');
    });

    sortMenu.addEventListener('click', (e) => {
        const option = e.target.closest('.sort-option');
        if (!option) return;
        sortMenu.querySelectorAll('.sort-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        currentSort = option.dataset.sort;
        sortMenu.classList.remove('show');
        render();
    });

    document.addEventListener('click', () => {
        sortMenu.classList.remove('show');
    });

    // === Search ===
    searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value.trim();
        searchClear.style.display = searchQuery ? 'flex' : 'none';
        render();
    });

    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchClear.style.display = 'none';
        render();
    });

    // === Task Actions (Event Delegation) ===
    taskList.addEventListener('click', (e) => {
        const item = e.target.closest('.task-item');
        if (!item) return;
        const id = item.dataset.id;
        const action = e.target.closest('[data-action]');
        if (!action) return;

        switch (action.dataset.action) {
            case 'toggle':
                toggleTodo(id, item);
                break;
            case 'delete':
                deleteTodo(id, item);
                break;
            case 'edit':
                editTodo(id, item);
                break;
        }
    });

    // Double-click to edit
    taskList.addEventListener('dblclick', (e) => {
        const textEl = e.target.closest('.task-text');
        if (!textEl) return;
        const item = textEl.closest('.task-item');
        if (item) editTodo(item.dataset.id, item);
    });

    // === Toggle ===
    function toggleTodo(id, el) {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        todo.completed = !todo.completed;
        save();
        render();

        if (todo.completed) {
            showConfetti(el);
            playSound('complete');
            showToast('Task completed!');
        } else {
            playSound('toggle');
        }
    }

    // === Delete ===
    function deleteTodo(id, el) {
        el.style.transform = 'translateX(80px)';
        el.style.opacity = '0';

        setTimeout(() => {
            todos = todos.filter(t => t.id !== id);
            save();
            render();
            showToast('Task deleted');
            playSound('delete');
        }, 250);
    }

    // === Edit ===
    function editTodo(id, el) {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        const textEl = el.querySelector('.task-text');
        const currentText = todo.text;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'task-edit-input';
        input.value = currentText;

        textEl.replaceWith(input);
        input.focus();
        input.select();

        function saveEdit() {
            const newText = input.value.trim();
            if (newText && newText !== currentText) {
                todo.text = newText;
                save();
                showToast('Task updated');
            }
            render();
        }

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); saveEdit(); }
            if (e.key === 'Escape') { input.value = currentText; saveEdit(); }
        });
    }

    // === Bulk Actions ===
    clearCompletedBtn.addEventListener('click', () => {
        const count = todos.filter(t => t.completed).length;
        if (count === 0) return;
        todos = todos.filter(t => !t.completed);
        save();
        render();
        showToast(`Cleared ${count} completed task${count > 1 ? 's' : ''}`);
        playSound('delete');
    });

    clearAllBtn.addEventListener('click', () => {
        if (todos.length === 0) return;
        if (!confirm('Delete all tasks? This cannot be undone.')) return;
        todos = [];
        save();
        render();
        showToast('All tasks cleared');
        playSound('delete');
    });

    function updateBulkActions() {
        bulkActions.style.display = todos.length > 0 ? 'flex' : 'none';
    }

    // === Stats ===
    function updateStats() {
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        const active = total - completed;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const overdue = todos.filter(t => {
            if (!t.dueDate || t.completed) return false;
            return new Date(t.dueDate + 'T23:59:59') < today;
        }).length;

        document.getElementById('stat-total').textContent = total;
        document.getElementById('stat-completed').textContent = completed;
        document.getElementById('stat-active').textContent = active;
        document.getElementById('stat-overdue').textContent = overdue;
    }

    // === Progress ===
    function updateProgress() {
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

        progressFill.style.width = percent + '%';
        progressText.textContent = percent + '% complete';
        progressFraction.textContent = `${completed}/${total}`;

        // Change color based on progress
        if (percent === 100 && total > 0) {
            progressFill.style.background = 'linear-gradient(90deg, var(--success), var(--success-light))';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, var(--accent), var(--accent-light))';
        }
    }

    // === Drag & Drop ===
    let draggedItem = null;

    function handleDragStart(e) {
        draggedItem = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.dataset.id);
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('drag-over');
    }

    function handleDragLeave() {
        this.classList.remove('drag-over');
    }

    function handleDrop(e) {
        e.preventDefault();
        this.classList.remove('drag-over');

        if (draggedItem === this) return;

        const fromId = draggedItem.dataset.id;
        const toId = this.dataset.id;

        const fromIndex = todos.findIndex(t => t.id === fromId);
        const toIndex = todos.findIndex(t => t.id === toId);

        if (fromIndex === -1 || toIndex === -1) return;

        const [moved] = todos.splice(fromIndex, 1);
        todos.splice(toIndex, 0, moved);

        save();
        render();
    }

    function handleDragEnd() {
        this.classList.remove('dragging');
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        draggedItem = null;
    }

    // === Keyboard Shortcuts ===
    document.addEventListener('keydown', (e) => {
        // Don't trigger when typing in inputs
        const tag = document.activeElement.tagName.toLowerCase();
        const isInput = tag === 'input' || tag === 'textarea' || tag === 'select';

        if (e.key === 'Escape') {
            if (shortcutsModal.classList.contains('show')) {
                shortcutsModal.classList.remove('show');
                return;
            }
            if (isInput) {
                document.activeElement.blur();
                if (searchInput.value) {
                    searchInput.value = '';
                    searchQuery = '';
                    searchClear.style.display = 'none';
                    render();
                }
                return;
            }
        }

        if (isInput) return;

        if (e.key === 'n' || e.key === 'N') {
            e.preventDefault();
            taskInput.focus();
        }

        if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
            e.preventDefault();
            shortcutsModal.classList.add('show');
        }

        if (e.key === '/') {
            e.preventDefault();
            searchInput.focus();
        }

        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            themeToggle.click();
        }

        if (e.ctrlKey && e.shiftKey && e.key === 'X') {
            e.preventDefault();
            clearCompletedBtn.click();
        }
    });

    // === Shortcuts Modal ===
    shortcutsBtn.addEventListener('click', () => {
        shortcutsModal.classList.add('show');
    });

    modalClose.addEventListener('click', () => {
        shortcutsModal.classList.remove('show');
    });

    shortcutsModal.addEventListener('click', (e) => {
        if (e.target === shortcutsModal) {
            shortcutsModal.classList.remove('show');
        }
    });

    // === Toast ===
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-out');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // === Sound Effects ===
    function playSound(type) {
        if (localStorage.getItem('taskflow-mute') === 'true') return;

        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            switch (type) {
                case 'add':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(523, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(784, ctx.currentTime + 0.1);
                    gain.gain.setValueAtTime(0.08, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.15);
                    break;
                case 'complete':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(659, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(988, ctx.currentTime + 0.15);
                    gain.gain.setValueAtTime(0.08, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.3);
                    break;
                case 'delete':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.12);
                    gain.gain.setValueAtTime(0.06, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.15);
                    break;
                case 'toggle':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(587, ctx.currentTime);
                    gain.gain.setValueAtTime(0.06, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.1);
                    break;
            }
        } catch (err) {
            // Silently ignore audio errors
        }
    }

    // === Confetti ===
    function showConfetti(el) {
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const colors = ['#6c5ce7', '#00b894', '#fdcb6e', '#e17055', '#74b9ff', '#fd79a8'];

        for (let i = 0; i < 20; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';

            const size = 4 + Math.random() * 6;
            piece.style.width = size + 'px';
            piece.style.height = size + 'px';
            piece.style.left = x + 'px';
            piece.style.top = y + 'px';
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

            document.body.appendChild(piece);

            const angle = Math.random() * Math.PI * 2;
            const dist = 30 + Math.random() * 60;
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist;
            const rot = Math.random() * 360;

            requestAnimationFrame(() => {
                piece.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
                piece.style.opacity = '0';
            });

            setTimeout(() => piece.remove(), 700);
        }
    }
});
