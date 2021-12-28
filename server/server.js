"use strict";
const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(morgan("tiny"));
app.use(express.json());
const PORT = 8000;

const { getAllItems, getAllProteins, getItemById } = require("./handlers");

app.get("/api/items", getAllItems);
app.get("/api/prot", getAllProteins);
app.get("/api/picks", getItemById);

app.listen(PORT, function () {
  console.info("🌍 Listening on port " + PORT);
});
