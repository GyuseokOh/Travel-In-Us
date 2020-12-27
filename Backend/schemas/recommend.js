const mongoose = require('mongoose');

const { Schema } = mongoose;
const {
  Types: { ObjectId }
} = Schema;

const recommendSchema = new Schema({
    user: {
      type: ObjectId,
      required: true
    },
    contentid: {
      type: ObjectId,
      required: true
    }
});

module.exports = mongoose.model("Recommend", recommendSchema);