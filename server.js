const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// ------------------------------------
// CONNECT TO MONGODB COMPASS (LOCAL)
// ------------------------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/todoDB")   // LOCAL DB
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ----------------- SCHEMA -----------------
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const todoSchema = new mongoose.Schema({
  email: String,
  task: String,
  completed: Boolean,
});

const User = mongoose.model("User", userSchema);
const Todo = mongoose.model("Todo", todoSchema);

// ----------------- LOGIN -----------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = new User({ email, password });
    await user.save();
  }

  res.json({ success: true, email });
});

// ----------------- ADD TASK -----------------
app.post("/add", async (req, res) => {
  const { email, task } = req.body;

  const newTask = new Todo({
    email,
    task,
    completed: false,
  });

  await newTask.save();
  res.json({ success: true });
});

// ----------------- GET TASKS -----------------
app.post("/tasks", async (req, res) => {
  const { email } = req.body;

  const tasks = await Todo.find({ email });
  res.json(tasks);
});

// ----------------- UPDATE TASK -----------------
app.post("/update", async (req, res) => {
  const { id, completed } = req.body;

  await Todo.findByIdAndUpdate(id, { completed });
  res.json({ success: true });
});

// ----------------- DELETE TASK -----------------
app.post("/delete", async (req, res) => {
  const { id } = req.body;

  await Todo.findByIdAndDelete(id);
  res.json({ success: true });
});

// ----------------- ROUTES -----------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/todo", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ----------------- START SERVER -----------------
app.listen(5000, () =>
  console.log("Server running at http://localhost:5000")
);
