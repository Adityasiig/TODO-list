# TODO List Application

A simple and efficient TODO list application with a clean user interface. This project features both a static frontend for GitHub Pages and a Node.js backend for enhanced functionality.

## 🌟 Features

- Create, edit, and delete tasks
- Mark tasks as complete/incomplete
- Clean and responsive user interface
- Data persistence using localStorage
- Real-time updates
- Mobile-friendly design

## 🔗 Live Demo

Visit the live application: [TODO List App](https://adityasiig.github.io/TODO-list/)

## 🛠️ Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Local Storage for data persistence

### Backend
- Node.js
- Express.js
- JSON for data storage

## 📁 Project Structure

```
T```
live-demo-code/
├── css/                            # Contains global styles (can be merged with public/css if needed)
│   └── styles.css
├── images/                         # Shared image assets used across the project
│   ├── favicon-16.png
│   ├── favicon-32.png
│   ├── favicon-192.png
│   ├── favicon-512.png
│   ├── favicon.ico
│   └── favicon.svg
│
├── js/                             # Standalone JavaScript files for general logic or components
│   └── app.js
│
├── public/                         # Static files served directly to the client
│   ├── css/
│   │   └── styles.css              # Public-facing CSS
│   ├── images/                     # Public-facing images like favicons
│   │   ├── favicon-16.png
│   │   ├── favicon-32.png
│   │   ├── favicon-192.png
│   │   ├── favicon-512.png
│   │   ├── favicon.ico
│   │   └── favicon.svg
│   ├── js/
│   │   ├── app.js                  # Public-facing JavaScript
│   │   └── main.js                 # Additional JS logic (e.g., interactivity)
│   ├── app.html                    # Main HTML for PWA (Progressive Web App)
│   └── manifest.json               # Web app manifest for PWA settings and metadata
│
├── server-side/                    # Server-side code (Node.js/Express logic)
│   ├── data/
│   │   └── todos.json              # Example data storage (could simulate a database)
│   ├── routes/
│   │   └── todoRoutes.js           # API route handling for todo-related endpoints
│   └── views/                      # Templating files using EJS for server-rendered views
│       ├── error.ejs
│       └── index.ejs
│
├── app.js                          # Main entry point for the server-side application (Express.js)
├── index.html                      # Primary HTML file for the website (non-PWA entry)
├── package.json                    # Project configuration and dependencies
├── package-lock.json               # Locks dependency versions for reproducibility
└── README.md                       # Project overview, instructions, and documentation
```


## 🚀 Getting Started

### Static Version (Frontend Only)
1. Visit [https://adityasiig.github.io/TODO-list/](https://adityasiig.github.io/TODO-list/)
2. Start managing your tasks immediately
3. Your data will be saved in your browser's localStorage

### Local Development Setup
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
   npm start
   ```

4. Open your browser and visit:
   - Frontend: [http://localhost:3000](http://localhost:3000)

## 👨‍💻 Author

Created by [Aditya Singh](https://adityasiig.github.io/Portfolio/)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
