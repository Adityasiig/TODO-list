# TODO List Application

A beautifully designed and feature-rich TODO list application with a responsive UI, data persistence, animations, and interactive features. The project is organized into separate frontend and backend components for better maintainability and deployment flexibility.

## Features

- **Modern Design**: Clean, responsive interface with smooth animations
- **Data Persistence**: Tasks remain saved even after closing the application
- **Real-time Interactions**: Add, complete, and delete tasks without page reloads
- **Animated Background**: Beautiful gradients, floating bubbles, and animated shapes
- **Dark Mode Support**: Automatically adapts to your system's dark mode preference
- **Mobile Responsive**: Works flawlessly on all devices
- **3D Effects**: Tilt effects and interactive hover states for buttons and cards
- **Sound Effects**: Subtle audio feedback for task completion and actions
- **Visual Feedback**: Ripple effects, celebrations, and visual cues for user actions
- **Keyboard Shortcuts**: Improved accessibility and productivity
- **Social Sharing**: Optimized link previews when sharing on social platforms
- **Web App Support**: Can be added to home screen on mobile devices

## Technology Stack

- **Frontend**: HTML5, CSS3 (with animations), JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Templating**: EJS
- **Data Storage**: JSON-based file system for persistence
- **Web APIs**: Web Audio, LocalStorage, Touch Events

## Live Demo

Visit the live application at: [https://Adityasiig.github.io/TODO-list/](https://Adityasiig.github.io/TODO-list/)

## Project Structure

The project is organized into two main components:

```
TodoList/
├── live-demo-code/           # Frontend code (for GitHub Pages)
│   ├── index.html           # Main HTML file
│   ├── css/                 # CSS styling
│   │   └── styles.css
│   ├── js/                  # Client-side JavaScript
│   │   └── app.js
│   ├── images/             # Image assets
│   │   ├── favicon.svg
│   │   └── favicon-*.png
│   ├── public/             # Public assets
│   └── manifest.json       # Web app manifest
│
├── server-side/            # Backend code
│   ├── app.js             # Express server entry point
│   ├── routes/            # API routes
│   │   └── todoRoutes.js
│   ├── views/             # EJS templates
│   │   ├── index.ejs
│   │   └── error.ejs
│   └── data/              # Data storage
│       └── todos.json
│
├── package.json           # Project dependencies
└── README.md             # Project documentation
```

## Installation and Setup

### Frontend Only (GitHub Pages Version)
1. The frontend is automatically deployed to GitHub Pages
2. Visit [https://Adityasiig.github.io/TODO-list/](https://Adityasiig.github.io/TODO-list/)
3. This version uses localStorage for data persistence

### Full Stack Version (with Backend)
1. Clone the repository:
   ```bash
   git clone https://github.com/Adityasiig/TODO-list.git
   cd TODO-list
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server-side/app.js
   ```

4. Open your browser and visit `http://localhost:3000`

## Development

- **Frontend Development**: Work in the `live-demo-code/` directory
  - Contains all client-side code
  - Can be served statically
  - Uses localStorage for data persistence

- **Backend Development**: Work in the `server-side/` directory
  - Contains Express.js server code
  - Handles API routes and data storage
  - Uses JSON file for data persistence

## Implementation Details

- **Non-reloading UI**: Used AJAX for seamless task management
- **Optimized Animations**: Carefully crafted CSS and JavaScript animations for performance
- **Responsive Layout**: Flexbox and media queries for all device sizes
- **Error Handling**: Robust error handling for data operations
- **Content Security Policy**: Fully compatible with strict CSP rules
- **SEO & Social Sharing**: Open Graph and Twitter Card meta tags for rich previews

## Technical Highlights

- **Separated Concerns**: Frontend and backend code are cleanly separated
- **Dual Deployment**: Can be deployed as static site or full-stack application
- **Event Delegation**: Efficient event handling without inline JavaScript
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Web App Manifest**: Allows installation on mobile home screens
- **Optimized Assets**: SVG-first approach with PNG fallbacks

## Future Enhancements

- User authentication
- Categories and tags for tasks
- Due dates and reminders
- Drag and drop reordering
- Offline support with Service Workers
- Cloud synchronization

## About the Author

Developed by [Aditya Singh](https://adityasiig.github.io/Portfolio/) as a demonstration of modern web development techniques.

## License

This project is open-source and available under the MIT License. 