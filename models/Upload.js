const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    videoUrl: {
      type: String,
    },
    filename: {
      type: String,
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Video", VideoSchema);
