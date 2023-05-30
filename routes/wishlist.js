var express = require("express");
var router = express.Router();
const cheerio = require("cheerio");
const mongoosePaginate = require("mongoose-paginate-v2");

const WishlistItem = require("../models/wishlistItemModel");

//get all wishlist items
router.get("/:pageNum", async (req, res) => {
  // const items = await WishlistItem.find();
  // res.json(items);
  const pageNum = req.params.pageNum;

  const options = {
    page: pageNum,
    limit: 5,
  };
  WishlistItem.paginate({}, options, function (err, results) {
    res.json(results);
  });
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
      $("meta[property='product:price:amount']").attr("content") ||
      " (check seller's website)",
    title: $("meta[property='og:title']").attr("content"),
    seller: $("meta[property='og:site_name']").attr("content"),
    url: $("meta[property='og:url']").attr("content"),
    imgUrl: $("meta[property='og:image']").attr("content"),
  };

  //insert joi validation
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
  const newItem = new WishlistItem({
    url: req.body.url,
    seller: req.body.seller,
    title: req.body.title,
    price: req.body.price,
    imgUrl: req.body.imgUrl,
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
