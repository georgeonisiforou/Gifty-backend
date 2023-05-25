var express = require("express");
var router = express.Router();
const cheerio = require("cheerio");

const WishlistItem = require("../models/wishlistItemModel");

// const createWishlistItemSchema = Joi.object({
//   text: Joi.string().min(3).max(30).required().label("TO-DO text"),
// });

//get all wishlist items
router.get("/", async (req, res) => {
  const items = await WishlistItem.find();
  res.json(items);
});

//create new wishlist item
router.post("/", async (req, res) => {
  //scrape url
  const response = await fetch(req.body.url);
  const body = await response.text();
  const $ = cheerio.load(body);

  let obj = {
    price:
      $("meta[property='og:price:amount']").attr("content") ||
      $("meta[property='product:price:amount']").attr("content"),
    title: $("meta[property='og:title']").attr("content"),
    seller: $("meta[property='og:site_name']").attr("content"),
    url: $("meta[property='og:url']").attr("content"),
    imgUrl: $("meta[property='og:image']").attr("content"),
  };

  const newItem = new WishlistItem({
    url: obj.url,
    seller: obj.seller,
    title: obj.title,
    price: obj.price,
    imgUrl: obj.imgUrl,
  });

  await newItem.save();
  const items = await WishlistItem.find();
  return res.status(201).json(items);
});

router.post("/custom", async (req, res) => {
  //scrape url
  const response = await fetch(req.body);

  const newItem = new WishlistItem({
    url: response.url,
    seller: response.seller,
    title: response.title,
    price: response.price,
    imgUrl: response.imgUrl,
  });

  await newItem.save();
  const items = await WishlistItem.find();
  return res.status(201).json(items);
});

//delete by id
router.delete("/:id", async (req, res) => {
  await WishlistItem.deleteOne({ _id: req.params.id });
  const items = await WishlistItem.find();
  return res.status(201).json(items);
});

module.exports = router;
