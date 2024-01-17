
//check this file

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    //ref: 'Product', // Assuming you have a Product model for the referenced products
    required: true
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  series: {
    type: String,
    required: true
  },
  item_count: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  cogs: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  vendor_margin: {
    type: Number,
    required: true
  },
  order_status: {
    type: String,
    required: true
  }
}, {
  _id: false // To prevent Mongoose from generating a new _id for each cart_item
});

const cartSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  cart_item: [cartItemSchema],
  payment_at: {
    type: Date,
    required: true
  }
});

const Order = mongoose.model('orders', cartSchema);

module.exports = Order;
