const timeBasedGreetings = {
  morning: "Good morning! Let's make today productive.",
  afternoon: "Good afternoon! How can I help optimize your day?",
  evening: "Good evening! Let's plan for tomorrow or reflect on today."
};

const taskSuggestionTemplates = [
  "Break down your project into smaller, manageable tasks",
  "Start with a quick 15-minute task to build momentum",
  "Focus on your most important task first",
  "Batch similar tasks together for efficiency",
  "Set a specific time limit for each task",
  "Take a 5-minute break between tasks",
  "Review your goals before starting",
  "Eliminate distractions from your workspace"
];

const planningPrompts = [
  "What are your top 3 priorities today?",
  "How much time do you have available?",
  "What's your energy level right now?",
  "Any deadlines approaching?",
  "What would make today feel successful?"
];

export const generateAIResponse = (userPrompt, todos) => {
  const prompt = userPrompt.toLowerCase();
  const now = new Date();
  const hour = now.getHours();
  const incompleteTasks = todos.filter(todo => !todo.completed);
  const highPriorityTasks = incompleteTasks.filter(todo => todo.priority === 'high');
  
  let timeOfDay;
  if (hour < 12) timeOfDay = 'morning';
  else if (hour < 17) timeOfDay = 'afternoon';
  else timeOfDay = 'evening';

  // Task-related queries
  if (prompt.includes('task') || prompt.includes('what should i do') || prompt.includes('what to do')) {
    if (incompleteTasks.length === 0) {
      return {
        content: "Great job! You've completed all your tasks. Consider adding new goals or taking time to plan ahead. You could also use this time for learning, reflection, or preparing for tomorrow.",
        suggestions: [
          "Add new goals for tomorrow",
          "Review completed tasks",
          "Plan next week",
          "Take a well-deserved break"
        ]
      };
    }

    if (highPriorityTasks.length > 0) {
      const taskList = highPriorityTasks.slice(0, 3).map(task => `• ${task.text}`).join('\n');
      return {
        content: `I recommend focusing on your high-priority tasks first:\n\n${taskList}\n\nStart with the first one and use the Pomodoro timer for focused work sessions.`,
        suggestions: [
          "Start with the most urgent task",
          "Use Pomodoro timer for focus",
          "Break large tasks into smaller steps",
          "Set a specific time limit"
        ]
      };
    }

    const randomTasks = incompleteTasks.slice(0, 3);
    const taskList = randomTasks.map(task => `• ${task.text} (${task.priority} priority)`).join('\n');
    return {
      content: `Here are some tasks you could work on:\n\n${taskList}\n\nI suggest starting with the highest priority item and working in focused 25-minute sessions.`,
      suggestions: taskSuggestionTemplates.slice(0, 4)
    };
  }

  // Planning queries
  if (prompt.includes('plan') || prompt.includes('organize') || prompt.includes('schedule')) {
    const totalTasks = incompleteTasks.length;
    const estimatedTime = incompleteTasks.reduce((total, task) => total + (task.estimatedTime || 30), 0);
    
    return {
      content: `Let's plan your ${timeOfDay}! You have ${totalTasks} tasks remaining with an estimated ${Math.round(estimatedTime / 60)} hours of work. Here's my suggested approach:\n\n1. Start with high-priority tasks\n2. Use 25-minute focused work sessions\n3. Take 5-minute breaks between sessions\n4. Group similar tasks together\n\nWhat's your main goal for today?`,
      suggestions: planningPrompts
    };
  }

  // Productivity queries
  if (prompt.includes('productive') || prompt.includes('focus') || prompt.includes('efficient')) {
    return {
      content: `Here are my top productivity tips for you:\n\n• Use the Pomodoro Technique (25 min work + 5 min break)\n• Tackle your most challenging task when your energy is highest\n• Eliminate distractions from your workspace\n• Set specific, measurable goals for each session\n• Take regular breaks to maintain focus\n\nYour current completion rate is ${Math.round((todos.filter(t => t.completed).length / Math.max(todos.length, 1)) * 100)}% - keep up the great work!`,
      suggestions: [
        "Start a Pomodoro session",
        "Clear your workspace",
        "Set a specific goal",
        "Turn off notifications"
      ]
    };
  }

  // Time-specific queries
  if (prompt.includes('morning') || prompt.includes('start')) {
    return {
      content: `${timeBasedGreetings.morning} Here's how to start strong:\n\n• Review your priorities for the day\n• Start with your most important task\n• Use your peak morning energy wisely\n• Set clear intentions for each work session\n\nWhat's the one thing that would make today successful?`,
      suggestions: [
        "Review daily priorities",
        "Start with the hardest task",
        "Set clear intentions",
        "Plan your morning routine"
      ]
    };
  }

  if (prompt.includes('afternoon') || prompt.includes('lunch')) {
    return {
      content: `${timeBasedGreetings.afternoon} The afternoon can be great for:\n\n• Lighter, administrative tasks\n• Collaborative work and meetings\n• Reviewing and organizing\n• Planning for tomorrow\n\nHow's your energy level right now?`,
      suggestions: [
        "Handle administrative tasks",
        "Review morning progress",
        "Plan remaining day",
        "Take an energizing break"
      ]
    };
  }

  if (prompt.includes('evening') || prompt.includes('night') || prompt.includes('tomorrow')) {
    return {
      content: `${timeBasedGreetings.evening} This is perfect time for:\n\n• Reflecting on today's accomplishments\n• Planning tomorrow's priorities\n• Preparing your workspace\n• Celebrating your wins\n\nWhat went well today?`,
      suggestions: [
        "Plan tomorrow's tasks",
        "Reflect on achievements",
        "Prepare workspace",
        "Set tomorrow's priorities"
      ]
    };
  }

  // Motivation queries
  if (prompt.includes('motivat') || prompt.includes('inspire') || prompt.includes('stuck')) {
    return {
      content: `I understand it can be challenging sometimes. Remember:\n\n• Progress over perfection\n• Small steps lead to big results\n• You've overcome challenges before\n• Every completed task is a victory\n\nStart with just 5 minutes on any task. Often, starting is the hardest part, and momentum will carry you forward.`,
      suggestions: [
        "Start with a 5-minute task",
        "Celebrate small wins",
        "Take a refreshing break",
        "Remember your why"
      ]
    };
  }

  // Break/rest queries
  if (prompt.includes('break') || prompt.includes('rest') || prompt.includes('tired')) {
    return {
      content: `Taking breaks is essential for productivity! Here are some refreshing break ideas:\n\n• Take a short walk outside\n• Do some light stretching\n• Practice deep breathing\n• Hydrate and have a healthy snack\n• Step away from screens\n\nA good break will help you return with renewed focus and energy.`,
      suggestions: [
        "Take a 10-minute walk",
        "Do some stretching",
        "Practice mindfulness",
        "Get some fresh air"
      ]
    };
  }

  // Default response
  return {
    content: `${timeBasedGreetings[timeOfDay]} I'm here to help you be more productive! You can ask me about:\n\n• Task suggestions and prioritization\n• Daily planning and scheduling\n• Productivity tips and techniques\n• Motivation and focus strategies\n\nWhat would you like help with today?`,
    suggestions: [
      "What should I work on first?",
      "Help me plan my day",
      "Give me productivity tips",
      "I need motivation to start"
    ]
  };
};