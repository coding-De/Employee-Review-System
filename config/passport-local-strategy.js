// importing passport library //
const passport = require('passport');
// LocalStradegy of passport //
const LocalStrategy = require('passport-local').Strategy;


const User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email'
},
async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email }).exec();
        
        if (!user || user.password !== password) {
            console.log('invalid username/password');
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        console.log('error in finding user', err);
        return done(err);
    }
}));


// serializing the user to decide whick key is kept in the cookies 
passport.serializeUser((user, done) => {
    done(null, user.id);
})

// deserializing the user from the key int the cookies 
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).exec();

        if (!user) {
            console.log('User not found');
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        console.log('Error in finding user', err);
        return done(err);
    }
});


//check if user is authenticated
passport.checkAuthentication = (req, res, next) => {
    // if the user is sign-in , then pass on the request to the next function(controller action)
    if (req.isAuthenticated()) {
        return next();
    }
    // if the user is not sign-in
    return res.redirect('/users/register');
}

passport.setAuthenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        // req .uesr contains the current signin user from the session cookie 
        // and we are sending this to the locals for views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;