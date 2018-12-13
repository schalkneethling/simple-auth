const mongoose = require("mongoose");

const formResponses = require("./form-responses");
const User = require("../models/user");

/**
 * Utils for working with Mongo
 */
const dbUtils = {
  auth: (loginDetails, callback) => {
    User.authenticate(loginDetails, function(err, user) {
      if (err) {
        return callback(formResponses.authError(err));
      } else {
        return callback(user);
      }
    });
  },
  /**
   *
   */
  registerUser: userDetails => {
    try {
      return User.create(userDetails);
    } catch (err) {
      console.error(err);
      return new Error(`Failed to add user to database: ${err}`);
    }
  },
  /**
   * Connects to the specified database
   * @param {String} dbName - The name of the databse
   */
  connect: dbName => {
    mongoose.connect(
      `mongodb://localhost/${dbName}`,
      { useCreateIndex: true, useNewUrlParser: true }
    );
    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
      console.log("Connected");
    });
  }
};

module.exports = dbUtils;
