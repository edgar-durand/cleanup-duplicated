import { Document, MongoClient, ObjectId } from "mongodb";
import * as internal from "stream";

let client: MongoClient;
export default async function(uri: string) {

  client = new MongoClient(uri);
  await client.connect();
  return client;

}

export const closeConnection = async () => {
  try {
    await client.close();
  } catch (e) {
    console.log(e)
  }
}
/**
 * Create stream results from this query
 * Query examples for filter:
 *
 * { status: "D" } --> SELECT * FROM inventory WHERE status = "D"
 * { status: { $in: [ "A", "D" ] } } --> SELECT * FROM inventory WHERE status in ("A", "D")
 * { status: "A", qty: { $lt: 30 } } --> SELECT * FROM inventory WHERE status = "A" AND qty < 30
 * { $or: [ { status: "A" }, { qty: { $lt: 30 } } ] } --> SELECT * FROM inventory WHERE status = "A" OR qty < 30
 * { status: "A", $or: [ { qty: { $lt: 30 } }, { item: /^p/ } ] } --> SELECT * FROM inventory WHERE status = "A" AND ( qty < 30 OR item LIKE "p%")
 *
 * @param collection
 * @param filter (optional) see Query examples
 */
export const findAllWithStream = (collection: string, filter?: {[key: string]: any}): internal.Readable & AsyncIterable<Document> => {
  return client.db().collection(collection).find(filter).stream();
}

/**
 * Returns array of docs that matches with filters
 * Query examples for filter:
 *
 * { status: "D" } --> SELECT * FROM inventory WHERE status = "D"
 * { status: { $in: [ "A", "D" ] } } --> SELECT * FROM inventory WHERE status in ("A", "D")
 * { status: "A", qty: { $lt: 30 } } --> SELECT * FROM inventory WHERE status = "A" AND qty < 30
 * { $or: [ { status: "A" }, { qty: { $lt: 30 } } ] } --> SELECT * FROM inventory WHERE status = "A" OR qty < 30
 * { status: "A", $or: [ { qty: { $lt: 30 } }, { item: /^p/ } ] } --> SELECT * FROM inventory WHERE status = "A" AND ( qty < 30 OR item LIKE "p%")
 *
 * @param collection
 * @param filter (optional) see Query examples
 */
export const findAllAsArray = async (collection: string, filter?: {[key: string]: any}): Promise<Document[]> => {
  return client.db().collection(collection).find(filter).toArray();
}

/**
 * Update one document that matches with filter criteria
 *
 * @param collection
 * @param filter see Query examples
 * @param updateData fields and values to update
 */
export const updateOne = async (collection: string, filter: {[key: string]: any}, updateData: any) => {

  return client.db().collection(collection).findOneAndUpdate(filter, {
    $set: { ...updateData },
  });

}

/**
 * Delete many documents that matches with each document _id given in the docs array
 *
 * @param collection
 * @param docs documents instances array
 */
export const deleteMany = function(collection: string, docs: Document[]) {
  return client.db().collection(collection).deleteMany({
    _id: { $in: docs.map(d => d._id) }
  })
}

/**
 * Update a document with a given _id (docId)
 *
 * @param collection
 * @param docId
 * @param dataToSave
 */
export const saveDocument = async (collection: string, docId: string, dataToSave: any) => {
  return client.db().collection(collection).updateOne({ _id: new ObjectId(docId) }, { $set: { ...dataToSave } });
}

/**
 * Insert new documents
 *
 * @param collection
 * @param docsData
 */
export const insertDocuments = (collection: string, docsData: Document[]) => {
  return client.db().collection(collection).insertMany(docsData);
}