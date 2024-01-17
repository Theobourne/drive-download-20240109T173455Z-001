const mongoose = require('mongoose');

const vendorsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const Vendor = mongoose.model('vendors', vendorsSchema);

module.exports = Vendor;
