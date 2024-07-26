import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, CheckCircle, Plus, X, Calendar, ChevronLeft, ChevronRight, Edit2, Link, Loader } from 'lucide-react';
import SegmentManagement from './SegmentManagement';

const TaskManager = () => {
  const [segments, setSegments] = useState(() => {
    const savedSegments = localStorage.getItem('segments');
    return savedSegments ? JSON.parse(savedSegments) : ['Personal', 'Work'];
  });
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : {};
  });
  const [newTask, setNewTask] = useState('');
  const [newSegment, setNewSegment] = useState('');
  const [activeSegment, setActiveSegment] = useState('Personal');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [taskLink, setTaskLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingSegment, setIsAddingSegment] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulating initial load time

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('segments', JSON.stringify(segments));
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [segments, tasks]);

  const addTask = async () => {
    if (newTask.trim()) {
      setIsAddingTask(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulating network delay
      const now = new Date();
      setTasks(prevTasks => ({
        ...prevTasks,
        [activeSegment]: [
          ...(prevTasks[activeSegment] || []),
          { 
            id: Date.now(), 
            text: newTask, 
            completed: false, 
            createdAt: now.toISOString(),
            deadline: taskDeadline || null,
            link: taskLink || null
          }
        ]
      }));
      setNewTask('');
      setTaskDeadline('');
      setTaskLink('');
      setIsAddingTask(false);
    }
  };

  const toggleTask = (id) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [activeSegment]: prevTasks[activeSegment].map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const deleteTask = (id) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [activeSegment]: prevTasks[activeSegment].filter(task => task.id !== id)
    }));
  };

  const editTask = (id) => {
    const taskToEdit = tasks[activeSegment].find(task => task.id === id);
    setEditingTask(taskToEdit);
    setNewTask(taskToEdit.text);
    setTaskDeadline(taskToEdit.deadline || '');
    setTaskLink(taskToEdit.link || '');
  };

  const updateTask = async () => {
    if (editingTask && newTask.trim()) {
      setIsAddingTask(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulating network delay
      setTasks(prevTasks => ({
        ...prevTasks,
        [activeSegment]: prevTasks[activeSegment].map(task =>
          task.id === editingTask.id
            ? { ...task, text: newTask, deadline: taskDeadline || null, link: taskLink || null }
            : task
        )
      }));
      setEditingTask(null);
      setNewTask('');
      setTaskDeadline('');
      setTaskLink('');
      setIsAddingTask(false);
    }
  };

  const addSegment = async () => {
    if (newSegment.trim() && !segments.includes(newSegment)) {
      setIsAddingSegment(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulating network delay
      setSegments([...segments, newSegment]);
      setNewSegment('');
      setIsAddingSegment(false);
    }
  };

  const deleteSegment = (segment) => {
    setSegments(segments.filter(s => s !== segment));
    setTasks(prevTasks => {
      const { [segment]: _, ...rest } = prevTasks;
      return rest;
    });
    if (activeSegment === segment) {
      setActiveSegment(segments[0]);
    }
  };

  const moveSegment = (index, direction) => {
    const newSegments = [...segments];
    const newIndex = index + direction;
    [newSegments[index], newSegments[newIndex]] = [newSegments[newIndex], newSegments[index]];
    setSegments(newSegments);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const groupTasksByDate = (tasks) => {
    const grouped = tasks.reduce((acc, task) => {
      const date = new Date(task.createdAt).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(task);
      return acc;
    }, {});
    return Object.entries(grouped).sort(([a], [b]) => new Date(b) - new Date(a));
  };

  const totalTasks = Object.values(tasks).flat().length;
  const completedTasks = Object.values(tasks).flat().filter(task => task.completed).length;
  const openTasks = totalTasks - completedTasks;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center">
        <Loader className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex flex-col items-center justify-between p-4 sm:p-6 font-sans">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-xl p-4 sm:p-8 w-full max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8 text-center font-serif">Get Shit Done 🤝</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white bg-opacity-20 rounded-xl p-4 text-white text-center">
            <h3 className="font-bold">Segments</h3>
            <p className="text-xl sm:text-2xl">{segments.length}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4 text-white text-center">
            <h3 className="font-bold">Open Tasks</h3>
            <p className="text-xl sm:text-2xl">{openTasks}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4 text-white text-center">
            <h3 className="font-bold">Completed Tasks</h3>
            <p className="text-xl sm:text-2xl">{completedTasks}</p>
          </div>
        </div>

        {/* Segment management */}
        <SegmentManagement
          segments={segments}
          activeSegment={activeSegment}
          setActiveSegment={setActiveSegment}
          moveSegment={moveSegment}
          deleteSegment={deleteSegment}
          addSegment={addSegment}
          isAddingSegment={isAddingSegment}
          newSegment={newSegment}
          setNewSegment={setNewSegment}
          handleKeyPress={handleKeyPress}
        />

        {/* Add Task Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 mt-6">Add Task</h2>

        {/* Task input */}
        <div className="mb-6 bg-white bg-opacity-20 rounded-2xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, editingTask ? updateTask : addTask)}
            placeholder="Add a new task..."
            className="flex-grow px-4 py-2 mb-2 sm:mb-0 bg-transparent text-white placeholder-gray-300 focus:outline-none"
          />
          <input
            type="url"
            value={taskLink}
            onChange={(e) => setTaskLink(e.target.value)}
            placeholder="Add a link (optional)"
            className="px-4 py-2 mb-2 sm:mb-0 bg-transparent text-white placeholder-gray-300 focus:outline-none"
          />
          <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2 mb-2 sm:mb-0 sm:mr-2">
            <Calendar className="text-white mr-2 w-5 h-5" />
            <input
              type="date"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
              className="bg-transparent text-white focus:outline-none"
              style={{ colorScheme: 'dark' }}
            />
          </div>
          <button
            onClick={editingTask ? updateTask : addTask}
            disabled={isAddingTask}
            className="w-full sm:w-auto bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors p-2 rounded-full flex items-center justify-center"
          >
            {isAddingTask ? (
              <Loader className="text-white w-6 h-6 animate-spin" />
            ) : editingTask ? (
              <Edit2 className="text-white w-6 h-6" />
            ) : (
              <PlusCircle className="text-white w-6 h-6" />
            )}
          </button>
        </div>

        {/* Task list */}
        <div className="space-y-6">
          {groupTasksByDate(tasks[activeSegment] || []).map(([date, dateTasks]) => (
            <div key={date}>
              <h3 className="text-white font-semibold mb-2">{new Date(date).toLocaleDateString()}</h3>
              <ul className="space-y-2">
                {dateTasks.map(task => (
                  <li key={task.id} className="flex flex-wrap items-center bg-white bg-opacity-10 rounded-xl px-4 py-2 transition-all duration-300 hover:bg-opacity-20">
                    <button onClick={() => toggleTask(task.id)} className="mr-3 transition-transform duration-300 hover:scale-110">
                      <CheckCircle className={`${task.completed ? 'text-green-400' : 'text-white'}`} />
                    </button>
                    <span className={`flex-grow text-white ${task.completed ? 'line-through' : ''} mb-2 sm:mb-0`}>
                      {task.text}
                    </span>
                    <div className="w-full sm:w-auto flex flex-wrap items-center justify-end space-x-2 mt-2 sm:mt-0">
                      {task.deadline && (
                        <span className="text-xs text-gray-300">
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      )}
                      {task.link && (
                        <a
                          href={task.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded-full hover:bg-opacity-30 transition-colors"
                        >
                          <Link className="w-3 h-3 inline mr-1" />
                          Link
                        </a>
                      )}
                      <button onClick={() => editTask(task.id)} className="transition-transform duration-300 hover:scale-110">
                        <Edit2 className="text-white w-4 h-4" />
                      </button>
                      <button onClick={() => deleteTask(task.id)} className="transition-transform duration-300 hover:scale-110">
                        <Trash2 className="text-pink-300 hover:text-pink-100 transition-colors w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <footer className="text-sm mt-8 text-white text-center font-sans font-light">
        Made with 🤍 (and Laziness).
      </footer>
    </div>
  );
};

export default TaskManager;