const { Router } = require("express");
const { authController } = require("../Controller/auth.Controller");
const authMiddleware = require("../middleware/auth.middleware");

const authRouter = Router();
/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registeruserController);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post("/login", authController.loginuserController);

/**
 * @route GET /api/auth/logout
 * @desc Logout a user
 * @access Public
 */
authRouter.get("/logout", authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @desc Get the authenticated user's information
 * @access Private
 */
authRouter.get("/me", authMiddleware.authUser, authController.getMeController);

module.exports = authRouter;
