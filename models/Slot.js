const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timeSlotSchema = new Schema({
  booked: {
    type: Boolean,
    default: false
  },
  start: Number,
  end: Number
});

timeSlotSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

const SlotSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  month: Number,
  monthName: String,
  year: {
    type: Number,
    default: 2020
  },
  date: Number,
  time_slots: [timeSlotSchema]
});

SlotSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

SlotSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = Slot = mongoose.model("slots", SlotSchema);
