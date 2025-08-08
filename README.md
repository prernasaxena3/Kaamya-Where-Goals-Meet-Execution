# Kaamya – Where Goals Meet Execution 🧠

A modern, AI-powered productivity and focus platform that helps users manage tasks, stay motivated, and execute goals with clarity. Built using **React**, **Vite**, and **TailwindCSS**, Kaamya integrates Gemini AI for personalized productivity suggestions and includes a Pomodoro timer, smart Todo system, and calendar scheduling.

## 🔗 Live Demo

👉 [Visit Kaamya](https://kaamya-where-goals-meet-execution.vercel.app/)

## 📂 Project Structure

```
├── public/
│   └── brain.svg                # Favicon icon
├── src/
│   ├── components/              # UI Components: TodoList, QuoteGenerator, etc.
│   ├── contexts/                # Pomodoro context provider
│   ├── hooks/                   # Custom hooks (e.g., useLocalStorage)
│   ├── pages/                   # Calendar page
│   ├── utils/                   # Utility functions
│   ├── App.jsx                  # Main app layout
│   ├── main.jsx                 # Entry point
│   └── geminiClient.js          # API client to call Gemini backend
├── index.html
├── vite.config.js
└── tailwind.config.js
```

## ⚙️ Features

- ✅ **AI Assistant** powered by Gemini API for task suggestions
- ✅ **Smart Todo List** with edit, delete, toggle complete
- ✅ **Pomodoro Timer** (Work/Short/Long Break cycles)
- ✅ **Quote Generator** for daily motivation
- ✅ **Calendar Integration** (Schedule-X)
- ✅ **Progress Analytics** (Daily completed/high-priority task stats)
- ✅ **Fully Responsive UI** with TailwindCSS and Lucide Icons

## 🔐 API Security

- Frontend securely connects to a [Vercel-hosted backend](https://kaamya-backend.vercel.app/api/gemini) which proxies Gemini requests.
- The actual Gemini API key is stored in the backend `.env` file and never exposed on the frontend.

## 🛠 Tech Stack

- **Frontend:** React + Vite + TailwindCSS
- **Icons:** Lucide React
- **AI Integration:** Gemini 2.5 Flash via secure Vercel backend
- **Calendar:** Schedule-X
- **State Management:** React Context + Hooks

## 🚀 Setup & Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/Kaamya-Where-Goals-Meet-Execution.git
cd Kaamya-Where-Goals-Meet-Execution
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

Ensure your backend (Gemini API proxy) is deployed and reachable.

## 🧠 Backend Integration

Kaamya frontend communicates with the backend hosted at:

```
https://kaamya-backend.vercel.app/api/gemini
```

The backend handles Gemini API calls securely and returns structured responses for the assistant.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
