require("../src/db/mongoose");
const User = require("../src/models/user");

// ObjectId()

// User.findByIdAndUpdate("62b1cf59852b500aa93ea7f7", { age: 1 })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((e) => console.log(e));

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });
  return count;
};

updateAgeAndCount("62b1cf59852b500aa93ea7f7", 3)
  .then((count) => console.log(count))
  .catch((e) => console.log(e));
