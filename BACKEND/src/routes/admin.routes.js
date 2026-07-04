const { Router } = require('express');
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const adminRouter = Router();

/**
 * @route GET /api/admin/dashboard
 * @description Get dashboard statistics
 * @access Private (Admin only)
 */
adminRouter.get("/dashboard", authMiddleware.authUser, adminMiddleware.requireAdmin, adminController.getDashboardStats);

/**
 * @route GET /api/admin/users
 * @description Get all users with pagination
 * @access Private (Admin only)
 */
adminRouter.get("/users", authMiddleware.authUser, adminMiddleware.requireAdmin, adminController.getAllUsers);

/**
 * @route PATCH /api/admin/users/:userId/role
 * @description Update user role
 * @access Private (Admin only)
 */
adminRouter.patch("/users/:userId/role", authMiddleware.authUser, adminMiddleware.requireAdmin, adminController.updateUserRole);

/**
 * @route DELETE /api/admin/users/:userId
 * @description Delete a user
 * @access Private (Admin only)
 */
adminRouter.delete("/users/:userId", authMiddleware.authUser, adminMiddleware.requireAdmin, adminController.deleteUser);

module.exports = adminRouter;
