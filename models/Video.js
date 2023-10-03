const mongoose = require("mongoose");

const recordingSessionSchema = new mongoose.Schema({
  sessionID: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  // Add other fields specific to your RecordingSession schema as needed
});

const RecordingSession = mongoose.model(
  "RecordingSession",
  recordingSessionSchema
);

module.exports = RecordingSession;
