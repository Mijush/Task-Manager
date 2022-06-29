require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.findByIdAndDelete("62b1d05d4bea19e402b01fb9")
//   .then((result) => {
//     console.log(result);
//     return Task.countDocuments({ completed: false });
//   })
//   .then((result) => console.log(result))
//   .catch((e) => console.log(e));

const deleteTaskAndCount = async (id) => {
  const remove = await Task.findByIdAndDelete(id);
  const count = Task.countDocuments({ completed: false });
  return count;
};

deleteTaskAndCount("62b1bc5ad5f7d9107897fbe9")
  .then((count) => console.log(count))
  .catch((e) => console.log(e));
