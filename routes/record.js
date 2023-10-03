const express = require("express");
const router = express.Router();
const recordingController = require("../controllers/recording");
const {
  startRecording,
  streamRecordingData,
  stopRecordingAndSaveFile,
  streamVideo,
} = recordingController;

/**
 * @swagger
 * tags:
 *   - name: Recording
 *     description: Operations related to video recording
 */

/**
 * @swagger
 * /api/start-recording:
 *   get:
 *     summary: Start a new recording session
 *     description: Start a new video recording session.
 *     tags:
 *       - Recording
 *     responses:
 *       200:
 *         description: New recording session started successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionID:
 *                   type: string
 *                   description: The ID of the recording session.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
router.get("/start-recording", startRecording);

/**
 * @swagger
 * /api/stream-recording/{sessionID}:
 *   post:
 *     summary: Stream recording data
 *     description: Stream video recording data for a session.
 *     tags:
 *       - Recording
 *     parameters:
 *       - in: path
 *         name: sessionID
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the recording session.
 *       - in: body
 *         name: videoDataChunk
 *         description: Base64-encoded video data chunk.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             videoDataChunk:
 *               type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoDataChunk:
 *                 type: string
 *                 description: Base64-encoded video data chunk.
 *             required:
 *               - videoDataChunk
 *     responses:
 *       200:
 *         description: Video data chunk received successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       404:
 *         description: Session not found in the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Failed to stream video data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
router.post("/stream-recording/:sessionID", streamRecordingData);

/**
 * @swagger
 * /api/stop-recording/{sessionID}:
 *   post:
 *     summary: Stop recording and save the file
 *     description: Stop a recording session and save the video file.
 *     tags:
 *       - Recording
 *     parameters:
 *       - in: path
 *         name: sessionID
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the recording session.
 *     responses:
 *       200:
 *         description: Video saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 streamURL:
 *                   type: string
 *                   description: The URL to stream the saved video.
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 videoURL:
 *                   type: string
 *                   description: The URL to access the saved video file.
 *                 transcription:
 *                   type: string
 *                   description: The transcription of the video.
 *       404:
 *         description: Session not found in the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Failed to stop recording and save file.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
router.post("/stop-recording/:sessionID", stopRecordingAndSaveFile);

/**
 * @swagger
 * /api/stream/{sessionID}:
 *   get:
 *     summary: Stream video
 *     description: Stream the recorded video for a session.
 *     tags:
 *       - Recording
 *     parameters:
 *       - in: path
 *         name: sessionID
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the recording session.
 *     responses:
 *       200:
 *         description: Video stream.
 *       404:
 *         description: Video not found.
 *       500:
 *         description: Failed to stream video.
 */
router.get("/stream/:sessionID", streamVideo);

module.exports = router;
