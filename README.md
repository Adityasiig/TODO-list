<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=header" width="100%" />

# TaskFlow — Smart TODO App

A beautifully designed task manager with priorities, due dates, drag & drop, filters and dark/light themes.

[![Live Demo](https://img.shields.io/badge/Live_Demo-6C5CE7?style=for-the-badge&logo=googlechrome&logoColor=white)](https://adityasiig.github.io/TODO-list/)
[![GitHub](https://img.shields.io/badge/Source_Code-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Adityasiig/TODO-list)

</div>

---

## Features

- **Dark / Light Theme** — Toggle with smooth transitions, saved to localStorage
- **Task Priorities** — Low, Medium, High with color-coded indicators
- **Due Dates** — Smart labels (overdue, due today, due tomorrow)
- **Categories** — Personal, Work, Study, Health
- **Search** — Real-time filtering across task text, category & priority
- **Filter Tabs** — All, Active, Done, Overdue
- **Sort Options** — Newest, Oldest, Priority, Due Date, Alphabetical
- **Drag & Drop** — Reorder tasks by dragging
- **Stats Dashboard** — Total, Done, Active, Overdue at a glance
- **Progress Bar** — Visual completion percentage with shimmer animation
- **Inline Editing** — Double-click any task to edit
- **Sound Effects** — Subtle audio feedback on actions
- **Confetti** — Celebration animation on task completion
- **Keyboard Shortcuts** — `N` add, `/` search, `?` shortcuts, `Ctrl+Shift+D` theme
- **Bulk Actions** — Clear completed or clear all
- **Fully Responsive** — Works on all screen sizes
- **XSS Protected** — All user input is sanitized before rendering

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Markup** | HTML5 |
| **Styling** | CSS3 (Custom Properties, Grid, Flexbox, Animations, Glassmorphism) |
| **Scripts** | Vanilla JavaScript (ES6+) |
| **Fonts** | Inter, JetBrains Mono |
| **Icons** | Font Awesome 6 |
| **Storage** | localStorage |
| **Backend** | Node.js, Express, EJS (server-side version) |

## Project Structure

```
TODO-list/
├── index.html                  # Main entry point (GitHub Pages)
├── live-demo-code/
│   ├── css/
│   │   └── styles.css          # Complete stylesheet with theme system
│   ├── js/
│   │   └── app.js              # All app logic and features
│   ├── images/
│   │   └── [favicons]
│   └── app.html                # Standalone version
├── server-side/
│   ├── app.js                  # Express server
│   ├── routes/
│   │   └── todoRoutes.js       # API routes
│   ├── views/
│   │   └── index.ejs           # Server-rendered template
│   └── data/
│       └── todos.json          # JSON file storage
├── package.json
└── README.md
```

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Adityasiig/TODO-list.git

# Open in browser (no build tools needed)
cd TODO-list
open index.html
```

**Or** run the server-side version:

```bash
npm install
npm start
# Visit http://localhost:3000
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | Focus task input |
| `/` | Focus search |
| `?` | Show all shortcuts |
| `Ctrl+Shift+D` | Toggle dark/light theme |
| `Ctrl+Shift+X` | Clear completed tasks |
| `Esc` | Close modal / clear search |
| `Double-click` | Edit task text |

## Screenshots

| Dark Mode | Light Mode |
|-----------|------------|
| Aurora gradient background, glassmorphism cards | Clean light theme with purple accents |

---

<div align="center">

**Built by [Aditya Singh](https://adityasiig.github.io/Portfolio/)**

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=80&section=footer" width="100%" />

</div>
