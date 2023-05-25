const mongoose = require("mongoose");

const wishListItemSchema = new mongoose.Schema({
  url: String,
  title: String,
  price: String,
  imgUrl: String,
  seller: String,
});

const WishlistItem = mongoose.model("WishlistItem", wishListItemSchema);

module.exports = WishlistItem;
