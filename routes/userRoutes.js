const express = require("express");
const router = express();
const env = require("dotenv");
const User = require("../models/user.js")
const auth = require("../auth/auth.js")
const ROLES = {
    ADMIN: "admin",
    BUYER: "buyer",
    SELLER: "seller"
}
const { Authorize } = require("../middleware/authorize.js")


router.post("/user/signup", async (req, res) => {
    try {

        const data = new User(req.body);
        const token = [data.GenerateToken()];
        const Token = data.tokens[0].token;
        const isDuplicate = await data.unique();
        if (isDuplicate) {
            return res.status(400).send("fields already exists");
        }
        await data.save();
        res.status(200).send({ "token": Token });
    }
    catch (error) {
        if (error.name === "ValidationError") {
            let errors = {};
            const arrayOfObjects = Object.keys(error.errors).map(entry => {
                return { [entry]: error.errors[entry].message };
            });
            return res.status(400).send(arrayOfObjects);
        }
        res.status(400).send("already exists");
    }

})



router.post("/user/signin", async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const userToken = await user.GenerateToken();

        if (user)
            await user.save();
        res.send({ userToken });

    }
    catch (e) {
        res.status(404).send(e)
    }


})


//ERR_HTTP_HEADERS_SENT: Cannot set headers after they are sent to the client
//That particular error occurs whenever your code attempts to send more than one response to the same reques


router.post("/user/signout", auth, async (req, res) => {
    try {
        var data = req.user;
        var present = (req.user.tokens).filter(token => {
            return token.token !== req.token;
        })
        data.tokens = present
        await data.save();
        res.status(200).send("success").redirect("user/signin")
    }
    catch (e) {
        res.status(404).send("error 404 please go to login page").redirect("/user/signin")
    }
})

router.get("/user/info", [auth, Authorize(ROLES.BUYER)], async (req, res) => {
    try {

        var data = await User.findById(req.user.id).populate("Pcomments");
        data = await data.getUserProfile();
        res.status(200).send(data);
    } catch (e) {
        console.log(e);
        res.status(404).send(e);
    }
});


//pagination
//limit,skip

//limit allows us to limit the number of results we get back for any given request
//skip allows you to iterate over pages
// GET /tasks?limit=number&skip=number(0-fisrt page(first 10),10-second page(second 10),20-third pafe(third 10))

//pagination !!!!
router.get("/allusers",auth,async (req,res)=>{
    try{
           var allUsers=await User.find({});
        //    res.send(allUsers)
           await req.user.populate({
               path:"Pcomments",
               match:{
                //   price:100 
               },
               options:{
                limit:1
               }
               //parseInt
               //allusers?limit=1&skip=2 //like this we can set query string
           })
           res.send(req.user.Pcomments)
    }
    catch(e){

    }
})

module.exports = router;


        //find is for model
        //methods is for instance

        //save is for instance
        //statics is for model




        //props.data