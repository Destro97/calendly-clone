const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  avatar: {
    type: String
  },
  googleID: {
    type: String,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

UserSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  }
});

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  }
});

module.exports = User = mongoose.model("users", UserSchema);
