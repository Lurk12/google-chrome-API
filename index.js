const express = require("express");
const app = express();
const connectDB = require("./config/config");
require("dotenv").config();
const { readdirSync } = require("fs");
const cors = require("cors");
require("./models/Upload");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swaggeroptions.js");

const cron = require("node-cron");
const emptyUploadsFolder = require("./controllers/emptydir");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// Increase the request payload size limit to a larger value (e.g., 50MB)
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

readdirSync("./routes").map((path) => {
  app.use("/api", require(`./routes/${path}`));
});

app.get("/", (req, res) => {
  res.send(
    "Welcome to the API of the Chrome Session Recorder!. Visit /api-docs for the documentation."
  );
});

cron.schedule("0 */2 * * *", () => {
  emptyUploadsFolder();
});

const PORT = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
