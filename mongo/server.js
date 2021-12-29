"use strict";
const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(morgan("tiny"));
app.use(express.json());
const PORT = 8080;

const { getItembyId } = require("./handler");

app.get("/api/picks", getItembyId);

app.listen(PORT, function () {
  console.info("🌍 Listening on port " + PORT);
});
