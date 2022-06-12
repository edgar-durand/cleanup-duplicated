import { findAllWithStream, saveDocument } from "./mongodb";


/**
 * Cleanup all duplicated records for userscans.notFoundCompanies
 *
 * @param onlyCounter if {true} only returns the counter and dont perform changes in DB
 */
export const cleanupDuplicated = async (onlyCounter = false) => {
  const promises = [];

  console.log("Loading userscans from the database...");
  const users = findAllWithStream("userscans");
  const counter = {};

  console.time("cleanUp");
  await new Promise((resolve, reject) => {
    users.on("data", (user) => {
      const notFoundCompanies = [];
      user.notFoundCompanies.forEach((notFoundCompany) => {
        if (!notFoundCompanies.includes(notFoundCompany)) {
          counter[notFoundCompany] = (counter[notFoundCompany] ?? 0) + 1;
          notFoundCompanies.push(notFoundCompany);
        }
      });
      !onlyCounter &&
        promises.push(saveDocument("userscans", user._id, { notFoundCompanies }));
    }).on("error", (error) => {
      reject(error);
    }).on("end", () => {
      resolve(true);
    });
  });

  !onlyCounter && promises.length && (await Promise.all(promises));
  console.timeEnd("cleanUp");
  return counter;
};