const express = require("express")
const router = express.Router();
const auth = require("../auth/auth.js");
const Product = require("../models/product.js")
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

router.get("/products", async (req, res) => {
    try {

        const data = await Product.findById("64ce66e39b9069c88e0aa42b").populate({
            path: "comments",
            populate: {
                path: "comment",
                populate: {
                    path: "owner",
                    model: "User"
                }
            }

        })
            .exec();
        res.status(200).send(data);
    }
    catch (e) {
        console.log(e)
        res.status(404).send(e)
    }
})

router.patch("/product", auth, async (req, res) => {
    //recieves product id and comment string

    try {
        const Comment = {
            text: req.body.text,
            owner: req.user._id
        }

        //BSONError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer
        const updated = await Product.findByIdAndUpdate(req.body._id, { $push: { comments: Comment } }, { new: true })


        res.status(200).send("comment sent successfully")
    }
    catch (e) {
        console.log(e);
        res.status(400).send("bad request")

    }
})

module.exports = router;