const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/proxy", async (req, res) => {
  try {
    const response = await axios.get(
      "http://pcontent.wartburg.edu:80/WrtApi/api/ArcOfficeConfig/Get?officeName=ARC"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching from external API:", error);
    res.status(500).send("Error fetching from external API");
  }
});

module.exports = router;
