const User = require("../models/blogUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log(req.body);

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    console.log(existingUser);

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const existingemail = await User.findOne({ email });

    if (existingemail) {
      return res.status(400).json({ error: "email already exists" });
    }
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      role: role,
    });
    await newUser.save();

    res.status(201).json({ message: "the user save successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const signin = async (req, res) => {
  try {
    const { mailuserId, password } = req.body;
    console.log(req.body);

    const user = await User.find({
      $or: [
        { username: { $regex: mailuserId, $options: "i" } },
        { email: { $regex: mailuserId, $options: "i" } },
      ],
    });
    console.log(user);

    if (!user) {
      return res.status(403).json({ message: "Invalid Credentials" });
    }

    const matchedPassword = await bcrypt.compare(password, user[0].password);

    if (!matchedPassword) {
      return res.status(401).json({ error: "Invalid credential" });
    }
    const token = jwt.sign({ userId: user[0]._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour (adjust as needed)
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { signup, signin };
