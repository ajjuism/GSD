import React, { useState, useEffect } from 'react';
import { PlusCircle, Loader } from 'lucide-react';
import Sidebar from './Sidebar';
import TaskList from './TaskList';
import TodayView from './TodayView';
import AddEditSegmentModal from './AddEditSegmentModal';
import DeleteSegmentModal from './DeleteSegmentModal';
import MoveTaskModal from './MoveTaskModal';
import EditTaskModal from './EditTaskModal';

const TaskManager = () => {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
      return Array.isArray(parsedTasks) ? parsedTasks : [];
    } catch (error) {
      console.error('Error parsing tasks from localStorage:', error);
      return [];
    }
  });

  const [segments, setSegments] = useState(() => {
    try {
      const savedSegments = localStorage.getItem('segments');
      const parsedSegments = savedSegments ? JSON.parse(savedSegments) : ['Personal', 'Work'];
      return Array.isArray(parsedSegments) 
        ? parsedSegments.map(seg => typeof seg === 'string' ? seg : (seg.name || 'Unnamed Segment'))
        : ['Personal', 'Work'];
    } catch (error) {
      console.error('Error parsing segments from localStorage:', error);
      return ['Personal', 'Work'];
    }
  });

  const [activeSegment, setActiveSegment] = useState('All');
  const [newTask, setNewTask] = useState('');
  const [newTaskSegment, setNewTaskSegment] = useState('All');
  const [newTaskPriority, setNewTaskPriority] = useState('low');
  const [editingSegment, setEditingSegment] = useState(null);
  const [deletingSegment, setDeletingSegment] = useState(null);
  const [movingTask, setMovingTask] = useState(null);
  const [isAddingSegment, setIsAddingSegment] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingSubTask, setEditingSubTask] = useState({ taskId: null, subTaskId: null });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('segments', JSON.stringify(segments));
  }, [tasks, segments]);

  useEffect(() => {
    setNewTaskSegment(activeSegment === 'All' || activeSegment === 'Today' ? 'All' : activeSegment);
  }, [activeSegment]);

  const addTask = async (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setIsAddingTask(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newTaskObj = {
        id: Date.now(),
        text: newTask,
        completed: false,
        createdAt: new Date().toISOString(),
        deadline: null,
        priority: newTaskPriority,
        segment: newTaskSegment,
        status: 'Todo',
        subTasks: []
      };
      setTasks([newTaskObj, ...tasks]);
      setNewTask('');
      setNewTaskPriority('low');
      setIsAddingTask(false);
    }
  };

  const toggleTask = (id) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed, status: task.completed ? 'Todo' : 'Done' } : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const setPriority = (id, priority) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === id ? { ...task, priority } : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const setDeadline = (id, deadline) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === id ? { ...task, deadline } : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const setStatus = (id, status) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === id ? { ...task, status, completed: status === 'Done' } : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const addSegment = (newSegmentName) => {
    if (newSegmentName && newSegmentName.trim() && !segments.includes(newSegmentName.trim())) {
      setSegments(prevSegments => [...prevSegments, newSegmentName.trim()]);
      setIsAddingSegment(false);
    }
  };

  const editSegment = (oldName, newName) => {
    if (newName && newName.trim() && !segments.includes(newName.trim())) {
      setSegments(segments.map(seg => seg === oldName ? newName.trim() : seg));
      setTasks(tasks.map(task => task.segment === oldName ? { ...task, segment: newName.trim() } : task));
      setEditingSegment(null);
    }
  };

  const deleteSegment = (segment) => {
    setSegments(segments.filter(seg => seg !== segment));
    setTasks(tasks.map(task => task.segment === segment ? { ...task, segment: 'All' } : task));
    setDeletingSegment(null);
  };

  const moveTask = (taskId, newSegment) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? { ...task, segment: newSegment } : task
      );
      return sortTasks(updatedTasks);
    });
    setMovingTask(null);
  };

  const addSubTask = (taskId, subTaskText) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? {
          ...task,
          subTasks: [...(task.subTasks || []), {
            id: Date.now(),
            text: subTaskText,
            completed: false,
            deadline: null,
            priority: 'low',
            status: 'Todo'
          }]
        } : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const toggleSubTask = (taskId, subTaskId) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? {
          ...task,
          subTasks: (task.subTasks || []).map(subTask =>
            subTask.id === subTaskId ? { ...subTask, completed: !subTask.completed, status: subTask.completed ? 'Todo' : 'Done' } : subTask
          )
        } : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const setSubTaskDeadline = (taskId, subTaskId, deadline) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? {
          ...task,
          subTasks: (task.subTasks || []).map(subTask =>
            subTask.id === subTaskId ? { ...subTask, deadline } : subTask
          )
        } : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const setSubTaskPriority = (taskId, subTaskId, priority) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? {
          ...task,
          subTasks: (task.subTasks || []).map(subTask =>
            subTask.id === subTaskId ? { ...subTask, priority } : subTask
          )
        } : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const setSubTaskStatus = (taskId, subTaskId, status) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? {
          ...task,
          subTasks: (task.subTasks || []).map(subTask =>
            subTask.id === subTaskId ? { ...subTask, status, completed: status === 'Done' } : subTask
          )
        } : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const deleteSubTask = (taskId, subTaskId) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? {
          ...task,
          subTasks: (task.subTasks || []).filter(subTask => subTask.id !== subTaskId)
        } : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const editTask = (taskId) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    setEditingTask(taskToEdit);
  };

  const editSubTask = (taskId, subTaskId) => {
    const task = tasks.find(task => task.id === taskId);
    const subTaskToEdit = task.subTasks.find(subTask => subTask.id === subTaskId);
    setEditingSubTask({ taskId, subTaskId, ...subTaskToEdit });
  };

  const saveEditedTask = (taskId, editedTaskData) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? { ...task, ...editedTaskData } : task
      );
      return sortTasks(updatedTasks);
    });
    setEditingTask(null);
  };

  const saveEditedSubTask = (taskId, subTaskId, editedSubTaskData) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? {
          ...task,
          subTasks: task.subTasks.map(subTask =>
            subTask.id === subTaskId ? { ...subTask, ...editedSubTaskData } : subTask
          )
        } : task
      );
      return sortTasks(updatedTasks);
    });
    setEditingSubTask({ taskId: null, subTaskId: null });
  };

  const sortTasks = (tasksToSort) => {
    return tasksToSort.sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return 0;
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (activeSegment === 'All') return true;
    if (activeSegment === 'Today') {
      const today = new Date().toISOString().split('T')[0];
      return (
        task.deadline?.split('T')[0] === today ||
        (task.subTasks && task.subTasks.some(subTask => subTask.deadline?.split('T')[0] === today))
      );
    }
    return task.segment === activeSegment;
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-2rem)]">
        <div className="flex h-full">
          <Sidebar
            segments={segments}
            activeSegment={activeSegment}
            setActiveSegment={setActiveSegment}
            setEditingSegment={setEditingSegment}
            setDeletingSegment={setDeletingSegment}
            setIsAddingSegment={setIsAddingSegment}
          />
          <div className="w-3/4 p-8 flex flex-col h-full">
            {activeSegment === 'Today' ? (
              <TodayView
                allTasks={tasks}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
                setPriority={setPriority}
                setDeadline={setDeadline}
                setStatus={setStatus}
                toggleSubTask={toggleSubTask}
                setSubTaskDeadline={setSubTaskDeadline}
                setSubTaskPriority={setSubTaskPriority}
                setSubTaskStatus={setSubTaskStatus}
                deleteSubTask={deleteSubTask}
                editTask={editTask}
                editSubTask={editSubTask}
              />
            ) : (
              <>
                <form onSubmit={addTask} className="mb-8">
                  <div className="flex items-center bg-gray-100 rounded-lg p-3 shadow-sm">
                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder="What do you need to accomplish?"
                      className="flex-grow bg-transparent focus:outline-none text-gray-800 placeholder-gray-500 text-lg"
                    />
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value)}
                      className="mx-2 bg-white text-gray-500 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <select
                      value={newTaskSegment}
                      onChange={(e) => setNewTaskSegment(e.target.value)}
                      className="mx-2 bg-white text-gray-500 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="All">All</option>
                      {segments.map(segment => (
                        <option key={segment} value={segment}>{segment}</option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={isAddingTask}
                      className="ml-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      {isAddingTask ? (
                        <Loader className="w-6 h-6 animate-spin" />
                      ) : (
                        <PlusCircle className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </form>

                <TaskList
                  tasks={filteredTasks}
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
              </>
            )}
          </div>
        </div>
      </div>

      {(editingSegment || isAddingSegment) && (
        <AddEditSegmentModal
          segment={editingSegment}
          onSave={(oldName, newName) => {
            if (editingSegment) {
              editSegment(oldName, newName);
            } else {
              addSegment(newName);
            }
          }}
          onClose={() => {
            setEditingSegment(null);
            setIsAddingSegment(false);
          }}
        />
      )}

      {deletingSegment && (
        <DeleteSegmentModal
          segment={deletingSegment}
          onDelete={deleteSegment}
          onClose={() => setDeletingSegment(null)}
        />
      )}

      {movingTask && (
        <MoveTaskModal
          segments={segments}
          onMove={moveTask}
          onClose={() => setMovingTask(null)}
          taskId={movingTask}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={saveEditedTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {editingSubTask.taskId && (
        <EditTaskModal
          task={editingSubTask}
          onSave={(_, editedData) => saveEditedSubTask(editingSubTask.taskId, editingSubTask.subTaskId, editedData)}
          onClose={() => setEditingSubTask({ taskId: null, subTaskId: null })}
        />
      )}
    </div>
  );
};

export default TaskManager;