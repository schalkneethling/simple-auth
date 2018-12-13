const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  passwordConfirmation: {
    type: String,
    required: true
  }
});

// Add static authenticate method to schema
UserSchema.statics.authenticate = (loginDetails, callback) => {
  const { email, password } = loginDetails;
  User.findOne({ email: email }).exec(async (err, user) => {
    if (err) {
      let error = new Error(err);
      error.name = "MongoDB Error";
      return callback(error);
    } else if (!user) {
      let error = new Error(`No user with email address ${email}`);
      error.name = "User Not Found";
      return callback(error);
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return callback(null, user);
    } else {
      let error = new Error("Incorrect password");
      error.name = "Password Mismatch";
      return callback(error);
    }
  });
};

/* pre-save hook to encrypt password, Needs access
   to `this`, therfore uses plain function call instead
   of arrow function */
UserSchema.pre("save", function(next) {
  const saltRounds = 10;
  let user = this;
  bcrypt
    .hash(user.password, saltRounds)
    .then(hash => {
      // set the user's password to the hash
      user.password = hash;
      next();
    })
    .catch(err => {
      return next(err);
    });
});

let User = mongoose.model("User", UserSchema);
module.exports = User;
