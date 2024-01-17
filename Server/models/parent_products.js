const mongoose = require('mongoose');

const parentProductsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor', // Reference to the Vendor model
    required: true
  }
});

const ParentProduct = mongoose.model('parent_products', parentProductsSchema);

module.exports = ParentProduct;

