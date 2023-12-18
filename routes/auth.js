const express = require("express");
const passport = require("passport");
const router = express.Router();

// &desc Auth with Google
// route GET / auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
// &desc Google auth callback
// route GET/auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// @log out user
// /auth/logout
router.get("/logout", (req, res) => {
  req.logOut(function (err) {
    if (err) {
      res.render("error/404");
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
