const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/task");

// /tasks?completed=true
// /tasks?limit=10&skip=10
// /tasks?sortBy=CreatedAt_asc(desc)
// limit skip
router.get("/tasks", auth, async (req, res) => {
  const completed = req.query.completed;
  const match = {};
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
  const sort = {};

  if (completed) {
    match.completed = completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    // const tasks = await Task.find({ owner: req.user._id });
    // await req.user.populate("tasks");
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit,
        skip,
        sort,
      },
    });
    res.status(201).send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const properties = ["description", "completed"];
  const _id = req.params.id;
  const body = req.body;
  const allowedEdits = Object.keys(body);
  const isAllowedEdit = allowedEdits.every((edit) => properties.includes(edit));

  if (!isAllowedEdit) {
    return res.status(400).send({ error: "Invalid property" });
  }

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send({ error: "Insert a correct value!" });
    }
    properties.forEach((property) => (task[property] = body[property]));
    await task.save();
    res.status(200).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    // const task = await Task.findByIdAndDelete(id);
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send({ error: "Task not found!" });
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
