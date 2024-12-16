import React, { useState, useEffect } from 'react';
import data from "./data.json"

function TodoApp() {
    // State for tasks and input
    console.log(data,"data")
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(data));
      }, []);

    const [tasks, setTasks] = useState([]
     );
    const [input, setInput] = useState('');
    const [editingId, setEditingId] = useState(null);

    // Load data.json and set it into localStorage
    useEffect(() => {
      let storedTasks = localStorage.getItem("tasks");
  
      if (!storedTasks) {
         // Fetch data.json and set it into localStorage
         fetch("/data.json")
         .then((response) => response.json())
         .then((data) => {
           setTasks(data);
           localStorage.setItem("tasks", JSON.stringify(data));
         })
         .catch((error) => console.error("Error loading data.json:", error));
       
      } else {
        storedTasks = localStorage.getItem("tasks");
  
         // Use localStorage data if available
         setTasks(JSON.parse(storedTasks));
      }
    }, []);
  
  
    // Sync tasks to localStorage whenever tasks change
    useEffect(() => {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);
  console.log("tasks", tasks)
    // Add new task
    const addTask = () => {
      if (input.trim()) {
        setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
        setInput('');
      }
    };
  
    // Edit task
    const saveEditTask = () => {
      setTasks(
        tasks.map((task) =>
          task.id === editingId ? { ...task, text: input } : task
        )
      );
      setEditingId(null);
      setInput('');
    };
  
    // Start editing a task
    const editTask = (id, currentText) => {
      setEditingId(id);
      setInput(currentText);
    };
  
    // Delete task
    const deleteTask = (id) => {
      setTasks(tasks.filter((task) => task.id !== id));
    };
  
    // Toggle task completion
    const toggleTask = (id) => {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    };
  
    return (
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h1>To-Do List</h1>
        <div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add or edit a task"
          />
          {editingId ? (
            <button onClick={saveEditTask}>Save Edit</button>
          ) : (
            <button onClick={addTask}>Add Task</button>
          )}
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li key={task.id} style={{ margin: '10px 0' }}>
              <span
                style={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  marginRight: '10px',
                }}
              >
                {task.name || task.text}
              </span>
              <button onClick={() => toggleTask(task.id)}>
                {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button onClick={() => editTask(task.id, task.text)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default TodoApp;