import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Calendar, Clock, MoreHorizontal, ChevronDown, Loader, ClipboardList, PlusCircle, ChevronRight } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const SubTaskItem = ({ subTask, onToggle, onSetDeadline, onSetPriority, onSetStatus, onDelete, onEdit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center space-x-2 ml-8 mt-2 border-l-2 border-gray-200 pl-4">
      <button
        onClick={() => onToggle(subTask.id)}
        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-300 ${
          subTask.completed
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 hover:border-green-500'
        }`}
      >
        {subTask.completed && <Check className="w-3 h-3 text-white" />}
      </button>
      <span className={`text-sm flex-grow ${subTask.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
        {subTask.text}
      </span>
      <div className="flex items-center space-x-2">
        <div className={`px-2 py-1 rounded-full text-xs ${
          subTask.status === 'Todo' ? 'bg-yellow-100 text-yellow-800' :
          subTask.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {subTask.status}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs ${
          subTask.priority === 'high' ? 'bg-red-100 text-red-800' :
          subTask.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
          'bg-green-100 text-green-800'
        }`}>
          {subTask.priority} Priority
        </div>
        {subTask.deadline && (
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
            Due: {new Date(subTask.deadline).toLocaleDateString()}
            </span>
        )}
        <div className="relative">
          <select
            value={subTask.status}
            onChange={(e) => onSetStatus(subTask.id, e.target.value)}
            className="appearance-none bg-gray-100 text-xs rounded-full px-2 py-1 pr-6 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={12} />
        </div>
      </div>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-500 hover:text-gray-700"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <div className="py-1">
              <button onClick={() => onSetPriority(subTask.id, 'low')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Set Low Priority</button>
              <button onClick={() => onSetPriority(subTask.id, 'medium')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Set Medium Priority</button>
              <button onClick={() => onSetPriority(subTask.id, 'high')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Set High Priority</button>
              <div className="px-4 py-2 text-sm text-gray-700">
                <label className="block w-full text-left cursor-pointer mb-1">Set Deadline</label>
                <DatePicker
                  selected={subTask.deadline ? new Date(subTask.deadline) : null}
                  onChange={(date) => onSetDeadline(subTask.id, date.toISOString())}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>
              <button onClick={() => onEdit(subTask.id)} className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full text-left">Edit Sub-task</button>
              <button onClick={() => onDelete(subTask.id)} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">Delete Sub-task</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TaskItem = ({ task, toggleTask, deleteTask, setPriority, setDeadline, setStatus, setMovingTask, addSubTask, toggleSubTask, setSubTaskDeadline, setSubTaskPriority, setSubTaskStatus, deleteSubTask, editTask, editSubTask }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newSubTask, setNewSubTask] = useState('');
  const [showSubTasks, setShowSubTasks] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = async () => {
    setIsUpdating(true);
    await toggleTask(task.id);
    setIsUpdating(false);
  };

  const handleSetPriority = async (priority) => {
    setIsUpdating(true);
    await setPriority(task.id, priority);
    setIsUpdating(false);
    setIsMenuOpen(false);
  };

  const handleSetDeadline = async (date) => {
    setIsUpdating(true);
    await setDeadline(task.id, date.toISOString());
    setIsUpdating(false);
    setIsMenuOpen(false);
  };

  const handleSetStatus = async (status) => {
    setIsUpdating(true);
    await setStatus(task.id, status);
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    await deleteTask(task.id);
    setIsUpdating(false);
  };

  const handleAddSubTask = (e) => {
    e.preventDefault();
    if (newSubTask.trim()) {
      addSubTask(task.id, newSubTask.trim());
      setNewSubTask('');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-sm p-4 mb-3 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-grow">
          <button
            onClick={handleToggle}
            disabled={isUpdating}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
              task.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {isUpdating ? (
              <Loader className="w-4 h-4 text-white animate-spin" />
            ) : (
              task.completed && <Check className="w-4 h-4 text-white" />
            )}
          </button>
          <span className={`text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.text}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={task.status}
              onChange={(e) => handleSetStatus(e.target.value)}
              disabled={isUpdating}
              className="appearance-none bg-gray-100 text-sm rounded-full px-4 py-2 pr-8 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>
          <div className="relative" ref={menuRef}>
            <button 
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              disabled={isUpdating}
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-md z-10 border border-gray-200">
                <div className="py-1">
                  <button onClick={() => handleSetPriority('low')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Set Low Priority</button>
                  <button onClick={() => handleSetPriority('medium')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Set Medium Priority</button>
                  <button onClick={() => handleSetPriority('high')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Set High Priority</button>
                  <div className="px-4 py-2 text-sm text-gray-700">
                    <label className="block w-full text-left cursor-pointer mb-1">Set Deadline</label>
                    <DatePicker
                      selected={task.deadline ? new Date(task.deadline) : null}
                      onChange={handleSetDeadline}
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                  </div>
                  <button onClick={() => setMovingTask(task.id)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Move to Segment</button>
                  <button onClick={() => editTask(task.id)} className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full text-left">Edit Task</button>
                  <button onClick={handleDelete} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">Delete Task</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
        <Calendar className="w-4 h-4" />
        <span>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</span>
        <div className={`px-2 py-1 rounded-full text-xs ${
          task.status === 'Todo' ? 'bg-yellow-100 text-yellow-800' :
          task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {task.status}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs ${
          task.priority === 'high' ? 'bg-red-100 text-red-800' :
          task.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
          'bg-green-100 text-green-800'
        }`}>
          {task.priority} Priority
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={() => setShowSubTasks(!showSubTasks)}
          className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
        >
          <ChevronRight className={`w-4 h-4 mr-1 transform transition-transform ${showSubTasks ? 'rotate-90' : ''}`} />
          {task.subTasks && task.subTasks.length > 0 ? `${showSubTasks ? 'Hide' : 'Show'} Sub-tasks (${task.subTasks.length})` : 'Add Sub-task'}
        </button>
        {showSubTasks && (
          <>
            {task.subTasks && task.subTasks.map(subTask => (
              <SubTaskItem
                key={subTask.id}
                subTask={subTask}
                onToggle={(subTaskId) => toggleSubTask(task.id, subTaskId)}
                onSetDeadline={(subTaskId, deadline) => setSubTaskDeadline(task.id, subTaskId, deadline)}
                onSetPriority={(subTaskId, priority) => setSubTaskPriority(task.id, subTaskId, priority)}
                onSetStatus={(subTaskId, status) => setSubTaskStatus(task.id, subTaskId, status)}
                onDelete={(subTaskId) => deleteSubTask(task.id, subTaskId)}
                onEdit={(subTaskId) => editSubTask(task.id, subTaskId)}
              />
            ))}
            <form onSubmit={handleAddSubTask} className="mt-2 flex items-center">
              <input
                type="text"
                value={newSubTask}
                onChange={(e) => setNewSubTask(e.target.value)}
                placeholder="Add a sub-task"
                className="flex-grow bg-gray-100 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 transition-colors duration-300"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
};

const TaskList = ({ tasks, toggleTask, deleteTask, setPriority, setDeadline, setStatus, setMovingTask, addSubTask, toggleSubTask, setSubTaskDeadline, setSubTaskPriority, setSubTaskStatus, deleteSubTask, editTask, editSubTask }) => {
  return (
    <div className="space-y-4 overflow-y-auto flex-grow">
      <AnimatePresence>
        {tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500 italic flex flex-col items-center justify-center h-full"
          >
            <ClipboardList className="w-16 h-16 mb-4 text-gray-400" />
            <p className="text-xl font-semibold mb-2">No tasks in this segment yet</p>
            <p>Add a new task to get started!</p>
          </motion.div>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
              setPriority={setPriority}
              setDeadline={setDeadline}
              setStatus={setStatus}
              setMovingTask={setMovingTask}
              addSubTask={addSubTask}
              toggleSubTask={toggleSubTask}
              setSubTaskDeadline={setSubTaskDeadline}
              setSubTaskPriority={setSubTaskPriority}
              setSubTaskStatus={setSubTaskStatus}
              deleteSubTask={deleteSubTask}
              editTask={editTask}
              editSubTask={editSubTask}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;