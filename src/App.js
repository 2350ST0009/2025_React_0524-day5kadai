import React, { useState } from "react";
import "./index.css";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [sortByDate, setSortByDate] = useState(false);
  const [sortByCompletion, setSortByCompletion] = useState(false);

  const addTask = () => {
    if (newTask.trim() !== "" && taskDate !== "") {
      setTasks([
        ...tasks,
        { 
          id: Date.now(),
          text: newTask,
          date: taskDate,
          completed: false,
          subtasks: [],
        },
      ]);
      setNewTask("");
      setTaskDate("");
    }
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const addSubtask = (parentId, subtaskText) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === parentId
          ? {
              ...task,
              subtasks: [
                ...task.subtasks,
                {
                  id: Date.now(),
                  text: subtaskText,
                  completed: false,
                },
              ],
            }
          : task
      )
    );
  };

  const toggleSubtask = (parentId, subtaskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === parentId) {
          const updatedSubtasks = task.subtasks.map((subtask) =>
            subtask.id === subtaskId
              ? { ...subtask, completed: !subtask.completed }
              : subtask
          );

          const allCompleted = updatedSubtasks.every(
            (subtask) => subtask.completed
          );

          return {
            ...task,
            completed: allCompleted,
            subtasks: updatedSubtasks,
          };
        }
        return task;
      })
    );
  };

  const toggleSortByDate = () => {
    setSortByDate(!sortByDate);
  };

  const toggleSortByCompletion = () => {
    setSortByCompletion(!sortByCompletion);
  };

  const sortedTasks = [...tasks]
    .sort((a, b) =>
      sortByCompletion
        ? a.completed === b.completed
          ? 0
          : a.completed
          ? 1
          : -1
        : 0
    )
    .sort((a, b) =>
      sortByDate
        ? new Date(a.date) - new Date(b.date)
        : 0
    );

  return (
    <div className="app-container">
      <div className="todo-wrapper">
        <h1 className="todo-title">Todoアプリ</h1>
        <div className="todo-input-container">
          <input
            type="text"
            className="todo-input"
            placeholder="新しいタスクを追加"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <input
            type="date"
            className="todo-date-input"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
          />
          <button className="todo-add-button" onClick={addTask}>
            追加
          </button>
        </div>
        <div className="sort-buttons">
          <button
            className="todo-sort-button"
            onClick={toggleSortByDate}
          >
            並べ替え: {sortByDate ? "日付順" : "順序なし"}
          </button>
          <button
            className="todo-sort-button"
            onClick={toggleSortByCompletion}
          >
            並べ替え: {sortByCompletion ? "完了状態" : "順序なし"}
          </button>
        </div>
        <ul className="todo-list">
          {sortedTasks.map((task) => (
            <li
              key={task.id}
              className={`todo-item ${task.completed ? "completed" : ""}`}
            >
              <span
                className="todo-text"
                onClick={() => toggleTask(task.id)}
              >
                {task.text}
              </span>
              <span className="todo-date">{task.date}</span>
              <button
                className="todo-delete-button"
                onClick={() => deleteTask(task.id)}
              >
                削除
              </button>
              <div className="subtask-container">
                <input
                  type="text"
                  className="subtask-input"
                  placeholder="サブタスクを追加"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim() !== "") {
                      addSubtask(task.id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
                <ul className="subtask-list">
                  {task.subtasks.map((subtask) => (
                    <li
                      key={subtask.id}
                      className={`subtask-item ${
                        subtask.completed ? "completed" : ""
                      }`}
                    >
                      <span
                        className="subtask-text"
                        onClick={() =>
                          toggleSubtask(task.id, subtask.id)
                        }
                      >
                        {subtask.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;
