import { deleteMany, updateOne, findAllAsArray } from "./mongodb";
import { ObjectId } from "mongodb";

/**
 * Initialize the notFoundCounter for NotFoundCompanies
 *
 * @param counter returned from cleanupDuplicated function
 */
export const initializeCounter = async (counter) => {
  const promises = [];
  console.log('initializing Counter');

  const invalids = await findAllAsArray('notfoundcompanies', { domain: /^.{1,2}$/ });
  const deleteResult = await deleteMany('notfoundcompanies', invalids);
  console.log('invalids', deleteResult.deletedCount);

  console.time('initializeCounter');
  for (let i = 0; i < Object.keys(counter).length; i++) {
    const notFoundCompanyId = Object.keys(counter)[i];
    try {
      promises.push(updateOne('notfoundcompanies', { _id: new ObjectId(notFoundCompanyId) }, { notFoundCounter: +counter[notFoundCompanyId] }));
    } catch (e) { console.log(e.message) }
  }

  const notFoundCompaniesWithoutRelations = await findAllAsArray('notfoundcompanies', { notFoundCounter: { $exists: false } })

  notFoundCompaniesWithoutRelations.forEach((notFoundCompany) => {
    promises.push(updateOne('notfoundcompanies', { _id: new ObjectId(notFoundCompany._id) }, { notFoundCounter: 0 }));
  });

  await Promise.all(promises);
  console.timeEnd('initializeCounter');
};
