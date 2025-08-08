import React, { useState, useCallback } from "react";
import { Brain, CheckSquare, Timer } from "lucide-react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { QuoteGenerator } from "./components/QuoteGenerator";
import { AIAssistant } from "./components/AIAssistant";
import { TodoList } from "./components/TodoList";
import { PomodoroTimer } from "./components/PomodoroTimer";
import { PomodoroProvider } from "./contexts/PomodoroContext"; // ✅ NEW CONTEXT

function App() {
  const [todos, setTodos] = useLocalStorage("ai-todo-app-todos", []);
  const [currentTaskId, setCurrentTaskId] = useState();

  const addTodo = useCallback(
    (todoData) => {
      const newTodo = {
        ...todoData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      setTodos((prev) => [...prev, newTodo]);
    },
    [setTodos]
  );

  const toggleTodo = useCallback(
    (id) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                completed: !todo.completed,
                completedAt: !todo.completed ? new Date() : undefined,
              }
            : todo
        )
      );
    },
    [setTodos]
  );

  const deleteTodo = useCallback(
    (id) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      if (currentTaskId === id) {
        setCurrentTaskId(undefined);
      }
    },
    [setTodos, currentTaskId]
  );

  const editTodo = useCallback(
    (id, newText) => {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
      );
    },
    [setTodos]
  );

  const startPomodoroWithTask = useCallback((taskId) => {
    setCurrentTaskId(taskId);
  }, []);

  const [showCalendar, setShowCalendar] = useState(false);

  const currentTask = currentTaskId
    ? todos.find((todo) => todo.id === currentTaskId)
    : undefined;

  return (
    <PomodoroProvider
      settings={{
        workDuration: 25, // in minutes
        shortBreakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4, // every 4 sessions, take long break
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    AI Productivity Suite
                  </h1>
                  <p className="text-sm text-gray-600">
                    Smart planning • Focused work • Better results
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <CheckSquare className="w-4 h-4" />
                  <span>{todos.filter((t) => !t.completed).length} active</span>
                </div>
                <div className="flex items-center gap-1">
                  <Timer className="w-4 h-4" />
                  <span>
                    {currentTask
                      ? `Working on: ${currentTask.text.substring(0, 20)}...`
                      : "Ready to focus"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Quote & AI Assistant */}
            <div className="space-y-6">
              <QuoteGenerator />
              <AIAssistant todos={todos} />
            </div>

            {/* Middle Column - Todo List */}
            <div className="lg:col-span-1">
              <TodoList
                todos={todos}
                onAddTodo={addTodo}
                onToggleTodo={toggleTodo}
                onDeleteTodo={deleteTodo}
                onEditTodo={editTodo}
                onStartPomodoro={startPomodoroWithTask}
              />
            </div>

            {/* Right Column - Pomodoro Timer */}
            <div>
              <PomodoroTimer
                currentTaskId={currentTaskId}
                onStartWithTask={startPomodoroWithTask}
              />

              {/* Task Analytics */}
              <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 shadow-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Today's Progress
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {todos.filter((t) => t.completed).length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {
                        todos.filter(
                          (t) => !t.completed && t.priority === "high"
                        ).length
                      }
                    </div>
                    <div className="text-sm text-gray-600">High Priority</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="text-sm text-gray-600 mb-1">
                    Completion Rate
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-green-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            todos.length > 0
                              ? (todos.filter((t) => t.completed).length /
                                  todos.length) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      {todos.length > 0
                        ? Math.round(
                            (todos.filter((t) => t.completed).length /
                              todos.length) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PomodoroProvider>
  );
}

export default App;
