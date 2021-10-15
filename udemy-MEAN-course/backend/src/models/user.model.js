const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // does not validate unique, for MongoDB use
    },
    password: { type: String, required: true },
  },
  { timestamp: true }
);

userSchema.plugin(uniqueValidator);

User = mongoose.model('User', userSchema);
module.exports = User;
