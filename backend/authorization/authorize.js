const jwt = require("jsonwebtoken");


// Check if user is logged in
const authorizeUser = (req,res,next) =>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,"Äldre damer brinner bäst",(err,decodedToken) => {
            if(err){
                console.log(err);
                res.redirect("/");
            }else{
                console.log(decodedToken);
                req.user = decodedToken;
                next();
            }
        });
    }
    else{
        console.log("There's no god-damn token");
        res.redirect("/");
    }
}

module.exports = {authorizeUser};
