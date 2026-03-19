import mongoose from "mongoose";

// Define the shape of a User document in MongoDB
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create and export the User model
const User = mongoose.model("User", userSchema);
export default User;
