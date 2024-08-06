import React, { useState, useRef, useEffect } from 'react';
import { Sun, CheckCircle, XCircle, Clock, ChevronRight, MoreHorizontal, Calendar, ChevronDown } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const TodayView = ({ 
  allTasks,
  toggleTask,
  deleteTask,
  setPriority,
  setDeadline,
  setStatus,
  toggleSubTask,
  setSubTaskDeadline,
  setSubTaskPriority,
  setSubTaskStatus,
  deleteSubTask
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayItems = allTasks.flatMap(task => {
    const taskDueToday = task.deadline && new Date(task.deadline) >= today && new Date(task.deadline) < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const todaySubTasks = (task.subTasks || []).filter(subTask => 
      subTask.deadline && new Date(subTask.deadline) >= today && new Date(subTask.deadline) < new Date(today.getTime() + 24 * 60 * 60 * 1000)
    );

    const result = [];
    if (taskDueToday) {
      result.push({ ...task, isMainTask: true });
    }
    result.push(...todaySubTasks.map(subTask => ({
      ...subTask,
      parentTask: task,
      isMainTask: false
    })));

    return result;
  });

  const completedItems = todayItems.filter(item => item.completed).length;
  const incompleteItems = todayItems.filter(item => !item.completed).length;

  const TaskItem = ({ item }) => {
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

    const handleToggle = () => {
      if (item.isMainTask) {
        toggleTask(item.id);
      } else {
        toggleSubTask(item.parentTask.id, item.id);
      }
    };

    const handleSetDeadline = (date) => {
      if (item.isMainTask) {
        setDeadline(item.id, date.toISOString());
      } else {
        setSubTaskDeadline(item.parentTask.id, item.id, date.toISOString());
      }
    };

    const handleSetPriority = (priority) => {
      if (item.isMainTask) {
        setPriority(item.id, priority);
      } else {
        setSubTaskPriority(item.parentTask.id, item.id, priority);
      }
    };

    const handleSetStatus = (status) => {
      if (item.isMainTask) {
        setStatus(item.id, status);
      } else {
        setSubTaskStatus(item.parentTask.id, item.id, status);
      }
    };

    const handleDelete = () => {
      if (item.isMainTask) {
        deleteTask(item.id);
      } else {
        deleteSubTask(item.parentTask.id, item.id);
      }
    };

    return (
      <li className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-grow">
            <button
              onClick={handleToggle}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                item.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 hover:border-green-500'
              }`}
            >
              {item.completed && <CheckCircle className="w-4 h-4 text-white" />}
            </button>
            <div>
              <span className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {item.text}
              </span>
              {!item.isMainTask && (
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <ChevronRight className="w-4 h-4 mr-1" />
                  Sub-task of: <span className="font-medium ml-1">{item.parentTask.text}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                value={item.status}
                onChange={(e) => handleSetStatus(e.target.value)}
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
                        selected={item.deadline ? new Date(item.deadline) : null}
                        onChange={handleSetDeadline}
                        dateFormat="dd/MM/yyyy"
                        className="w-full px-2 py-1 text-sm border rounded"
                      />
                    </div>
                    <button onClick={handleDelete} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">Delete</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{item.deadline ? new Date(item.deadline).toLocaleDateString() : 'No deadline'}</span>
          <div className={`px-2 py-1 rounded-full text-xs ${
            item.status === 'Todo' ? 'bg-yellow-100 text-yellow-800' :
            item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {item.status}
          </div>
          <div className={`px-2 py-1 rounded-full text-xs ${
            item.priority === 'high' ? 'bg-red-100 text-red-800' :
            item.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {item.priority} Priority
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-600">
        <Sun className="mr-2 text-yellow-500" />
        Today's Tasks
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-gray-600">
        <SummaryCard
          title="Total Tasks"
          value={todayItems.length}
          icon={<Clock className="w-8 h-8 text-blue-400" />}
        />
        <SummaryCard
          title="Completed"
          value={completedItems}
          icon={<CheckCircle className="w-8 h-8 text-green-400" />}
        />
        <SummaryCard
          title="Incomplete"
          value={incompleteItems}
          icon={<XCircle className="w-8 h-8 text-red-400" />}
        />
      </div>

      <div className="flex-grow overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Tasks for Today</h3>
        {todayItems.length === 0 ? (
          <p className="text-gray-500 italic">No tasks scheduled for today.</p>
        ) : (
          <ul className="space-y-4">
            {todayItems.map(item => (
              <TaskItem key={`${item.isMainTask ? 'task' : 'subtask'}-${item.id}`} item={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      {icon}
    </div>
  );
};

export default TodayView;