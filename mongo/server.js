"use strict";
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(bodyParser.json());
app.use(helmet());

const PORT = 8080;

const { getItembyId, updateStock } = require("./handler");

//So I've been trying to chain HTTP methods (unsuccessfully) this way, but this doesn't seem to trigger both medhods from this route if you look at the handlers.js file, I've triggered the updateStock function by calling it in the next() inside the getItembyId function. This also creates a problem that status will return undefined in the second function because i'm sending the resquest back in the first function... yikes
app.route("/api/picks").get(getItembyId).put(updateStock);

app.listen(PORT, function () {
  console.info("🌍 Listening on port " + PORT);
});
