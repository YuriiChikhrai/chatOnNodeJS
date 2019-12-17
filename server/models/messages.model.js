const { Schema, model } = require("mongoose");

const MessageSchema = new Schema(
  {
    date: { type: Date },
    content: { type: String },
    username: { type: String }
  },
  {
    versionKey: false,
    collection: "MessageCollection"
  }
);

module.exports = model("MessageModel", MessageSchema);
