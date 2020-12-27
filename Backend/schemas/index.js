const mongoose = require("mongoose");

module.exports = () => {
  const connect = () => {
    if (process.env.NODE_ENV !== "production") {
      mongoose.set("debug", true);
    }
    mongoose.connect(
      "mongodb://localhost:27017/BoardDB",
      {
        dbName: "BoardDB"
      },
      error => {
        if (error) {
          console.log("Mongoose Connection Failed", error);
        } else {
          console.log("Mongoose Connection Success");
        }
      }
    );
  };
  connect();
  mongoose.connection.on("error", error => {
    console.log("Mongoose Connection Failed", error);
  });
  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose Reconnection Start");
    connect();
  });
  require("./user");
  require("./board");
  require("./recommend");
  require("./comment");
};
