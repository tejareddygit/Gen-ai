const userModel = require("../Models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../Models/blacklistModel");

/**
 * Registers a new user
 *
 */
async function registeruserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide username ,email, password",
    });
  }
  /**
   * if user already exists with the same username or email, return an error message
   */

  const isUserExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExists) {
    return res.status(400).json({
      message: "Account already exists with username or email",
    });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashed,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
    },
  });
}
/**
 * Login user
 *
 */

async function loginuserController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const ispasswordValid = await bcrypt.compare(password, user.password);

  if (!ispasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "User login successful",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * Logout user
 */

async function logoutUserController(req, res) {
  const token = req.cookies.token;

  if (token) {
    await blacklistModel.create({ token: token });
  }

  res.clearCookie("token");

  res.status(201).json({
    message: "User is logged out successfully",
  });
}

/**
 * Get the authenticated user's information
 */
async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    message: "User data is fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

module.exports = {
  authController: {
    registeruserController,
    loginuserController,
    logoutUserController,
    getMeController,
  },
};
