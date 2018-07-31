const mongoose = require("mongoose");

const receiptSchema = mongoose.Schema({
  title: { type: String, required: true },
  imagePath: { type: String, required: true },
  category: { type: String, required: true },
  paymentType: { type: String, required: true },
  date: { type: Date, required: true },
  total: { type: Number, required: true },
  notes: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Receipt", receiptSchema);
