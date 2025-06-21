import React, { useState, useEffect } from "react";
import "./index.css";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [sortByDate, setSortByDate] = useState(false);
  const [sortByCompletion, setSortByCompletion] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [expandedTaskIds, setExpandedTaskIds] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });
  const [savedData, setSavedData] = useState([]);
  const maxLengths = {
    name: 20,
    email: 30,
    comment: 100,
  };

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setTasks(savedTasks);
    }
    const savedFormData = JSON.parse(localStorage.getItem("formData"));
    if (savedFormData) {
      setSavedData(savedFormData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(savedData));
  }, [savedData]);

  const handleInputChange = (field, value) => {
    if (value.length > maxLengths[field]) return; // 上限チェック
    setFormData({ ...formData, [field]: value });
  };

  const saveFormData = () => {
    const newEntry = {
      ...formData,
      name: formData.name || "未入力です",
      email: formData.email || "未入力です",
      comment: formData.comment || "未入力です",
    };
    setSavedData([...savedData, newEntry]);
    setFormData({ name: "", email: "", comment: "" }); // リセット
  };

  const addTask = () => {
    if (newTask.trim() === "") {
      alert("タスク名を入力してください。");
      return;
    }
    if (taskDate === "" || new Date(taskDate) < new Date()) {
      alert("正しい日付を入力してください。");
      return;
    }
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
              { id: Date.now(), text: subtaskText, completed: false },
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


  const toggleExpandTask = (id) => {
    setExpandedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  };

  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedTasks = [...filteredTasks]
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

        {/* フォーム部分 */}
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


        {/* リアルタイム表示 */}
        <div className="real-time-display">
          <p>入力中のタスク: {newTask || "なし"}</p>
        </div>

        {/* 並べ替えと検索 */}
        <div className="sort-buttons">
          <button
            className="todo-sort-button"
            onClick={() => setSortByDate(!sortByDate)}
          >
            並べ替え: {sortByDate ? "日付順" : "順序なし"}
          </button>
          <button
            className="todo-sort-button"
            onClick={() => setSortByCompletion(!sortByCompletion)}
          >
            並べ替え: {sortByCompletion ? "完了状態" : "順序なし"}
          </button>
        </div>
        <input
          type="text"
          className="todo-search-input"
          placeholder="タスクを検索"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* タスク一覧 */}
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
              <button
                className="expand-button"
                onClick={() => toggleExpandTask(task.id)}
              >
                {expandedTaskIds.includes(task.id) ? "縮小" : "展開"}
              </button>

              <div
                className={`subtask-container ${expandedTaskIds.includes(task.id) ? "expanded" : "collapsed"
                  }`}
              >
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
                      className={`subtask-item ${subtask.completed ? "completed" : ""
                        }`}
                    >
                      <span
                        className="subtask-text"
                        onClick={() => toggleSubtask(task.id, subtask.id)}
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

        {/* 名前・メール・コメント入力フォーム */}
        <div className="form-section">
          <h2>データ入力</h2>
          <div className="form-input-container">
            <input
              type="text"
              placeholder="名前"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            <div>文字数: {formData.name.length}/{maxLengths.name}</div>
          </div>
          <div className="form-input-container">
            <input
              type="email"
              placeholder="メール"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <div>文字数: {formData.email.length}/{maxLengths.email}</div>
          </div>
          <div className="form-input-container">
            <textarea
              placeholder="コメント"
              value={formData.comment}
              onChange={(e) => handleInputChange("comment", e.target.value)}
            />
            <div>文字数: {formData.comment.length}/{maxLengths.comment}</div>
          </div>
          <button className="todo-add-button" onClick={saveFormData}>
            保存
          </button>
        </div>

        {/* 保存済みデータ一覧 */}
        <div className="saved-data-section">
          <h2>保存したデータ</h2>
          {savedData.length === 0 ? (
            <p>保存されたデータがありません。</p>
          ) : (
            <ul className="saved-data-list">
              {savedData.map((data, index) => (
                <li key={index} className="saved-data-item">
                  <p>名前: {data.name}</p>
                  <p>メール: {data.email}</p>
                  <p>コメント: {data.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
