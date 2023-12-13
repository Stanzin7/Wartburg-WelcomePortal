const express = require("express");
const path = require("path");
const cors = require("cors");
const apiRoutes = require("./routes/apiRoutes");
const proxyRoutes = require("./routes/proxyRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRoutes);
app.use("/api", proxyRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/backoffice", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

module.exports = app;
