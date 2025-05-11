# TODO List Application

A beautifully designed and feature-rich TODO list application with a responsive UI, data persistence, and animated backgrounds.

## Features

- **Modern Design**: Clean, responsive interface with smooth animations
- **Data Persistence**: Tasks remain saved even after closing the application
- **Real-time Interactions**: Add, complete, and delete tasks without page reloads
- **Animated Background**: Beautiful gradients, floating bubbles, and animated shapes
- **Dark Mode Support**: Automatically adapts to your system's dark mode preference
- **Mobile Responsive**: Works flawlessly on all devices

## Technology Stack

- **Frontend**: HTML5, CSS3 (with animations), JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Templating**: EJS
- **Data Storage**: JSON-based file system for persistence

## Live Demo

Visit the live application at: [https://yourusername.github.io/your-repo-name/](https://yourusername.github.io/your-repo-name/)

## Installation and Running

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the application:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages:

1. The deployment uses GitHub Actions (see `.github/workflows/deploy.yml`)
2. Each push to the main/master branch triggers a new deployment
3. The static version is hosted on GitHub Pages
4. You can manually trigger a deployment from the Actions tab in your repository

## Project Structure

```
TodoList/
├── app.js              # Main application entry point
├── data/
│   └── todos.json      # JSON file for data persistence
├── public/
│   ├── css/
│   │   └── styles.css  # CSS styling
│   └── js/
│       └── main.js     # Client-side JavaScript
├── routes/
│   └── todoRoutes.js   # Express routes for todo operations
└── views/
    └── index.ejs       # Main EJS template
```

## Implementation Details

- **Non-reloading UI**: Used AJAX for seamless task management
- **Optimized Animations**: Carefully crafted CSS and JavaScript animations for performance
- **Responsive Layout**: Flexbox and media queries for all device sizes
- **Error Handling**: Robust error handling for data operations

## Future Enhancements

- User authentication
- Categories and tags for tasks
- Due dates and reminders
- Drag and drop reordering

## About the Author

Developed by [Aditya Singh](https://adityasiig.github.io/Portfolio/) as a demonstration of modern web development techniques.

## License

This project is open-source and available under the MIT License. 