const express = require("express");
const Task = require("../models/task");
const router = new express.Router();
const auth = require("../middleware/auth");

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=0
//GET /tasks?sortBy=createdAt:desc
router.get("/Tasks", auth, async (req, res) => {

  const match = {}

  const sort = {}


  if (req.query.completed){
    match.isComplete = req.query.completed === 'true'? true: false
  }

  if(req.query.sortBy){
    const part = req.query.sortBy.split(':');
    sort[part[0]] = part[1] === 'desc'? -1: 1
  }

  try { 
    await req.user.populate({
      path: 'tasks', 
      match,
      options: {
        limit: +req.query.limit,
        skip: +req.query.skip,
        sort
      }
    })
    const tasks = req.user.tasks
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/tasks/:id",auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id, 
      owner: req.user._id
    })

    console.log(task);
    if (!task) {
      console.log('running');
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const allowedUpdate = ["desc", "isComplete"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdate.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({
      error: "invalid updates",
    });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    })

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router