const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "Mike@email.com",
  password: "lalaland",
  tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWT_SIGNATURE) }],
};
const userOneAuthToken = `Bearer ${userOne.tokens[0].token}`;

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "Alice",
  email: "alice@email.com",
  password: "lalaland",
  tokens: [{ token: jwt.sign({ _id: userTwoId }, process.env.JWT_SIGNATURE) }],
};
const userTwoAuthToken = `Bearer ${userTwo.tokens[0].token}`;

const taskOneId = new mongoose.Types.ObjectId()
const taskOne = {
    _id: taskOneId,
    desc: 'first task',
    isComplete: false,
    owner: userOneId
}

const taskTwoId = new mongoose.Types.ObjectId()
const taskTwo = {
    _id: taskTwoId,
    desc: 'second task',
    isComplete: true,
    owner: userOneId
}

const taskThreeId = new mongoose.Types.ObjectId()
const taskThree = {
    _id: taskThreeId,
    desc: 'three task',
    isComplete: false,
    owner: userTwoId
}

const setupDatabase = async()=>{
    await User.deleteMany();
    await User(userOne).save();
    await User(userTwo).save()
    await Task.deleteMany();
    await Task(taskOne).save();
    await Task(taskTwo).save();
    await Task(taskThree).save();
}

module.exports = {
    userOne,
    userOneId,
    taskOneId,
    userOneAuthToken,
    userTwoAuthToken,
    setupDatabase
}