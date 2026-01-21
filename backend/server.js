const express = require("express");
const cors = require("cors");

const sqiRoutes = require("./src/routes/sqi.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", sqiRoutes);

app.get("/", (req, res) => {
  res.send("SQI Engine is running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
