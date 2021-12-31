"use strict";
require("dotenv").config();
const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getItembyId = async (req, res, next) => {
  // I know it's bad pratice to receive a req.body for a .get method, although I'm not sure how to otherwise receive the structure suggested in the test. Could've easily come from params and query and create the ItemIds array
  const { itemIds } = req.body;
  const client = new MongoClient(MONGO_URI, options);
  //initial value to return
  let picks = [];
  let outOfStock = [];
  let protCode = [];
  //making sure we have data
  if (itemIds.length === 0) {
    return res
      .status(404)
      .json({ status: 404, message: "Some info is missing" });
  }
  try {
    await client.connect();
    console.log("connected");
    const db = client.db("CookIt");
    //accessing collections "items" and finding id with $in operator
    const items = await db
      .collection("items")
      .find({ id: { $in: itemIds } })
      .toArray();
    //creating array of protein code
    if (items) {
      items.map((item) => {
        let protString = item.displayName.split("-");
        if (protString[1].length !== 0) {
          protCode.push(protString[1]);
        }
      });
    }
    //accessing collections "proteins" and finding code with $in operator
    const proteins = await db
      .collection("proteins")
      .find({ code: { $in: protCode } })
      .toArray();

    //mapping items and proteins to picks || outOfStock array
    if (items || proteins) {
      items.map((item) => {
        if (item.volume === 0) {
          outOfStock.push(item.station);
        }
        picks.push(item.station);
      });
      proteins.map((item) => {
        picks.push(item.station);
      });
    }
    //returning arrays
    if (outOfStock.length === 0) {
      res.status(200).json({ status: 200, picks });
      next(updateStock(itemIds));
    } else if (picks.length === 0) {
      res.status(200).json({ status: 200, outOfStock });
    } else {
      next(updateStock(itemIds));
      res.status(200).json({ status: 200, picks, outOfStock });
    }
  } catch (err) {
    res.status(404).json({ status: 404, message: err.message });
  } finally {
    client.close();
    console.log("disconnected");
  }
};

const updateStock = async (itemIds, req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    console.log("connected");
    const db = client.db("CookIt");
    await db.collection("items").updateMany(
      //decrementing volume by 1 but not if stock is 0
      { id: { $in: itemIds }, volume: { $gt: 0 } },
      { $inc: { volume: -1 } }
    );
  } catch (err) {
    //can't return a res.status since the .get method is already returning this would cause an error in the server
    console.log(err);
  } finally {
    client.close();
    console.log("disconnected");
  }
};

module.exports = { getItembyId, updateStock };
