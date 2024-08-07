import React, { useState, useEffect } from 'react';
import { PlusCircle, Loader } from 'lucide-react';
import Sidebar from './Sidebar';
import TaskList from './TaskList';
import TodayView from './TodayView';
import AddEditSegmentModal from './AddEditSegmentModal';
import DeleteSegmentModal from './DeleteSegmentModal';
import MoveTaskModal from './MoveTaskModal';
import EditTaskModal from './EditTaskModal';
import { db } from './firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore';

const TaskManager = ({ user, openSettings }) => {
  const [tasks, setTasks] = useState([]);
  const [segments, setSegments] = useState(['Personal', 'Work']);
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
    const loadTasks = async () => {
      const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const loadedTasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(loadedTasks);
    };
    loadTasks();
  }, [user.uid]);

  useEffect(() => {
    const loadSegments = async () => {
      const q = query(collection(db, 'segments'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const loadedSegments = querySnapshot.docs.map(doc => doc.data().name);
      setSegments(loadedSegments.length > 0 ? loadedSegments : ['Personal', 'Work']);
    };
    loadSegments();
  }, [user.uid]);

  useEffect(() => {
    setNewTaskSegment(activeSegment === 'All' || activeSegment === 'Today' ? 'All' : activeSegment);
  }, [activeSegment]);

  const addTask = async (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setIsAddingTask(true);
      const newTaskObj = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        createdAt: new Date().toISOString(),
        deadline: null,
        priority: newTaskPriority,
        segment: newTaskSegment,
        status: 'Todo',
        subTasks: [],
        userId: user.uid
      };
      await setDoc(doc(db, 'tasks', newTaskObj.id), newTaskObj);
      setTasks([newTaskObj, ...tasks]);
      setNewTask('');
      setNewTaskPriority('low');
      setIsAddingTask(false);
    }
  };

  const toggleTask = async (id) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    const updatedTask = { 
      ...taskToUpdate, 
      completed: !taskToUpdate.completed, 
      status: taskToUpdate.completed ? 'Todo' : 'Done' 
    };
    await setDoc(doc(db, 'tasks', id), updatedTask);
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === id ? updatedTask : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
    setTasks(tasks.filter(task => task.id !== id));
  };

  const setPriority = async (id, priority) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    const updatedTask = { ...taskToUpdate, priority };
    await setDoc(doc(db, 'tasks', id), updatedTask);
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === id ? updatedTask : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const setDeadline = async (id, deadline) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    const updatedTask = { ...taskToUpdate, deadline };
    await setDoc(doc(db, 'tasks', id), updatedTask);
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === id ? updatedTask : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const setStatus = async (id, status) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    const updatedTask = { ...taskToUpdate, status, completed: status === 'Done' };
    await setDoc(doc(db, 'tasks', id), updatedTask);
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === id ? updatedTask : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const addSegment = async (newSegmentName) => {
    if (newSegmentName && newSegmentName.trim() && !segments.includes(newSegmentName.trim())) {
      const newSegment = { name: newSegmentName.trim(), userId: user.uid };
      await setDoc(doc(db, 'segments', Date.now().toString()), newSegment);
      setSegments(prevSegments => [...prevSegments, newSegmentName.trim()]);
      setIsAddingSegment(false);
    }
  };

  const editSegment = async (oldName, newName) => {
    if (newName && newName.trim() && !segments.includes(newName.trim())) {
      const q = query(collection(db, 'segments'), where('name', '==', oldName), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        await setDoc(doc(db, 'segments', document.id), { name: newName.trim(), userId: user.uid });
      });
      
      setSegments(segments.map(seg => seg === oldName ? newName.trim() : seg));
      
      // Update tasks with the new segment name
      const tasksToUpdate = tasks.filter(task => task.segment === oldName);
      for (const task of tasksToUpdate) {
        const updatedTask = { ...task, segment: newName.trim() };
        await setDoc(doc(db, 'tasks', task.id), updatedTask);
      }
      setTasks(tasks.map(task => task.segment === oldName ? { ...task, segment: newName.trim() } : task));
      setEditingSegment(null);
    }
  };

  const deleteSegment = async (segment) => {
    const q = query(collection(db, 'segments'), where('name', '==', segment), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, 'segments', document.id));
    });
    
    setSegments(segments.filter(seg => seg !== segment));
    
    // Update tasks with the deleted segment to 'All'
    const tasksToUpdate = tasks.filter(task => task.segment === segment);
    for (const task of tasksToUpdate) {
      const updatedTask = { ...task, segment: 'All' };
      await setDoc(doc(db, 'tasks', task.id), updatedTask);
    }
    setTasks(tasks.map(task => task.segment === segment ? { ...task, segment: 'All' } : task));
    setDeletingSegment(null);
  };

  const moveTask = async (taskId, newSegment) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    const updatedTask = { ...taskToUpdate, segment: newSegment };
    await setDoc(doc(db, 'tasks', taskId), updatedTask);
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? updatedTask : task
      );
      return sortTasks(updatedTasks);
    });
    setMovingTask(null);
  };

  const addSubTask = async (taskId, subTaskText) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    const newSubTask = {
      id: Date.now().toString(),
      text: subTaskText,
      completed: false,
      deadline: null,
      priority: 'low',
      status: 'Todo'
    };
    const updatedTask = {
      ...taskToUpdate,
      subTasks: [...(taskToUpdate.subTasks || []), newSubTask]
    };
    await setDoc(doc(db, 'tasks', taskId), updatedTask);
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? updatedTask : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const toggleSubTask = async (taskId, subTaskId) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    const updatedSubTasks = taskToUpdate.subTasks.map(subTask =>
      subTask.id === subTaskId
        ? { ...subTask, completed: !subTask.completed, status: subTask.completed ? 'Todo' : 'Done' }
        : subTask
    );
    const updatedTask = { ...taskToUpdate, subTasks: updatedSubTasks };
    await setDoc(doc(db, 'tasks', taskId), updatedTask);
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? updatedTask : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const setSubTaskDeadline = async (taskId, subTaskId, deadline) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    const updatedSubTasks = taskToUpdate.subTasks.map(subTask =>
      subTask.id === subTaskId ? { ...subTask, deadline } : subTask
    );
    const updatedTask = { ...taskToUpdate, subTasks: updatedSubTasks };
    await setDoc(doc(db, 'tasks', taskId), updatedTask);
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? updatedTask : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const setSubTaskPriority = async (taskId, subTaskId, priority) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    const updatedSubTasks = taskToUpdate.subTasks.map(subTask =>
      subTask.id === subTaskId ? { ...subTask, priority } : subTask
    );
    const updatedTask = { ...taskToUpdate, subTasks: updatedSubTasks };
    await setDoc(doc(db, 'tasks', taskId), updatedTask);
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? updatedTask : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const setSubTaskStatus = async (taskId, subTaskId, status) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    const updatedSubTasks = taskToUpdate.subTasks.map(subTask =>
      subTask.id === subTaskId ? { ...subTask, status, completed: status === 'Done' } : subTask
    );
    const updatedTask = { ...taskToUpdate, subTasks: updatedSubTasks };
    await setDoc(doc(db, 'tasks', taskId), updatedTask);
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? updatedTask : task
      );
      return sortTasks(updatedTasks);
    });
  };

  const deleteSubTask = async (taskId, subTaskId) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    const updatedSubTasks = taskToUpdate.subTasks.filter(subTask => subTask.id !== subTaskId);
    const updatedTask = { ...taskToUpdate, subTasks: updatedSubTasks };
    await setDoc(doc(db, 'tasks', taskId), updatedTask);
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? updatedTask : task
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

  const saveEditedTask = async (taskId, editedTaskData) => {
    const updatedTask = { ...tasks.find(task => task.id === taskId), ...editedTaskData };
    await setDoc(doc(db, 'tasks', taskId), updatedTask);
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? updatedTask : task
      );
      return sortTasks(updatedTasks);
    });
    setEditingTask(null);
  };

  const saveEditedSubTask = async (taskId, subTaskId, editedSubTaskData) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    const updatedSubTasks = taskToUpdate.subTasks.map(subTask =>
      subTask.id === subTaskId ? { ...subTask, ...editedSubTaskData } : subTask
    );
    const updatedTask = { ...taskToUpdate, subTasks: updatedSubTasks };
    await setDoc(doc(db, 'tasks', taskId), updatedTask);
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? updatedTask : task
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
            openSettings={openSettings}
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