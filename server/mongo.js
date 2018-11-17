const mongoose = require("mongoose");
const env = require("./env/env");

mongoose.Promise = global.Promise;

const mongoUri = `mongodb://${env.dbName}:${env.key}@${
  env.dbName
}.documents.azure.com:${env.port}/?ssl=true&replicaSet=globaldb`;

function connect() {
  return mongoose.connect(
    mongoUri,
    { useMongoClient: true }
  );
}

module.exports = {
  connect,
  mongoose
};
