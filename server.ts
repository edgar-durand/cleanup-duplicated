import { config } from "dotenv";
config();
import main from "./src";

const express = require("express");

const app = express();

/**
 * Clean up duplicated notfouncompanies for userscans
 * Update the notFoundCounter for notfoundcompanies
 */
app.post("/", async (req, res) => {
  main()
    .then(() => res.status(200).send())
    .catch((e) => {
      console.error(e);
      res.status(500).send(e);
  });
});

/**
 * Update the notFoundCounter for notfoundcompanies
 */
app.post("/counter", async (req, res) => {
  main(true)
    .then(() => res.status(200).send())
    .catch((e) => {
      console.error(e);
      res.status(500).send(e);
    });
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`The application is listening on port ${port}!`);
});