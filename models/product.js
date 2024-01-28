const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true

    },
    price: {
        type: Number,
        required: true

    },
    rating: {
        type: Number,
        default: 3
    },
    img: {
        type: Buffer
    },
    comments: [{
        type: {
            text: {
                type: String,

            },
            owner: {
                type: mongoose.Schema.ObjectId,
                ref: "User"
            }
        }
    }]


})

const Product = mongoose.model("Product", productSchema);
module.exports = Product;


