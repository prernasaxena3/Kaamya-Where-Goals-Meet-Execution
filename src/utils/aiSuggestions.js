const baseSuggestions = [
  {
    id: '1',
    title: 'Start with your most important task',
    description: 'Tackle your highest priority task first when your energy is at its peak.',
    type: 'productivity',
    priority: 9
  },
  {
    id: '2',
    title: 'Use the Pomodoro Technique',
    description: 'Break your work into 25-minute focused intervals with 5-minute breaks.',
    type: 'productivity',
    priority: 8
  },
  {
    id: '3',
    title: 'Plan your day the night before',
    description: 'Spend 10 minutes each evening planning tomorrow\'s priorities.',
    type: 'planning',
    priority: 7
  },
  {
    id: '4',
    title: 'Take regular breaks',
    description: 'Step away from your desk every hour to maintain focus and prevent burnout.',
    type: 'wellness',
    priority: 6
  },
  {
    id: '5',
    title: 'Batch similar tasks together',
    description: 'Group similar activities to minimize context switching and increase efficiency.',
    type: 'optimization',
    priority: 8
  }
];

const timeBasedSuggestions = {
  morning: [
    {
      id: 'morning-1',
      title: 'Morning energy boost',
      description: 'Use your morning energy for your most challenging and important tasks.',
      type: 'productivity',
      priority: 9
    },
    {
      id: 'morning-2',
      title: 'Review your daily goals',
      description: 'Start your day by reviewing and prioritizing your tasks for maximum impact.',
      type: 'planning',
      priority: 8
    }
  ],
  afternoon: [
    {
      id: 'afternoon-1',
      title: 'Post-lunch productivity dip',
      description: 'Handle lighter tasks during the afternoon slump and save energy for later.',
      type: 'productivity',
      priority: 7
    },
    {
      id: 'afternoon-2',
      title: 'Mid-day reflection',
      description: 'Review your morning progress and adjust your afternoon priorities accordingly.',
      type: 'planning',
      priority: 6
    }
  ],
  evening: [
    {
      id: 'evening-1',
      title: 'Prepare for tomorrow',
      description: 'Set yourself up for success by preparing your tasks and workspace for tomorrow.',
      type: 'planning',
      priority: 8
    },
    {
      id: 'evening-2',
      title: 'Reflect on achievements',
      description: 'Take time to acknowledge what you accomplished today and celebrate small wins.',
      type: 'wellness',
      priority: 7
    }
  ]
};

export const generateAISuggestions = (todos) => {
  const suggestions = [...baseSuggestions];
  const now = new Date();
  const hour = now.getHours();

  // Add time-based suggestions
  let timeOfDay;
  if (hour < 12) {
    timeOfDay = 'morning';
  } else if (hour < 17) {
    timeOfDay = 'afternoon';
  } else {
    timeOfDay = 'evening';
  }

  suggestions.push(...timeBasedSuggestions[timeOfDay]);

  // Add task-specific suggestions
  const incompleteTasks = todos.filter(todo => !todo.completed);
  const highPriorityTasks = incompleteTasks.filter(todo => todo.priority === 'high');

  if (highPriorityTasks.length > 3) {
    suggestions.push({
      id: 'high-priority-overload',
      title: 'Too many high priority tasks',
      description: `You have ${highPriorityTasks.length} high priority tasks. Consider re-evaluating priorities or breaking them into smaller chunks.`,
      type: 'optimization',
      priority: 10
    });
  }

  if (incompleteTasks.length === 0) {
    suggestions.push({
      id: 'no-tasks',
      title: 'Great job completing all tasks!',
      description: 'Consider adding new goals or taking time to plan ahead for upcoming projects.',
      type: 'planning',
      priority: 5
    });
  }

  if (incompleteTasks.length > 10) {
    suggestions.push({
      id: 'task-overload',
      title: 'Task list getting overwhelming',
      description: 'Break large tasks into smaller, manageable pieces and focus on 3-5 key items today.',
      type: 'optimization',
      priority: 9
    });
  }

  // Sort suggestions by priority and return top 3
  return suggestions
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);
};