require("dotenv").config();
const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const request = require("request-promise");

//************************************************************** */
/// importing data from mock API to MongoDb
//************************************************************** */
const batchImportItem = async (req, res) => {
  try {
    const item = await request("https://cookit.proxy.beeceptor.com/items");
    let parsedItem = JSON.parse(item);
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected");
    const db = client.db("CookIt");
    await db.collection("items").insertMany(parsedItem);
    client.close();
    console.log("disconnected");
  } catch (err) {
    console.log("shit hit the fan");
  }
};

const batchImportProteins = async (req, res) => {
  try {
    const protein = await request(
      "https://cookit.proxy.beeceptor.com/proteins"
    );
    let parsedProtein = JSON.parse(protein);

    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected");
    const db = client.db("CookIt");
    await db.collection("proteins").insertMany(parsedProtein);
    client.close();
    console.log("disconnected");
  } catch (err) {
    console.log("shit hit the fan");
  }
};

// note : should have created my own Mongo _id with uuuidv4, yikes (╯°□°）╯︵ ┻━┻

batchImportItem();
batchImportProteins();
