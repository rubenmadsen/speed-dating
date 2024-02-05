const jwt           = require("jsonwebtoken");


// Check if user is logged in
const authorizeUser = (req,res,next) =>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,"Äldre damer brinner bäst",(err,decodedToken) => {
            if(err){
                console.log(err);
                res.redirect("/loggedin");
            }else{
                console.log(decodedToken);
                next();
            }
        });
    }
    else{
        res.redirect("/loggedin");
    }

}

module.exports = {authorizeUser};
