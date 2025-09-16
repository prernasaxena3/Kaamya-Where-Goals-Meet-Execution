import React, { useState } from "react";
import {
  Check,
  Clock,
  Flag,
  Edit3,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const priorityColors = {
  low: "text-green-600 bg-green-50",
  medium: "text-yellow-600 bg-yellow-50",
  high: "text-red-600 bg-red-50",
};

const priorityBorders = {
  low: "border-green-200",
  medium: "border-yellow-200",
  high: "border-red-200",
};

export const TaskItem = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onStartPomodoro,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(null);

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const handleScheduleSave = () => {
    if (!scheduledDate) return;

    const newEvent = {
      id: `${todo.id}-${Date.now()}`,
      title: todo.text,
      start: scheduledDate.toISOString(),
      end: new Date(
        scheduledDate.getTime() + (todo.estimatedTime || 30) * 60000
      ).toISOString(), // default 30 mins
      category: todo.category || "General",
      priority: todo.priority || "medium",
    };

    // Save to localStorage calendarEvents
    const existing = JSON.parse(localStorage.getItem("calendarEvents") || "[]");
    localStorage.setItem(
      "calendarEvents",
      JSON.stringify([...existing, newEvent])
    );

    setShowScheduler(false);
  };

  return (
    <div
      className={`bg-white rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
        todo.completed
          ? "opacity-60 border-gray-200"
          : priorityBorders[todo.priority]
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(todo.id)}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            todo.completed
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-green-400 hover:bg-green-50"
          }`}
        >
          {todo.completed && <Check className="w-3 h-3" />}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={handleKeyPress}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${
                  todo.completed
                    ? "line-through text-gray-500"
                    : "text-gray-800"
                }`}
              >
                {todo.text}
              </span>
              {todo.category && (
                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {todo.category}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 mt-1">
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                priorityColors[todo.priority]
              }`}
            >
              <Flag className="w-3 h-3" />
              <span className="capitalize">{todo.priority}</span>
            </div>

            {todo.estimatedTime && (
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Clock className="w-3 h-3" />
                <span>{todo.estimatedTime}min</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Calendar scheduling button */}
          <button
            onClick={() => setShowScheduler(true)}
            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
            title="Schedule task"
          >
            <CalendarIcon className="w-4 h-4" />
          </button>

          {!todo.completed && onStartPomodoro && (
            <button
              onClick={() => onStartPomodoro(todo.id)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Start Pomodoro"
            >
              <Clock className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
            title="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scheduler Modal */}
      {showScheduler && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-3">Schedule Task</h3>
            <DatePicker
              selected={scheduledDate}
              onChange={(date) => setScheduledDate(date)}
              showTimeSelect
              dateFormat="Pp"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholderText="Select date and time"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowScheduler(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSave}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
