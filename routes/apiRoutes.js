const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const router = express.Router();

const jsonFilePath = path.join(
  __dirname,
  "..",
  "public",
  "dev-data-import.json"
);

router.get("/data", async (req, res) => {
  try {
    const data = await fs.readFile(jsonFilePath, "utf8");
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  } catch (error) {
    console.error("Error reading or parsing the file:", error);
    res.status(500).send("Error processing the request");
  }
});

router.get("/data/:id", async (req, res) => {
  try {
    const data = await fs.readFile(jsonFilePath, "utf8");
    const jsonData = JSON.parse(data);
    const screenData = jsonData.ARC.screens[req.params.id];
    res.json(screenData);
  } catch (error) {
    console.error("Error reading or parsing the file:", error);
    res.status(500).send("Error processing the request");
  }
});

module.exports = router;
