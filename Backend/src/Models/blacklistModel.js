const mongoose = require("mongoose");
const { applyTimestamps } = require("./User.model");

const blacklistTOkenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required to add into blackList"],
    },
  },
  { timestamps: true },
);

const blacklistModel = mongoose.model("blacklist", blacklistTOkenSchema);

module.exports = blacklistModel;
