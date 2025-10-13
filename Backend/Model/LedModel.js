const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ledModel = new Schema(
  {
    outDoor: {
      type: Number,
      required: true,
      min: 0,
      default: "0"
    },
    inDoor: {
      type: Number,
      required: true,
      min: 0,
      default: "0"
    },
    p3: {
      type: Number,
      required: true,
      min: 0,
      default: "0"
    },
    p6: {
      type: Number,
      required: true,
      min: 0,
      default: "0"
    },
    ownerId: {
      type: String,
      required: true,
      default: ""
    },
  },
);

module.exports = mongoose.model("ledModel", ledModel);
