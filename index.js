const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World, This Server is ready to serve traffic");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
