const jwt=require("jsonwebtoken")
// "../" to get out of middleware directory 
const User=require("../models/user.js")
const env=require("dotenv")
//when client logged in or signed up he takes the token 
//and when he request the route the auth middleware
//verifires adn then only gives the access
const auth=async (req,res,next)=>{


    //try can catch is used as if user is not authenticated it follows catch
    // as this middleware function is for every request for not authentication of sign in
    try{
    
    const token=req.header('Authorization').replace("Bearer ","");
    
    //get the token value value and verify
    //decoded will have _id of user
    const decoded=jwt.verify(token,process.env.SECRET_KEY)
  
  
  // console.log(decoded)
    //in token we embedded id of user(see in jwt sign method in generateAuthToken method)

    //user with crt id and the token exists in the token array
    const user=await User.findOne({_id:decoded._id,"tokens.token":token.toString() })
  
   // console.log(User)
    if(!user){
        throw new Error();
    }
    


    //this is as if there are many sessions lets say 5 and if we logout
    //from one session i should not logout from other 4 sessions
    req.token=token;
    //this is as user authenticated crtly 
    req.user=user;


    next();
    }
    catch(e){
        res.status(401).send("please authenticate")
    }
}



module.exports=auth