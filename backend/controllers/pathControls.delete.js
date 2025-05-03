// Delete Methods
// DElete for tableUser
const { Workout } = require("../config/ShematableWork.js");
// delete controller deleteUsersDaTabel
exports.deleteUsersDaTabel = async (req, res) => {
  try {
    await Workout.deleteMany({});
    res.status(200).json({ message: "All workouts deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete workouts" });
  }
};
