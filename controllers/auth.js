const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')

// Question: Why does it say 'exports' and not 'module.exports'?
exports.getLogin = (req, res) => {
    console.log(req.params)
    if (req.user) {
        return res.redirect(`/steam/${req.user.steamID}`)
    }
    res.render('login', {
        title: 'Login',
        user: req.user
    })
}

exports.postLogin = (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({msg: 'Please enter a valid email address.'})
    if (validator.isEmpty(req.body.password)) validationErrors.push({msg: 'Password cannot be blank.'})

    if (validationErrors.length) {
        req.flash('errors', validationErrors)
        return res.redirect('/login')
    }
    req.body.email = validator.normalizeEmail(req.body.email, {gmail_remove_dots: false})

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            req.flash('errors', info)
            return res.redirect('/login')
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err)
            }
            req.flash('success', {msg: 'Success! You are logged in.'})
            res.redirect(req.session.returnTo || `/steam/${user.steamID}`)
        })
    })(req, res, next)
}

exports.logout = (req, res) => {
    req.logout(() => {
        console.log('User has logged out.')
    })
    req.session.destroy((err) => {
        if (err) console.log('Error : Failed to destroy the session during logout.', err)
        req.user = null
        res.redirect('/')
    })
}

exports.getSignup = (req, res) => {
    if (req.user) {
        return res.redirect(`/steam/${req.user.steamID}`)
    }
    res.render('signup', {
        title: 'Create Account',
        // User should still be passed to view even if undefined, to avoid errors
        // when rendering partials in signup page where "user" variable is accessed.
        user: req.user
    })
}

exports.postSignup = async (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({msg: 'Please enter a valid email address.'})
    if (!validator.isLength(req.body.password, {min: 8})) validationErrors.push({msg: 'Password must be at least 8 characters long'})
    if (req.body.password !== req.body.confirmPassword) validationErrors.push({msg: 'Passwords do not match'})

    if (validationErrors.length) {
        req.flash('errors', validationErrors)
        return res.redirect('../signup')
    }

    req.body.email = validator.normalizeEmail(req.body.email, {gmail_remove_dots: false})

    // From user schema in user model
    const user = new User({
        email: req.body.email,
        password: req.body.password
    })

    await User.findOne({email: req.body.email},
        (err, existingUser) => {
            if (err) {
                return next(err)
            }
            // checks to see if the findOne method returned an existingUser from the user collection
            if (existingUser) {
                req.flash('errors', {msg: 'Account with that email address already exists.'})
                return res.redirect('../signup')
            } else {
                user.save((err) => {
                    if (err) {
                        return next(err)
                    }
                    req.logIn(user, (err) => {
                        if (err) {
                            console.log('error when saving')
                            return next(err)
                        }
                        console.log('save complete')
                        //redirecting to steam for login
                        //so we can get that sweet, sweet steamid
                        res.redirect('/steam')
                    })
                })
            }
        })
}
