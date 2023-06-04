const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

// Replace the following with your MongoDB deployment's connection string.
const uri = `mongodb+srv://${process.env.DBUSER_NAME}:${process.env.SECRET_KEY}@cluster0.in3ib7y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const linkList = client.db("book-info").collection("link-list");

    // add a link
    app.post("/link/add", async (req, res) => {
      const link = req.body;
      const productLink = link?.originalLink;
      const query = { originalLink: productLink };
      const storedLink = await linkList.findOne(query);
      const id = storedLink?._id;
      if (storedLink?.originalLink === productLink) {
        return res.send({ acknowledged: true, insertedId: id });
      }
      const result = await linkList.insertOne(link);
      res.send(result);
    });

    // get all links
    app.get("/link/all", async (req, res) => {
      const result = await linkList
        .find({})
        .sort({ created_time: -1 })
        .toArray();
      res.send(result);
    });

    // get single link using id
    app.get("/link/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await linkList.find(query).toArray();
      res.send(result);
    });

    // update link on off
    app.put("/link/update/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body?.isOpen;
      const options = { upsert: true };
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          isOpen: status,
        },
      };
      const result = await linkList.updateOne(query, updateDoc, options);
      res.send(result);
    });

    //
  } finally {
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World, This Server is ready to serve traffic");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
