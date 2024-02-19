// Check if user is owns resource
const validateOwnership = (req, res, next) => {
  const ownership = req.cookies.jwt;
  if (!ownership) {
    console.log("You dont own this");
    res.redirect("/loggedin");
  } else {
    console.log("All good");
    next();
  }
};

module.exports = { validateOwnership };
