const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        
        // 1. Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            // User found, proceed to login
            return done(null, user);
        }

        // 2. If no user with Google ID, check if email is already in use
        user = await User.findOne({ email: email });

        if (user) {
            // Email is in use, link Google ID to this account
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
        }
        
        // 3. If no user found at all, create a brand new user
        const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: email,
            // No password needed for OAuth
        });
        await newUser.save();
        return done(null, newUser);

    } catch (err) {
        return done(err, false);
    }
}));