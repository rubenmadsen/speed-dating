const jwt = require("jsonwebtoken");

// Check if user is logged in
const authorizeUser = (req, res, next) => {
  console.log("Log");
  console.log("Token", req.cookies.jwt);
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "Äldre damer brinner bäst", (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect("/");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    console.log("There's no god-damn token");
    res.redirect("/");
  }
};

module.exports = { authorizeUser };
