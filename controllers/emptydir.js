const fs = require("fs");
const path = require("path");

function emptyUploadsFolder() {
  const directoryPath = path.join(__dirname, "uploads");

  // Check if the uploads folder exists
  if (fs.existsSync(directoryPath)) {
    // Get a list of files in the folder
    const files = fs.readdirSync(directoryPath);

    // Loop through the files and delete each one
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    });

    console.log("Emptied the uploads folder.");
  }
}

module.exports = emptyUploadsFolder;
