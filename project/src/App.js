import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Star, 
  Trash2, 
  Edit3, 
  MoreHorizontal,
  User,
  Bell,
  Settings,
  ChevronDown,
  Tag,
  Flag,
  Archive,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  ArrowLeft,
  RotateCcw,
  X
} from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Design new landing page',
      description: 'Create wireframes and mockups for the new product landing page',
      completed: false,
      priority: 'high',
      category: 'Design',
      dueDate: '2025-01-15',
      tags: ['UI/UX', 'Web Design'],
      starred: true,
      archived: false,
      createdAt: '2025-01-10'
    },
    {
      id: 2,
      title: 'Review code submissions',
      description: 'Go through pull requests and provide feedback to team members',
      completed: true,
      priority: 'medium',
      category: 'Development',
      dueDate: '2025-01-12',
      tags: ['Code Review', 'Team'],
      starred: false,
      archived: false,
      createdAt: '2025-01-08'
    },
    {
      id: 3,
      title: 'Prepare quarterly presentation',
      description: 'Compile metrics and create slides for Q1 review meeting',
      completed: false,
      priority: 'high',
      category: 'Business',
      dueDate: '2025-01-20',
      tags: ['Presentation', 'Metrics'],
      starred: true,
      archived: false,
      createdAt: '2025-01-09'
    },
    {
      id: 4,
      title: 'Update documentation',
      description: 'Revise API documentation with latest changes',
      completed: false,
      priority: 'low',
      category: 'Documentation',
      dueDate: '2025-01-25',
      tags: ['API', 'Docs'],
      starred: false,
      archived: false,
      createdAt: '2025-01-07'
    },
    {
      id: 5,
      title: 'Old project cleanup',
      description: 'Remove deprecated files and update legacy code',
      completed: true,
      priority: 'low',
      category: 'Development',
      dueDate: '2025-01-05',
      tags: ['Cleanup', 'Legacy'],
      starred: false,
      archived: true,
      createdAt: '2025-01-01'
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'General',
    dueDate: '',
    tags: []
  });

  const [showAddTask, setShowAddTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [currentView, setCurrentView] = useState('tasks'); // 'tasks', 'analytics', 'archive'

  const categories = ['General', 'Design', 'Development', 'Business', 'Documentation', 'Marketing'];
  const priorities = ['low', 'medium', 'high'];

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200'
  };

  const categoryColors = {
    General: 'bg-gray-100 text-gray-800',
    Design: 'bg-purple-100 text-purple-800',
    Development: 'bg-blue-100 text-blue-800',
    Business: 'bg-green-100 text-green-800',
    Documentation: 'bg-orange-100 text-orange-800',
    Marketing: 'bg-pink-100 text-pink-800'
  };

  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        ...newTask,
        completed: false,
        starred: false,
        archived: false,
        createdAt: new Date().toISOString().split('T')[0],
        tags: newTask.tags.filter(tag => tag.trim())
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        category: 'General',
        dueDate: '',
        tags: []
      });
      setShowAddTask(false);
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleStar = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, starred: !task.starred } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const archiveTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, archived: true } : task
    ));
  };

  const restoreTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, archived: false } : task
    ));
  };

  const activeTasks = tasks.filter(task => !task.archived);
  const archivedTasks = tasks.filter(task => task.archived);

  const filteredTasks = (currentView === 'archive' ? archivedTasks : activeTasks).filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesCompleted = showCompleted || !task.completed;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesCompleted;
  });

  const stats = {
    total: activeTasks.length,
    completed: activeTasks.filter(t => t.completed).length,
    pending: activeTasks.filter(t => !t.completed).length,
    starred: activeTasks.filter(t => t.starred).length,
    archived: archivedTasks.length,
    overdue: activeTasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length
  };

  const analyticsData = {
    completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    categoryBreakdown: categories.map(cat => ({
      name: cat,
      count: activeTasks.filter(t => t.category === cat).length,
      completed: activeTasks.filter(t => t.category === cat && t.completed).length
    })).filter(item => item.count > 0),
    priorityBreakdown: priorities.map(priority => ({
      name: priority,
      count: activeTasks.filter(t => t.priority === priority).length,
      completed: activeTasks.filter(t => t.priority === priority && t.completed).length
    })).filter(item => item.count > 0),
    weeklyProgress: (() => {
      const last7Days = Array.from({length: 7}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();
      
      return last7Days.map(date => ({
        date,
        completed: tasks.filter(t => t.completed && t.createdAt === date).length,
        created: tasks.filter(t => t.createdAt === date).length
      }));
    })()
  };

  const addTag = (tag) => {
    if (tag.trim() && !newTask.tags.includes(tag.trim())) {
      setNewTask({
        ...newTask,
        tags: [...newTask.tags, tag.trim()]
      });
    }
  };

  const removeTag = (tagToRemove) => {
    setNewTask({
      ...newTask,
      tags: newTask.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const renderAnalytics = () => {
    return React.createElement('div', { className: 'space-y-6' },
      // Header
      React.createElement('div', { className: 'flex items-center justify-between mb-6' },
        React.createElement('div', { className: 'flex items-center space-x-3' },
          React.createElement('button', {
            onClick: () => setCurrentView('tasks'),
            className: 'p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
          },
            React.createElement(ArrowLeft, { className: 'w-5 h-5 text-gray-600' })
          ),
          React.createElement('h2', { className: 'text-2xl font-bold text-gray-900' }, 'Analytics Dashboard')
        )
      ),

      // Key Metrics
      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' },
        React.createElement('div', { className: 'bg-white rounded-2xl p-6 border border-gray-200 shadow-sm' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('div', null,
              React.createElement('p', { className: 'text-gray-600 text-sm' }, 'Completion Rate'),
              React.createElement('p', { className: 'text-3xl font-bold text-gray-900' }, `${analyticsData.completionRate}%`)
            ),
            React.createElement('div', { className: 'w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center' },
              React.createElement(TrendingUp, { className: 'w-6 h-6 text-green-600' })
            )
          )
        ),
        React.createElement('div', { className: 'bg-white rounded-2xl p-6 border border-gray-200 shadow-sm' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('div', null,
              React.createElement('p', { className: 'text-gray-600 text-sm' }, 'Total Tasks'),
              React.createElement('p', { className: 'text-3xl font-bold text-gray-900' }, stats.total)
            ),
            React.createElement('div', { className: 'w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center' },
              React.createElement(Target, { className: 'w-6 h-6 text-blue-600' })
            )
          )
        ),
        React.createElement('div', { className: 'bg-white rounded-2xl p-6 border border-gray-200 shadow-sm' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('div', null,
              React.createElement('p', { className: 'text-gray-600 text-sm' }, 'Overdue Tasks'),
              React.createElement('p', { className: 'text-3xl font-bold text-gray-900' }, stats.overdue)
            ),
            React.createElement('div', { className: 'w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center' },
              React.createElement(Clock, { className: 'w-6 h-6 text-red-600' })
            )
          )
        ),
        React.createElement('div', { className: 'bg-white rounded-2xl p-6 border border-gray-200 shadow-sm' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('div', null,
              React.createElement('p', { className: 'text-gray-600 text-sm' }, 'Starred Tasks'),
              React.createElement('p', { className: 'text-3xl font-bold text-gray-900' }, stats.starred)
            ),
            React.createElement('div', { className: 'w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center' },
              React.createElement(Star, { className: 'w-6 h-6 text-yellow-600' })
            )
          )
        )
      ),

      // Charts Section
      React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
        // Category Breakdown
        React.createElement('div', { className: 'bg-white rounded-2xl p-6 border border-gray-200 shadow-sm' },
          React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-4 flex items-center' },
            React.createElement(PieChart, { className: 'w-5 h-5 mr-2' }),
            'Tasks by Category'
          ),
          React.createElement('div', { className: 'space-y-3' },
            ...analyticsData.categoryBreakdown.map(item =>
              React.createElement('div', { key: item.name, className: 'flex items-center justify-between' },
                React.createElement('div', { className: 'flex items-center space-x-3' },
                  React.createElement('div', { className: `w-3 h-3 rounded-full ${categoryColors[item.name].split(' ')[0]}` }),
                  React.createElement('span', { className: 'text-gray-900' }, item.name)
                ),
                React.createElement('div', { className: 'text-right' },
                  React.createElement('span', { className: 'text-gray-900 font-medium' }, item.count),
                  React.createElement('span', { className: 'text-gray-500 text-sm ml-2' }, 
                    `(${item.count > 0 ? Math.round((item.completed / item.count) * 100) : 0}% done)`
                  )
                )
              )
            )
          )
        ),

        // Priority Breakdown
        React.createElement('div', { className: 'bg-white rounded-2xl p-6 border border-gray-200 shadow-sm' },
          React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-4 flex items-center' },
            React.createElement(BarChart3, { className: 'w-5 h-5 mr-2' }),
            'Tasks by Priority'
          ),
          React.createElement('div', { className: 'space-y-3' },
            ...analyticsData.priorityBreakdown.map(item =>
              React.createElement('div', { key: item.name, className: 'flex items-center justify-between' },
                React.createElement('div', { className: 'flex items-center space-x-3' },
                  React.createElement('div', { 
                    className: `w-3 h-3 rounded-full ${
                      item.name === 'high' ? 'bg-red-500' : 
                      item.name === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`
                  }),
                  React.createElement('span', { className: 'text-gray-900 capitalize' }, item.name)
                ),
                React.createElement('div', { className: 'text-right' },
                  React.createElement('span', { className: 'text-gray-900 font-medium' }, item.count),
                  React.createElement('span', { className: 'text-gray-500 text-sm ml-2' }, 
                    `(${item.count > 0 ? Math.round((item.completed / item.count) * 100) : 0}% done)`
                  )
                )
              )
            )
          )
        )
      ),

      // Weekly Progress
      React.createElement('div', { className: 'bg-white rounded-2xl p-6 border border-gray-200 shadow-sm' },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-4 flex items-center' },
          React.createElement(Activity, { className: 'w-5 h-5 mr-2' }),
          'Weekly Progress'
        ),
        React.createElement('div', { className: 'grid grid-cols-7 gap-2' },
          ...analyticsData.weeklyProgress.map((day, index) =>
            React.createElement('div', { key: index, className: 'text-center' },
              React.createElement('div', { className: 'text-gray-500 text-xs mb-2' }, 
                new Date(day.date).toLocaleDateString('en', { weekday: 'short' })
              ),
              React.createElement('div', { className: 'bg-gray-50 rounded-lg p-3' },
                React.createElement('div', { className: 'text-green-600 font-medium' }, day.completed),
                React.createElement('div', { className: 'text-gray-500 text-xs' }, 'completed'),
                React.createElement('div', { className: 'text-blue-600 font-medium mt-1' }, day.created),
                React.createElement('div', { className: 'text-gray-500 text-xs' }, 'created')
              )
            )
          )
        )
      )
    );
  };

  const renderArchive = () => {
    return React.createElement('div', { className: 'space-y-6' },
      // Header
      React.createElement('div', { className: 'flex items-center justify-between mb-6' },
        React.createElement('div', { className: 'flex items-center space-x-3' },
          React.createElement('button', {
            onClick: () => setCurrentView('tasks'),
            className: 'p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
          },
            React.createElement(ArrowLeft, { className: 'w-5 h-5 text-gray-600' })
          ),
          React.createElement('h2', { className: 'text-2xl font-bold text-gray-900' }, 'Archived Tasks'),
          React.createElement('span', { className: 'bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm' }, 
            `${archivedTasks.length} archived`
          )
        )
      ),

      // Archive List
      React.createElement('div', { className: 'space-y-4' },
        archivedTasks.length === 0 ? 
          React.createElement('div', { className: 'bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm' },
            React.createElement('div', { className: 'w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4' },
              React.createElement(Archive, { className: 'w-8 h-8 text-gray-400' })
            ),
            React.createElement('h3', { className: 'text-lg font-medium text-gray-900 mb-2' }, 'No archived tasks'),
            React.createElement('p', { className: 'text-gray-500' }, 'Completed tasks will appear here when archived')
          ) :
          filteredTasks.map(task =>
            React.createElement('div', {
              key: task.id,
              className: 'bg-white rounded-2xl p-6 border border-gray-200 shadow-sm opacity-75'
            },
              React.createElement('div', { className: 'flex items-start justify-between' },
                React.createElement('div', { className: 'flex items-start space-x-4 flex-1' },
                  React.createElement('div', { className: 'mt-1' },
                    React.createElement(Archive, { className: 'w-6 h-6 text-gray-400' })
                  ),
                  React.createElement('div', { className: 'flex-1 min-w-0' },
                    React.createElement('div', { className: 'flex items-center space-x-3 mb-2' },
                      React.createElement('h3', { className: 'text-lg font-semibold text-gray-500 line-through' }, task.title),
                      React.createElement('span', { 
                        className: `px-2 py-1 text-xs font-medium rounded-full border border-gray-200 text-gray-500`
                      }, task.priority.toUpperCase()),
                      React.createElement('span', { 
                        className: 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500'
                      }, task.category)
                    ),
                    React.createElement('p', { className: 'text-gray-400 mb-3 line-through' }, task.description),
                    React.createElement('div', { className: 'flex items-center space-x-4 text-sm text-gray-400' },
                      React.createElement('div', { className: 'flex items-center space-x-1' },
                        React.createElement(Calendar, { className: 'w-4 h-4' }),
                        React.createElement('span', null, new Date(task.dueDate).toLocaleDateString())
                      ),
                      task.tags.length > 0 && React.createElement('div', { className: 'flex items-center space-x-2' },
                        React.createElement(Tag, { className: 'w-4 h-4' }),
                        React.createElement('div', { className: 'flex space-x-1' },
                          ...task.tags.map(tag =>
                            React.createElement('span', {
                              key: tag,
                              className: 'px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs'
                            }, tag)
                          )
                        )
                      )
                    )
                  )
                ),
                React.createElement('div', { className: 'flex items-center space-x-2' },
                  React.createElement('button', {
                    onClick: () => restoreTask(task.id),
                    className: 'p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200',
                    title: 'Restore task'
                  },
                    React.createElement(RotateCcw, { className: 'w-5 h-5 text-gray-400 hover:text-green-600' })
                  ),
                  React.createElement('button', {
                    onClick: () => deleteTask(task.id),
                    className: 'p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200',
                    title: 'Delete permanently'
                  },
                    React.createElement(Trash2, { className: 'w-5 h-5 text-gray-400 hover:text-red-600' })
                  )
                )
              )
            )
          )
      )
    );
  };

  if (currentView === 'analytics') {
    return React.createElement('div', { className: 'min-h-screen bg-gray-50' },
      // Header
      React.createElement('header', { className: 'bg-white shadow-sm border-b border-gray-200' },
        React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
          React.createElement('div', { className: 'flex justify-between items-center py-4' },
            React.createElement('div', { className: 'flex items-center space-x-3' },
              React.createElement('div', { className: 'w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center' },
                React.createElement(Target, { className: 'w-6 h-6 text-blue-600' })
              ),
              React.createElement('div', null,
                React.createElement('h1', { className: 'text-2xl font-bold text-gray-900' }, 'TaskFlow'),
                React.createElement('p', { className: 'text-sm text-gray-600' }, 'Analytics Dashboard')
              )
            ),
            React.createElement('div', { className: 'flex items-center space-x-4' },
              React.createElement('button', { className: 'p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200' },
                React.createElement(Bell, { className: 'w-5 h-5' })
              ),
              React.createElement('button', { className: 'p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200' },
                React.createElement(Settings, { className: 'w-5 h-5' })
              ),
              React.createElement('div', { className: 'w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center' },
                React.createElement(User, { className: 'w-5 h-5 text-gray-600' })
              )
            )
          )
        )
      ),
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' },
        renderAnalytics()
      )
    );
  }

  if (currentView === 'archive') {
    return React.createElement('div', { className: 'min-h-screen bg-gray-50' },
      // Header
      React.createElement('header', { className: 'bg-white shadow-sm border-b border-gray-200' },
        React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
          React.createElement('div', { className: 'flex justify-between items-center py-4' },
            React.createElement('div', { className: 'flex items-center space-x-3' },
              React.createElement('div', { className: 'w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center' },
                React.createElement(Target, { className: 'w-6 h-6 text-blue-600' })
              ),
              React.createElement('div', null,
                React.createElement('h1', { className: 'text-2xl font-bold text-gray-900' }, 'TaskFlow'),
                React.createElement('p', { className: 'text-sm text-gray-600' }, 'Archived Tasks')
              )
            ),
            React.createElement('div', { className: 'flex items-center space-x-4' },
              React.createElement('button', { className: 'p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200' },
                React.createElement(Bell, { className: 'w-5 h-5' })
              ),
              React.createElement('button', { className: 'p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200' },
                React.createElement(Settings, { className: 'w-5 h-5' })
              ),
              React.createElement('div', { className: 'w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center' },
                React.createElement(User, { className: 'w-5 h-5 text-gray-600' })
              )
            )
          )
        )
      ),
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' },
        renderArchive()
      )
    );
  }

  return React.createElement('div', { className: 'min-h-screen bg-gray-50' },
    // Header
    React.createElement('header', { className: 'bg-white shadow-sm border-b border-gray-200' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
        React.createElement('div', { className: 'flex justify-between items-center py-4' },
          React.createElement('div', { className: 'flex items-center space-x-3' },
            React.createElement('div', { className: 'w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center' },
              React.createElement(Target, { className: 'w-6 h-6 text-blue-600' })
            ),
            React.createElement('div', null,
              React.createElement('h1', { className: 'text-2xl font-bold text-gray-900' }, 'TaskFlow'),
              React.createElement('p', { className: 'text-sm text-gray-600' }, 'Organize your productivity')
            )
          ),
          React.createElement('div', { className: 'flex items-center space-x-4' },
            React.createElement('button', { className: 'p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200' },
              React.createElement(Bell, { className: 'w-5 h-5' })
            ),
            React.createElement('button', { className: 'p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200' },
              React.createElement(Settings, { className: 'w-5 h-5' })
            ),
            React.createElement('div', { className: 'w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center' },
              React.createElement(User, { className: 'w-5 h-5 text-gray-600' })
            )
          )
        )
      )
    ),

    React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' },
      React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-4 gap-8' },
        
        // Sidebar
        React.createElement('div', { className: 'lg:col-span-1' },
          React.createElement('div', { className: 'bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6' },
            React.createElement('h2', { className: 'text-lg font-semibold text-gray-900 mb-4' }, 'Overview'),
            React.createElement('div', { className: 'space-y-4' },
              React.createElement('div', { className: 'flex items-center justify-between p-3 bg-blue-50 rounded-lg' },
                React.createElement('div', { className: 'flex items-center space-x-3' },
                  React.createElement('div', { className: 'w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center' },
                    React.createElement(Target, { className: 'w-4 h-4 text-blue-600' })
                  ),
                  React.createElement('span', { className: 'text-sm font-medium text-gray-900' }, 'Total Tasks')
                ),
                React.createElement('span', { className: 'text-lg font-bold text-blue-600' }, stats.total)
              ),
              React.createElement('div', { className: 'flex items-center justify-between p-3 bg-green-50 rounded-lg' },
                React.createElement('div', { className: 'flex items-center space-x-3' },
                  React.createElement('div', { className: 'w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center' },
                    React.createElement(CheckCircle2, { className: 'w-4 h-4 text-green-600' })
                  ),
                  React.createElement('span', { className: 'text-sm font-medium text-gray-900' }, 'Completed')
                ),
                React.createElement('span', { className: 'text-lg font-bold text-green-600' }, stats.completed)
              ),
              React.createElement('div', { className: 'flex items-center justify-between p-3 bg-orange-50 rounded-lg' },
                React.createElement('div', { className: 'flex items-center space-x-3' },
                  React.createElement('div', { className: 'w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center' },
                    React.createElement(Clock, { className: 'w-4 h-4 text-orange-600' })
                  ),
                  React.createElement('span', { className: 'text-sm font-medium text-gray-900' }, 'Pending')
                ),
                React.createElement('span', { className: 'text-lg font-bold text-orange-600' }, stats.pending)
              ),
              React.createElement('div', { className: 'flex items-center justify-between p-3 bg-yellow-50 rounded-lg' },
                React.createElement('div', { className: 'flex items-center space-x-3' },
                  React.createElement('div', { className: 'w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center' },
                    React.createElement(Star, { className: 'w-4 h-4 text-yellow-600' })
                  ),
                  React.createElement('span', { className: 'text-sm font-medium text-gray-900' }, 'Starred')
                ),
                React.createElement('span', { className: 'text-lg font-bold text-yellow-600' }, stats.starred)
              )
            )
          ),

          // Quick Actions
          React.createElement('div', { className: 'bg-white rounded-2xl shadow-sm border border-gray-200 p-6' },
            React.createElement('h2', { className: 'text-lg font-semibold text-gray-900 mb-4' }, 'Quick Actions'),
            React.createElement('div', { className: 'space-y-3' },
              React.createElement('button', {
                onClick: () => setShowAddTask(true),
                className: 'w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200'
              },
                React.createElement(Plus, { className: 'w-5 h-5 text-blue-600' }),
                React.createElement('span', { className: 'text-sm font-medium text-gray-900' }, 'Add New Task')
              ),
              React.createElement('button', { 
                onClick: () => setCurrentView('archive'),
                className: 'w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200' 
              },
                React.createElement(Archive, { className: 'w-5 h-5 text-gray-600' }),
                React.createElement('span', { className: 'text-sm font-medium text-gray-900' }, 'View Archive'),
                stats.archived > 0 && React.createElement('span', { className: 'ml-auto bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full' }, stats.archived)
              ),
              React.createElement('button', { 
                onClick: () => setCurrentView('analytics'),
                className: 'w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200' 
              },
                React.createElement(TrendingUp, { className: 'w-5 h-5 text-green-600' }),
                React.createElement('span', { className: 'text-sm font-medium text-gray-900' }, 'View Analytics')
              )
            )
          )
        ),

        // Main Content
        React.createElement('div', { className: 'lg:col-span-3' },
          // Filters and Search
          React.createElement('div', { className: 'bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6' },
            React.createElement('div', { className: 'flex flex-col md:flex-row gap-4' },
              React.createElement('div', { className: 'flex-1 relative' },
                React.createElement(Search, { className: 'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' }),
                React.createElement('input', {
                  type: 'text',
                  placeholder: 'Search tasks...',
                  value: searchTerm,
                  onChange: (e) => setSearchTerm(e.target.value),
                  className: 'w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500'
                })
              ),
              React.createElement('select', {
                value: filterCategory,
                onChange: (e) => setFilterCategory(e.target.value),
                className: 'px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900'
              },
                React.createElement('option', { value: 'all' }, 'All Categories'),
                ...categories.map(cat =>
                  React.createElement('option', { key: cat, value: cat }, cat)
                )
              ),
              React.createElement('select', {
                value: filterPriority,
                onChange: (e) => setFilterPriority(e.target.value),
                className: 'px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900'
              },
                React.createElement('option', { value: 'all' }, 'All Priorities'),
                ...priorities.map(priority =>
                  React.createElement('option', { key: priority, value: priority }, 
                    priority.charAt(0).toUpperCase() + priority.slice(1)
                  )
                )
              ),
              React.createElement('label', { className: 'flex items-center space-x-2 px-4 py-3 bg-gray-50 rounded-lg' },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: showCompleted,
                  onChange: (e) => setShowCompleted(e.target.checked),
                  className: 'rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                }),
                React.createElement('span', { className: 'text-sm font-medium text-gray-900' }, 'Show Completed')
              )
            )
          ),

          // Task List
          React.createElement('div', { className: 'space-y-4' },
            filteredTasks.length === 0 ? 
              React.createElement('div', { className: 'bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center' },
                React.createElement('div', { className: 'w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4' },
                  React.createElement(Target, { className: 'w-8 h-8 text-gray-400' })
                ),
                React.createElement('h3', { className: 'text-lg font-medium text-gray-900 mb-2' }, 'No tasks found'),
                React.createElement('p', { className: 'text-gray-500 mb-6' }, 'Try adjusting your filters or create a new task'),
                React.createElement('button', {
                  onClick: () => setShowAddTask(true),
                  className: 'px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium'
                }, 'Create Task')
              ) :
              filteredTasks.map(task =>
                React.createElement('div', {
                  key: task.id,
                  className: `bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 ${
                    task.completed ? 'opacity-75' : ''
                  }`
                },
                  React.createElement('div', { className: 'flex items-start justify-between' },
                    React.createElement('div', { className: 'flex items-start space-x-4 flex-1' },
                      React.createElement('button', {
                        onClick: () => toggleTask(task.id),
                        className: 'mt-1 flex-shrink-0'
                      },
                        task.completed ?
                          React.createElement(CheckCircle2, { className: 'w-6 h-6 text-green-500' }) :
                          React.createElement(Circle, { className: 'w-6 h-6 text-gray-300 hover:text-blue-500 transition-colors duration-200' })
                      ),
                      React.createElement('div', { className: 'flex-1 min-w-0' },
                        React.createElement('div', { className: 'flex items-center space-x-3 mb-2' },
                          React.createElement('h3', { 
                            className: `text-lg font-semibold ${
                              task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                            }`
                          }, task.title),
                          React.createElement('span', { 
                            className: `px-2 py-1 text-xs font-medium rounded-full border ${
                              task.priority === 'high' ? 'text-red-700 bg-red-50 border-red-200' :
                              task.priority === 'medium' ? 'text-yellow-700 bg-yellow-50 border-yellow-200' :
                              'text-green-700 bg-green-50 border-green-200'
                            }`
                          }, task.priority.toUpperCase()),
                          React.createElement('span', { 
                            className: `px-2 py-1 text-xs font-medium rounded-full ${categoryColors[task.category]}`
                          }, task.category)
                        ),
                        React.createElement('p', { 
                          className: `text-gray-600 mb-3 ${task.completed ? 'line-through' : ''}`
                        }, task.description),
                        React.createElement('div', { className: 'flex items-center space-x-4 text-sm text-gray-500' },
                          React.createElement('div', { className: 'flex items-center space-x-1' },
                            React.createElement(Calendar, { className: 'w-4 h-4' }),
                            React.createElement('span', null, new Date(task.dueDate).toLocaleDateString())
                          ),
                          task.tags.length > 0 && React.createElement('div', { className: 'flex items-center space-x-2' },
                            React.createElement(Tag, { className: 'w-4 h-4' }),
                            React.createElement('div', { className: 'flex space-x-1' },
                              ...task.tags.map(tag =>
                                React.createElement('span', {
                                  key: tag,
                                  className: 'px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs'
                                }, tag)
                              )
                            )
                          )
                        )
                      )
                    ),
                    React.createElement('div', { className: 'flex items-center space-x-2' },
                      React.createElement('button', {
                        onClick: () => toggleStar(task.id),
                        className: 'p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                      },
                        React.createElement(Star, { 
                          className: `w-5 h-5 ${
                            task.starred ? 'text-yellow-500 fill-current' : 'text-gray-300 hover:text-yellow-500'
                          }`
                        })
                      ),
                      React.createElement('button', { className: 'p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200' },
                        React.createElement(Edit3, { className: 'w-5 h-5 text-gray-300 hover:text-blue-500' })
                      ),
                      React.createElement('button', {
                        onClick: () => archiveTask(task.id),
                        className: 'p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200',
                        title: 'Archive task'
                      },
                        React.createElement(Archive, { className: 'w-5 h-5 text-gray-300 hover:text-orange-500' })
                      ),
                      React.createElement('button', {
                        onClick: () => deleteTask(task.id),
                        className: 'p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                      },
                        React.createElement(Trash2, { className: 'w-5 h-5 text-gray-300 hover:text-red-500' })
                      )
                    )
                  )
                )
              )
          )
        )
      )
    ),

    // Add Task Modal
    showAddTask && React.createElement('div', { className: 'fixed inset-0 z-50 overflow-y-auto' },
      React.createElement('div', { className: 'flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0' },
        React.createElement('div', { 
          className: 'fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75',
          onClick: () => setShowAddTask(false)
        }),
        React.createElement('div', { className: 'inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl' },
          React.createElement('div', { className: 'flex items-center justify-between mb-6' },
            React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, 'Add New Task'),
            React.createElement('button', {
              onClick: () => setShowAddTask(false),
              className: 'p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
            },
              React.createElement(X, { className: 'w-5 h-5 text-gray-400' })
            )
          ),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Title'),
              React.createElement('input', {
                type: 'text',
                value: newTask.title,
                onChange: (e) => setNewTask({ ...newTask, title: e.target.value }),
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                placeholder: 'Enter task title...'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Description'),
              React.createElement('textarea', {
                value: newTask.description,
                onChange: (e) => setNewTask({ ...newTask, description: e.target.value }),
                rows: 3,
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none',
                placeholder: 'Enter task description...'
              })
            ),
            React.createElement('div', { className: 'grid grid-cols-2 gap-4' },
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Priority'),
                React.createElement('select', {
                  value: newTask.priority,
                  onChange: (e) => setNewTask({ ...newTask, priority: e.target.value }),
                  className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                },
                  ...priorities.map(priority =>
                    React.createElement('option', { key: priority, value: priority }, 
                      priority.charAt(0).toUpperCase() + priority.slice(1)
                    )
                  )
                )
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Category'),
                React.createElement('select', {
                  value: newTask.category,
                  onChange: (e) => setNewTask({ ...newTask, category: e.target.value }),
                  className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                },
                  ...categories.map(cat =>
                    React.createElement('option', { key: cat, value: cat }, cat)
                  )
                )
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Due Date'),
              React.createElement('input', {
                type: 'date',
                value: newTask.dueDate,
                onChange: (e) => setNewTask({ ...newTask, dueDate: e.target.value }),
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Tags'),
              React.createElement('div', { className: 'flex flex-wrap gap-2 mb-2' },
                ...newTask.tags.map(tag =>
                  React.createElement('span', {
                    key: tag,
                    className: 'inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm'
                  },
                    tag,
                    React.createElement('button', {
                      onClick: () => removeTag(tag),
                      className: 'ml-1 text-blue-600 hover:text-blue-800'
                    }, '×')
                  )
                )
              ),
              React.createElement('input', {
                type: 'text',
                placeholder: 'Add tag and press Enter...',
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                onKeyPress: (e) => {
                  if (e.key === 'Enter') {
                    addTag(e.target.value);
                    e.target.value = '';
                  }
                }
              })
            )
          ),
          React.createElement('div', { className: 'flex space-x-3 mt-6' },
            React.createElement('button', {
              onClick: () => setShowAddTask(false),
              className: 'flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium'
            }, 'Cancel'),
            React.createElement('button', {
              onClick: addTask,
              className: 'flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium'
            }, 'Add Task')
          )
        )
      )
    )
  );
}

export default App;