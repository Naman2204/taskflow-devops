const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 8000;

const MONGO_HOST =
  process.env.MONGO_HOST || "localhost";


const MONGO_PORT =
  process.env.MONGO_PORT || "27017";


const MONGO_DATABASE =
  process.env.MONGO_DATABASE || "taskflow";


const MONGO_USERNAME =
  process.env.MONGO_USERNAME;


const MONGO_PASSWORD =
  process.env.MONGO_PASSWORD;



const MONGO_URL =
  MONGO_USERNAME && MONGO_PASSWORD

    ? `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?authSource=admin`

    : `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;

let databaseStatus = "disconnected";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
    databaseStatus = "connected";
  })
  .catch((err) => {
    console.log(err.message);
  });

const TaskSchema = new mongoose.Schema({
  title: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", TaskSchema);

app.get("/health", (req, res) => {
  if (databaseStatus === "connected") {
    res.json({
      status: "healthy",
      database: "connected",
    });
  } else {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
    });
  }
});

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();

  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
  });

  res.json(task);
});

app.patch("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);

  task.completed = !task.completed;

  await task.save();

  res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);

  res.json({
    message: "deleted",
  });
});

app.listen(PORT, () => {
  console.log(`TaskFlow running on port ${PORT}`);
});
