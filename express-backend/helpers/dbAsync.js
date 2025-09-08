// helpers/dbAsync.js
function findAsync(collection, query) {
  return new Promise((resolve, reject) => {
    collection.find(query, (err, docs) => {
      if (err) return reject(err);
      resolve(docs);
    });
  });
}

function findOneAsync(collection, query) {
  return new Promise((resolve, reject) => {
    collection.findOne(query, (err, doc) => {
      if (err) return reject(err);
      resolve(doc);
    });
  });
}

module.exports = { findAsync, findOneAsync };
