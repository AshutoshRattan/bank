const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;


const User = require('../models/User');


let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}


passport.use(new JWTStrategy(opts, async (jwtPayLoad, done) => {

    let user = await User.findById(jwtPayLoad.userId)
    if (!user) return done(null, false)
    return done(null, user);

}));

module.exports = passport;