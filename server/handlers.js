"use-strict";

const request = require("request-promise");

//general fetch just to look at the data and how to access it
const getAllItems = async (req, res) => {
  try {
    const response = await request("https://cookit.proxy.beeceptor.com/items");
    res.status(200).json({ status: 200, data: JSON.parse(response) });
  } catch (err) {
    res.status(404).json({ status: 404, message: err });
  }
};
//general fetch just to look at the data and how to access it
const getAllProteins = async (req, res) => {
  try {
    const response = await request(
      "https://cookit.proxy.beeceptor.com/proteins"
    );
    res.status(200).json({ status: 200, data: JSON.parse(response) });
  } catch (err) {
    res.status(404).json({ status: 404, message: err });
  }
};
//handler to return picks and out of stock array
const getItemById = async (req, res) => {
  // I know it's bad pratice to receive a req.body for a .get method, although I'm not sure how to otherwise receive the structure suggested in the test. Could've easily come from params and query and create the ItemIds array
  const { itemIds } = req.body;
  //initial arrays to populate and return
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
    // fetch item array of object
    const item = await request("https://cookit.proxy.beeceptor.com/items");
    //parsing item from API
    let parsedItem = JSON.parse(item);
    //Filtering each item by id's
    const filteredItem = parsedItem.filter(({ id }) => itemIds.includes(id));
    // isolating protein code
    filteredItem.map((item) => {
      let protString = item.displayName.split("-");
      if (protString[1].length !== 0) {
        protCode.push(protString[1]);
      }
    });
    // fetch protein array of object
    const protein = await request(
      "https://cookit.proxy.beeceptor.com/proteins"
    );
    //parsing item from API
    let parsedProtein = JSON.parse(protein);
    // filter protein by matching code
    const filteredProtein = parsedProtein.filter(({ code }) =>
      protCode.includes(code)
    );
    // filtering station key and value to picks array
    filteredItem.map((item) => {
      if (item.volume === 0) {
        outOfStock.push(item.station);
      }
      picks.push(item.station);
    });
    filteredProtein.map((item) => {
      picks.push(item.station);
    });
    //returning content conditionnaly
    if (outOfStock.length === 0) {
      res.status(200).json({ status: 200, picks });
    } else if (picks.length === 0) {
      res.status(200).json({ status: 200, outOfStock });
    } else {
      res.status(200).json({ status: 200, picks, outOfStock });
    }
  } catch (err) {
    res.status(404).json({ status: 404, message: err });
  }
};

module.exports = { getAllItems, getAllProteins, getItemById };
