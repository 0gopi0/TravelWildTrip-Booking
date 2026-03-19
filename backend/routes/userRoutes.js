import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET /api/users - Returns an array of user names from MongoDB
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "name"); // Fetch only the "name" field
    res.status(200).json({
      success: true,
      count: users.length,
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

// POST /api/users - Add one or many users to MongoDB
// Send from Postman: { "users": [{ "name": "Gopi" }, { "name": "Rahul" }] }
router.post("/", async (req, res) => {
    try {
        const { users } = req.body;
        const createdUsers = await User.insertMany(users);
        res.status(201).json({
            success: true,
            count: createdUsers.length,
            users: createdUsers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create users",
            error: error.message,
        });
    }
});

// DELETE /api/users/:id - Delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: `User "${user.name}" deleted`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

export default router;
