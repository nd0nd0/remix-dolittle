const mongoose = require("mongoose");
// if (!uri) {
//   throw new Error(
//     'Please define the MONGODB_URI environment variable inside .env.local'
//   )
// }

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    //TODO: Check if options to connection are not needed
    // const opts = {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // };

    cached.promise = mongoose
      .connect("mongodb://127.0.0.1:27017/pizzeria")
      .then((mongoose) => {
        return mongoose;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = dbConnect;
