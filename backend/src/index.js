require("dotenv").config();
const dbConnect = require("./db/dbConfig");
const app = require("./app");
const PORT = process.env.PORT || 8000;
const SERVER_URL = `http://localhost:${PORT}`;

(async function () {
  try {
    await dbConnect();
    app.on("error", (err) => {
      console.error("Express app initialization error: ", err);
    });
    app.listen(PORT, () => {
      console.log("Server started at: ", SERVER_URL);
    });
  } catch (err) {
    console.error("MongoDB Connection failed: ", err);
  }
})();
