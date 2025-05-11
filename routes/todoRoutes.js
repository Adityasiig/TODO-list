const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Ensure absolute path to data file
const dataFilePath = path.resolve(__dirname, '../data/todos.json');

// Ensure data directory exists
const dataDir = path.dirname(dataFilePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure data file exists
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, '[]', 'utf8');
}

// Helper function to read todos from file
const readTodos = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading todos file:', error);
    return [];
  }
};

// Helper function to write todos to file
const writeTodos = (todos) => {
  try {
    // Ensure directory exists again (just to be safe)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2), 'utf8');
    console.log(`Successfully wrote ${todos.length} todos to file`);
  } catch (error) {
    console.error('Error writing todos file:', error);
  }
};

// Home route - display all todos
router.get('/', (req, res) => {
  const todos = readTodos();
  console.log(`Rendering index with ${todos.length} todos`);
  res.render('index', { todos });
});

// Add a new todo
router.post('/add', (req, res) => {
  console.log("Received add request with body:", req.body);
  const { task } = req.body;
  
  if (task && task.trim() !== '') {
    const todos = readTodos();
    
    const newTodo = {
      id: Date.now().toString(),
      task,
      completed: false,
      createdAt: new Date()
    };
    
    todos.push(newTodo);
    writeTodos(todos);
    console.log("Added new todo:", newTodo);
    
    // Return the new todo for AJAX requests
    if (req.xhr || req.headers.accept && req.headers.accept.includes('json')) {
      return res.json({ success: true, todo: newTodo });
    }
  }
  
  // Redirect to homepage for regular form submissions
  res.redirect('/');
});

// Toggle todo completion status
router.post('/toggle/:id', (req, res) => {
  const { id } = req.params;
  let todos = readTodos();
  let updatedTodo = null;
  
  todos = todos.map(todo => {
    if (todo.id === id) {
      updatedTodo = { ...todo, completed: !todo.completed };
      return updatedTodo;
    }
    return todo;
  });
  
  writeTodos(todos);
  console.log(`Toggled todo ${id}`);
  
  // Return the updated todo for AJAX requests
  if (req.xhr || req.headers.accept && req.headers.accept.includes('json')) {
    return res.json({ success: true, todo: updatedTodo });
  }
  
  res.redirect('/');
});

// For backward compatibility
router.get('/toggle/:id', (req, res) => {
  const { id } = req.params;
  let todos = readTodos();
  
  todos = todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  
  writeTodos(todos);
  res.redirect('/');
});

// Delete a todo
router.post('/delete/:id', (req, res) => {
  const { id } = req.params;
  let todos = readTodos();
  
  console.log(`Deleting todo ${id}. Before: ${todos.length} todos`);
  todos = todos.filter(todo => todo.id !== id);
  console.log(`After deletion: ${todos.length} todos`);
  
  writeTodos(todos);
  
  // Return success for AJAX requests
  if (req.xhr || req.headers.accept && req.headers.accept.includes('json')) {
    return res.json({ success: true });
  }
  
  res.redirect('/');
});

// For backward compatibility
router.get('/delete/:id', (req, res) => {
  const { id } = req.params;
  let todos = readTodos();
  
  console.log(`Deleting todo ${id} (GET). Before: ${todos.length} todos`);
  todos = todos.filter(todo => todo.id !== id);
  console.log(`After deletion: ${todos.length} todos`);
  
  writeTodos(todos);
  
  res.redirect('/');
});

module.exports = router; 