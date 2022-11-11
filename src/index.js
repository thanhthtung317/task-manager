const express = require("express");
require("./db/mongoose.js");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT;

app.listen(port, () => {
  console.log("server is up on port " + port);
});

