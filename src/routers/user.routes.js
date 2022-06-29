const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ error: "Invalid email or password!" });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    const newTokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    req.user.tokens = newTokens;

    await req.user.save();
    res.send("Logged out!");
  } catch (e) {
    res.status(500).send();
  }
});
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send("All users logged out!");
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const user = req.user;
  const body = req.body;
  const updates = Object.keys(body);
  const allowedUpdates = ["username", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }
  try {
    updates.forEach((update) => (user[update] = body[update]));
    await user.save();

    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  // const _id = req.user_.id;
  try {
    // const user = await User.findByIdAndDelete(_id);
    // if (!user) {
    //   return res.status(404).send();
    // }
    await req.user.remove();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
