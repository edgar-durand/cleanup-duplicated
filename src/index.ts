import { config } from "dotenv";
config();

import { cleanupDuplicated } from "./cleanupDuplicated";
import { initializeCounter } from "./initializeCounter";
import connect, { closeConnection } from "./mongodb";
const MONGODB_URI = String(process.env.MONGODB_URI);

export default async function main(onlyCounter = false) {
  try {
    await connect(MONGODB_URI);
    const counter = await cleanupDuplicated(onlyCounter);
    await initializeCounter(counter);
    closeConnection();
  } catch (e) {
    console.error(e);
  }
}

// TODO: Comment this if you are going to use the server.ts entry point (npm start)
// main()
//   .then(() => {})
//   .catch((e) => {console.error(e)})
