import React, { useState } from 'react';
import { Check, Clock, Flag, Edit3, Trash2 } from 'lucide-react';

const priorityColors = {
  low: 'text-green-600 bg-green-50',
  medium: 'text-yellow-600 bg-yellow-50',
  high: 'text-red-600 bg-red-50'
};

const priorityBorders = {
  low: 'border-green-200',
  medium: 'border-yellow-200',
  high: 'border-red-200'
};

export const TaskItem = ({ 
  todo, 
  onToggle, 
  onDelete, 
  onEdit, 
  onStartPomodoro 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
      todo.completed ? 'opacity-60 border-gray-200' : priorityBorders[todo.priority]
    }`}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(todo.id)}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
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
              <span className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
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
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${priorityColors[todo.priority]}`}>
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
    </div>
  );
};