const express = require("express");
require("./db/mongoose");
const userRouter = require("../src/routers/user.routes");
const taskRouter = require("../src/routers/task.routes");

const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET requests are disabled!");
//   } else {
//     next();
//   }
// });

// app.use((req, res, next) => {
//   res.status(503).send("Server is currently down. Come back again!");
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}! `);
});

// const Task = require("./models/task");
// const User = require("./models/user");

// const main = async () => {
//   // const task = await Task.findById("62b995406ebad72ca8537b01");
//   // await task.populate("owner");
//   // console.log(task.owner);
//   const user = await User.findById("62b995006ebad72ca8537afb");
//   await user.populate("tasks");
//   console.log(user.tasks);
// };
// main();
