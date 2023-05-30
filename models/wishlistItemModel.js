const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const wishListItemSchema = new mongoose.Schema({
  url: String,
  title: String,
  price: String,
  imgUrl: String,
  seller: String,
});

wishListItemSchema.plugin(mongoosePaginate);

const WishlistItem = mongoose.model("WishlistItem", wishListItemSchema);

module.exports = WishlistItem;
