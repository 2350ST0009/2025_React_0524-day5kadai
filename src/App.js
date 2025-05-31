import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Checkbox,
  FormControlLabel,
  Box,
  IconButton,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [sortByDate, setSortByDate] = useState(false);
  const [sortByCompletion, setSortByCompletion] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const addTask = () => {
    if (newTask.trim() !== "" && taskDate !== "") {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          date: taskDate,
          completed: false,
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
      sortByDate ? new Date(a.date) - new Date(b.date) : 0
    );

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          color: "text.primary",
          padding: 4,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
        <Typography variant="h4" align="center" gutterBottom>
          Todoアプリ MUIversion
        </Typography>
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <TextField
            label="新しいタスクを追加"
            variant="outlined"
            fullWidth
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <TextField
            type="date"
            variant="outlined"
            sx={{ flexBasis: "150px" }}
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
          />
          <Button variant="contained" onClick={addTask}>
            追加
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <Button variant="outlined" onClick={toggleSortByDate}>
            並べ替え: {sortByDate ? "日付順" : "順序なし"}
          </Button>
          <Button variant="outlined" onClick={toggleSortByCompletion}>
            並べ替え: {sortByCompletion ? "完了状態" : "順序なし"}
          </Button>
        </Box>
        {sortedTasks.map((task) => (
          <Card key={task.id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                }
                label={`${task.text} (${task.date})`}
              />
            </CardContent>
            <CardActions>
              <Button color="error" onClick={() => deleteTask(task.id)}>
                削除
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </ThemeProvider>
  );
};

export default TodoApp;
