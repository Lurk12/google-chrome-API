const fs = require("fs");
const path = require("path");
const { execSync: exec } = require("child_process");
const { Deepgram } = require("@deepgram/sdk");
const ffmpegStatic = require("ffmpeg-static");

const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);

const recordingData = {};

const RecordingSession = require("../models/Video");

const startRecording = async (req, res) => {
  try {
    const sessionID = generateUniqueSessionID();
    const createdAt = new Date();
    console.log("New recording started: ", "Session ID:", sessionID, createdAt);
    await RecordingSession.create({ sessionID, createdAt });
    recordingData[sessionID] = { data: [], timeout: null }; // Add a timeout property

    res.status(200).json({ sessionID }); // Return the session ID as a JSON response
  } catch (error) {
    res.status(500).json({ error });
  }
};

const streamRecordingData = async (req, res) => {
  try {
    console.log("RecordingData");
    const { sessionID } = req.params;
    const sessionExists = await RecordingSession.exists({ sessionID });

    console.log(sessionID);
    console.log(sessionExists);
    console.log(recordingData);

    if (!sessionExists) {
      return res
        .status(404)
        .json({ error: "Session not found in the database" });
    }

    console.log(`Received video data chunk for session ${sessionID}`);

    const decodedVideoDataChunk = Buffer.from(
      req.body.videoDataChunk,
      "base64"
    );
    recordingData[sessionID].data.push(decodedVideoDataChunk);

    if (recordingData[sessionID].timeout) {
      clearTimeout(recordingData[sessionID].timeout);
    }

    recordingData[sessionID].timeout = setTimeout(() => {
      deleteFile(sessionID);
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    res.status(200).json({ message: "Video data chunk received successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to stream video data." });
  }
};

const stopRecordingAndSaveFile = async (req, res) => {
  try {
    const { sessionID } = req.params;
    const sessionExists = await RecordingSession.exists({ sessionID });

    if (!sessionExists) {
      return res
        .status(404)
        .json({ error: "Session not found in the database" });
    }

    if (
      recordingData[sessionID] === undefined ||
      recordingData[sessionID].data === undefined
    ) {
      return res.status(404).json({ error: "Streaming session doesn't exist" });
    }

    const videoData = Buffer.concat(recordingData[sessionID].data);
    const uniqueFilename = `${sessionID}-video.mp4`;

    const directoryPath = path.join(__dirname, "../uploads");

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    const videoURL = path.join(directoryPath, uniqueFilename);

    fs.writeFileSync(videoURL, videoData);

    clearTimeout(recordingData[sessionID].timeout);
    delete recordingData[sessionID];

    // Now, generate the stream URL and send it in the response
    const streamURL = `/stream/${sessionID}`;

    setTimeout(() => {
      deleteFile(videoURL);
    }, 5 * 60 * 1000);

    // Transcribe the video
    const transcription = await transcribeVideo(videoURL);

    res.status(200).json({
      streamURL,
      message: "Video saved successfully",
      videoURL,
      transcription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to stop recording and save file." });
  }
};

const generateUniqueSessionID = () => {
  return Date.now().toString();
};

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
    } else {
      console.log(`Deleted file: ${filePath}`);
    }
  });
};

const streamVideo = (req, res) => {
  try {
    const { sessionID } = req.params;
    const videoURL = path.join(
      __dirname,
      "../uploads",
      `${sessionID}-video.mp4`
    );

    if (!fs.existsSync(videoURL)) {
      return res.status(404).json({ error: "Video not found" });
    }

    const stat = fs.statSync(videoURL);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const file = fs.createReadStream(videoURL, { start, end });
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, headers);
      file.pipe(res);
    } else {
      const headers = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, headers);
      fs.createReadStream(videoURL).pipe(res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to stream video." });
  }
};

// transcribe video
const transcribeVideo = async (filePath) => {
  try {
    // Convert the video to WAV format using ffmpeg
    exec(
      `${ffmpegStatic} -i ${filePath} -vn -ar 44100 -ac 2 -ab 192k -f wav ${filePath}.wav`
    );

    // Read the audio file in WAV format
    const audioBuffer = fs.readFileSync(`${filePath}.wav`);

    // Transcribe the audio using Deepgram
    const transcription = await deepgram.transcription.preRecorded(
      {
        buffer: audioBuffer,
        mimetype: "audio/wav",
      },
      {
        punctuation: true, // Enable punctuation in the transcription
      }
    );

    // Delete the temporary audio file as it's no longer needed
    fs.unlinkSync(`${filePath}.wav`);

    return transcription.results;
  } catch (error) {
    console.error(error);

    // Return a meaningful error message
    throw new Error("Failed to transcribe video. Please try again later.");
  }
};

module.exports = {
  startRecording,
  streamRecordingData,
  stopRecordingAndSaveFile,
  streamVideo,
};
