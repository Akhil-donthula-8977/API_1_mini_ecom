require('dotenv').config()
const express = require("express")
const app = express();
require("./mongoose/mongoose.js")
const cookieParser = require("cookie-parser");

const Product = require("./models/product.js")
const User = require("./models/user.js")
const Cart = require("./models/cart.js")

app.use(express.json())
app.use(cookieParser("secret"))
const productRoutes = require("./routes/productRoutes.js")
const userRoutes = require("./routes/userRoutes.js")
const cartRoutes=require("./routes/cartRoutes.js")
app.use(productRoutes);
app.use(userRoutes);
app.use(cartRoutes);
app.listen(process.env.PORT || 3000, (err) => {
    console.log("listening")

})

// function dumy() {
//     var arr = [ 3,5, 2, 6, 7];
//     var ar2 = arr.filter(i => {
//         return i !== 3;
//     })
//     console.log(ar2)
// }
// dumy();

// async function dummy(){
//     const data = await User.findById("64ce546f28057db8d9e75b1f").populate("Pcomments").exec();
//     console.log(data)
// }
// dummy()

