const express = require("express")
const auth = require("../auth/auth")
const router = express.Router();
const cookieParser = require("cookie-parser");
const Product = require("../models/product.js")
const mongoose = require("mongoose");
const Cart = require("../models/cart.js");
const ROLES = {
  ADMIN: "admin",
  BUYER: "buyer",
  SELLER: "seller"
}
const { Authorize } = require("../middleware/authorize.js");
const { ObjectId } = require("mongodb");


router.post("/cart/addcart", [auth, Authorize(ROLES.BUYER)], async (req, res) => {
  try {
    const item = new Cart({
      name: req.body.productname,
      owner: req.user.id,
      product: req.body.productid
    })
    await item.save();
    res.send("item saved successfully");
  }
  catch (e) {
    res.status(404).send(e);
  }
})

module.exports = router;
