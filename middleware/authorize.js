

const Authorize=(role)=>{
    return (req,res,next)=>{

        if(req.user.roles!=role){
            console.log(req.body.roles+" "+role);
           return res.status(401).send("unauthorized"+req.body.roles)
        }   
        next(); 
    }
}


// const Authorize=async (req,res,next)=>{
//     if(req.user.role)
// }
module.exports={Authorize};