const { errorHandler } = require("../services/errorHandlers");

const User = require("../models/User");
const Slot = require("../models/Slot");
const { createEvent } = require("../services/googleAuth");

module.exports.fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0)
      return res.status(404).json({
        message: "No users found"
      });
    return res.status(200).json({ users });
  } catch (err) {
    console.error(`Error occured while fetching users as ${err}`);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

const months = {
  1: { name: "January", days: 31 },
  2: { name: "February", days: 28 },
  3: { name: "March", days: 31 },
  4: { name: "April", days: 30 },
  5: { name: "May", days: 31 },
  6: { name: "June", days: 30 },
  7: { name: "July", days: 31 },
  8: { name: "August", days: 31 },
  9: { name: "September", days: 30 },
  10: { name: "October", days: 31 },
  11: { name: "November", days: 30 },
  12: { name: "December", days: 31 }
};

const invalidInputChecker = (month, date, start, end) => {
  let error = false;
  if (month < 1 || month > 12) {
    error = "Invalid Month";
  } else if (date < 1 || date > months[month].days) {
    error = "Invalid Date";
  } else if (start < 0 || start > end || end < start || end > 24) {
    error = "Invalid Time Slot Range";
  }
  return error;
};

module.exports.storeUserSlot = async (req, res) => {
  let error = errorHandler(req);
  if (error) {
    return res.status(400).json({ error });
  }
  try {
    const userId = req.params.id;
    const user = req.user;
    if (userId !== user.id) {
      return res.status(401).json({
        error: "User not Authorised"
      });
    }
    const { month, date, start, end } = req.body;
    error = invalidInputChecker(month, date, start, end);
    if (error) {
      return res.status(400).json({ error });
    }
    const sameDateEntry = await Slot.findOne({
      user: user.id,
      month,
      date
    });
    let savedSlot;
    if (sameDateEntry) {
      for (let i = start; i < end; i++) {
        let sameTimeSlotExists = false;
        sameDateEntry.time_slots.map((timeSlot) => {
          if (timeSlot.start === i) sameTimeSlotExists = true;
        });
        if (!sameTimeSlotExists)
          sameDateEntry.time_slots.push({
            start: i,
            end: i + 1
          });
      }
      sameDateEntry.time_slots.sort((a, b) =>
        a.start > b.start ? 1 : b.start > a.start ? -1 : 0
      );
      savedSlot = await sameDateEntry.save();
    } else {
      let timeSlots = [];
      for (let i = start; i < end; i++)
        timeSlots.push({
          start: i,
          end: i + 1
        });
      savedSlot = await new Slot({
        user: user.id,
        month,
        date,
        monthName: months[month].name,
        time_slots: timeSlots
      }).save();
    }
    return res.json({
      slot: savedSlot
    });
  } catch (err) {
    console.error(err);
    if (err.kind == "ObjectId" || error.name == "CastError") {
      return res.status(400).json({
        message: "Resource not found"
      });
    }
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
};

module.exports.fetchUserSlots = async (req, res) => {
  try {
    const userId = req.params.id;
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(400).json({
        error: "User not found"
      });
    }
    if (req.query.month) {
      const month = parseInt(req.query.month);
      if (month < 1 || month > 12) {
        return res.status(400).json({
          error: "Invalid Month"
        });
      }
      const monthSlots = await Slot.find({
        user: userId,
        month
      });
      if (monthSlots.length === 0) {
        return res.status(404).json({
          message: "No available slots for specified month"
        });
      }
      return res.json({ slots: monthSlots });
    } else {
      const months = await Slot.distinct("month", {
        user: userId
      });
      if (months.length === 0) {
        return res.status(404).json({
          message: "No available slots for specified user"
        });
      }
      return res.json({ months });
    }
  } catch (error) {
    console.error(error);
    if (error.kind == "ObjectId" || error.name == "CastError") {
      return res.status(400).json({
        error: "Resource not found"
      });
    }
    res.status(500).json({
      error: "Internal server error"
    });
  }
};

module.exports.bookSlot = async (req, res) => {
  const error = errorHandler(req);
  if (error) {
    return res.status(400).json({ error });
  }
  const googleTokens = req.google_tokens;
  const userId = req.params.id;
  if (req.user.id === userId) {
    return res.status(400).json({
      error: "Cannot book a slot for self"
    });
  }
  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    return res.status(400).json({
      error: "User not found"
    });
  }
  const slotId = req.params.slotId;
  const timeSlotId = req.query.time_slot;
  try {
    const userSlot = await Slot.findById(slotId).populate("user", "email");
    if (!userSlot) {
      return res.status(400).json({
        error: "Requested slot not found"
      });
    }
    if (userId !== userSlot.user.id) {
      return res.status(400).json({
        error: "Invalid user and slot combination"
      });
    }
    const timeSlot = userSlot.time_slots.id(timeSlotId);
    if (!timeSlot || timeSlot.booked) {
      return res.status(400).json({
        error: "Requested time slot is not available"
      });
    }
    const { year, month, date } = userSlot;
    const attendeeEmail = userSlot.user.email;
    const { summary, description } = req.body;
    const slotData = {
      year,
      month,
      date,
      timeSlot
    };
    const event = await createEvent(
      googleTokens,
      attendeeEmail,
      slotData,
      summary,
      description
    );
    if (event && event.status === 200) {
      timeSlot.booked = true;
      await userSlot.save();
      return res.json({ success: true });
    } else {
      console.error(
        `Booking slot failed with google create event response ${event}`
      );
      return res.status(500).json({
        error: "Internal Server Error"
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
};
