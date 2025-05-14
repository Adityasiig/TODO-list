# TODO List Application

A beautifully designed and feature-rich TODO list application with a responsive UI, data persistence, animations, and interactive features.

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
├── css/                # CSS styling for the app
│   └── styles.css      # Main stylesheet
├── data/
│   └── todos.json      # JSON file for data persistence
├── images/             # Image assets
│   ├── favicon.svg     # Vector favicon
│   ├── favicon-512.png # Favicon for social sharing
│   └── favicon-*.png   # Various sizes for different devices
├── js/
│   └── app.js          # Client-side JavaScript
├── manifest.json       # Web app manifest for mobile
├── public/             # Static assets
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
- **Content Security Policy**: Fully compatible with strict CSP rules
- **SEO & Social Sharing**: Open Graph and Twitter Card meta tags for rich previews

## Technical Highlights

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