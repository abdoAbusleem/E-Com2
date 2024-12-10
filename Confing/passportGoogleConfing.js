const User = require("../models/user");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
require("dotenv").config();

module.exports = function passportStrategy() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.client_ID,
        clientSecret: process.env.Client_secret,
        callbackURL: "/api/user/google/cb",
      },
      async function (accessToken, refreshToken, profile, email, cb) {
        const user = await User.findOne({ googleId: profile.id });
        if (!user) {
          const user = new User({ googleId: profile.id });
          await user.save();
          return cb(null, user);
        }
        return cb(null, user);
      }
    )
  );
};
