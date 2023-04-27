const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const getDataAPI = require("./routes/getdataapi");
const PORT = process.env.PORT || "5000";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/getdata", getDataAPI);

app.get("*", (req, res) => {
  if (req.url) {
    const name = req.url;
    const pathoffile = name;
    // if (fs.existsSync(pathoffile)) {
    res.sendFile(path.join(__dirname, "../docs/", pathoffile));
    // } else {
    //   res.json({})
    // }
  }
});

//  Start Server
app.listen(PORT, () => {
  console.log("Server listening at: " + PORT);
});
